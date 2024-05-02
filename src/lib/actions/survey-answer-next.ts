'use server';

import { authorize } from '@lib/auth/auth';
import { db } from '@lib/database/db';
import {
	images,
	imagesPrompts,
	labelingSurveys,
	labelingSurveysAnswers,
	labelingSurveysBreaks,
	labelingSurveysPairs,
	labels,
} from '@lib/database/schema/public';
import { redirect } from '@lib/i18n/utilities-server';
import { and, asc, count, eq, gt, isNull, lt, or } from 'drizzle-orm';
import { random } from 'drizzle-orm-helpers/pg';

async function createNewPair(surveyId: string, chapterId: string) {
	// Select a random prompt, two random images, and three random labels to create a new pair.
	// The sampling mechansim ensures that all prompts are sampled equally, and that all images are sampled equally.

	const [prompt] = await db
		.select({
			id: imagesPrompts.id,
			count: count(labelingSurveysAnswers.id),
		})
		.from(imagesPrompts)
		.leftJoin(
			labelingSurveys,
			and(eq(imagesPrompts.poolId, labelingSurveys.imagePoolId), eq(labelingSurveys.id, surveyId))
		)
		.leftJoin(labelingSurveysPairs, eq(imagesPrompts.id, labelingSurveysPairs.promptId))
		.leftJoin(labelingSurveysAnswers, eq(labelingSurveysPairs.id, labelingSurveysAnswers.pairId))
		.groupBy(imagesPrompts.id)
		.orderBy(asc(count(labelingSurveysAnswers.id)), random())
		.limit(1);

	if (!prompt) {
		throw new Error('Could not pick random prompt');
	}

	const [image1, image2] = await db
		.select({ id: images.id, count: count(labelingSurveysAnswers.id) })
		.from(images)
		.leftJoin(labelingSurveys, eq(images.poolId, labelingSurveys.imagePoolId))
		.where(and(eq(labelingSurveys.id, surveyId), eq(images.promptId, prompt.id)))
		.leftJoin(
			labelingSurveysPairs,
			or(eq(images.id, labelingSurveysPairs.image1Id), eq(images.id, labelingSurveysPairs.image2Id))
		)
		.leftJoin(labelingSurveysAnswers, eq(labelingSurveysPairs.id, labelingSurveysAnswers.pairId))
		.groupBy(images.id)
		.orderBy(asc(count(labelingSurveysAnswers.id)), random())
		.limit(2);

	if (!image1 || !image2) {
		throw new Error('Too few images were gathered to build an answer leaf.');
	}

	const [label1, label2, label3] = await db
		.select({ id: labels.id, count: count(labelingSurveysAnswers.id) })
		.from(labels)
		.where(eq(labels.surveyId, surveyId))
		.leftJoin(
			labelingSurveysPairs,
			or(
				eq(labels.id, labelingSurveysPairs.label1Id),
				eq(labels.id, labelingSurveysPairs.label2Id),
				eq(labels.id, labelingSurveysPairs.label3Id)
			)
		)
		.leftJoin(labelingSurveysAnswers, eq(labelingSurveysPairs.id, labelingSurveysAnswers.pairId))
		.groupBy(labels.id)
		.orderBy(asc(count(labelingSurveysAnswers.id)), random())
		.limit(3);

	if (!label1 || !label2 || !label3) {
		throw new Error('No label found to generate image.');
	}
	const [newPair] = await db
		.insert(labelingSurveysPairs)
		.values({
			chapterId: chapterId,
			promptId: prompt.id,
			image1Id: image1.id,
			image2Id: image2.id,
			label1Id: label1.id,
			label2Id: label2.id,
			label3Id: label3.id,
			maxAnswersCount: 1,
			generationMethod: 'dynamic',
		})
		.returning();
	if (!newPair) {
		throw new Error('New answer leaf could not be inserted for an unknown reason.');
	}

	return newPair;
}

async function createBreak(
	userId: string,
	chapterId: string,
	surveyId: string,
	breakDuration: number
) {
	const now = new Date();
	const [newBreak] = await db
		.insert(labelingSurveysBreaks)
		.values({
			userId: userId,
			chapterId,
			startAt: now,
			endAt: new Date(now.getTime() + 1000 * 60 * breakDuration),
		})
		.returning();
	if (!newBreak) {
		throw new Error('New break could not be inserted for an unknown reason.');
	}

	return newBreak;
}

export default async function surveyAnswerNext(
	surveyId: string,
	chapterId: string,
	answerId: string | null
) {
	// TODO: Refactor this function to be more readable and maintainable. There potential risk of bugs and conflicts in the current implementation.
	// Potential conflicts include two users making a request at the same time, in that case the logic to select the next pair could be wrong.
	// Because both users could be given the same pair, which could lead to an overcount of the maxCount.
	const { user } = await authorize();

	// Find wheter there is an empty answer for the current user and chapter. If found, redirect to it. If not, generate a new empty placeholder answer.
	const [empty] = await db
		.select({ id: labelingSurveysAnswers.id })
		.from(labelingSurveysAnswers)
		.where(
			and(
				isNull(labelingSurveysAnswers.answeredAt),
				eq(labelingSurveysAnswers.userId, user.id),
				eq(labelingSurveysAnswers.chapterId, chapterId)
			)
		)
		.orderBy(asc(labelingSurveysAnswers.createdAt))
		.limit(1);
	if (empty) {
		redirect(`/surveys/labeling/${surveyId}/${chapterId}/${empty.id}`);
	}

	// Check how many answers for the current chapter the user has already answered.
	const [answeredCount] = await db
		.select({ count: count(labelingSurveysAnswers.id) })
		.from(labelingSurveysAnswers)
		.where(
			and(
				eq(labelingSurveysAnswers.userId, user.id),
				eq(labelingSurveysAnswers.chapterId, chapterId)
			)
		);

	if (!answeredCount) {
		throw new Error('Could not count the number of answers for the current chapter and user.');
	}

	// TODO: The logic here should not be hardcoded. It should be configurable in the database.
	let pair: { id: string } | undefined = undefined;
	if ((answeredCount.count + 1) % 3 === 0) {
		// If the user has answered 10, 20, 30, ... questions, select a pair with a maxCount not defined.
		// Must check that the pair has not been answered by the user yet.
		[pair] = await db
			.select({ id: labelingSurveysPairs.id })
			.from(labelingSurveysPairs)
			.leftJoin(
				labelingSurveysAnswers,
				and(
					eq(labelingSurveysPairs.id, labelingSurveysAnswers.pairId),
					eq(labelingSurveysAnswers.userId, user.id)
				)
			)
			.where(
				and(
					eq(labelingSurveysPairs.maxAnswersCount, -1),
					eq(labelingSurveysPairs.chapterId, chapterId),
					isNull(labelingSurveysAnswers.id)
				)
			)
			.orderBy(asc(labelingSurveysPairs.createdAt))
			.limit(1);
	} else if ((answeredCount.count + 1) % 2 === 0) {
		// If the user has answered 5, 15, 25, ... questions, select a pair with a maxCount of 3.
		// Must check that the pair has not been answered by the user yet, and that the pair has not reached the maxCount.
		const sq = db
			.select({
				pairId: labelingSurveysAnswers.pairId,
				count: count(labelingSurveysAnswers.id).as('count'),
			})
			.from(labelingSurveysAnswers)
			.groupBy(labelingSurveysAnswers.pairId)
			.as('sq');

		[pair] = await db
			.select({ id: labelingSurveysPairs.id })
			.from(labelingSurveysPairs)
			.leftJoin(sq, eq(labelingSurveysPairs.id, sq.pairId))
			.leftJoin(
				labelingSurveysAnswers,
				and(
					eq(labelingSurveysPairs.id, labelingSurveysAnswers.pairId),
					eq(labelingSurveysAnswers.userId, user.id)
				)
			)
			.where(
				and(
					isNull(labelingSurveysAnswers.id), // Check that the pair has not been answered by the user yet
					eq(labelingSurveysPairs.chapterId, chapterId), // Check that the pair is from the current chapter
					eq(labelingSurveysPairs.maxAnswersCount, 3), // Check that the pair has a maxCount of 3
					or(isNull(sq.count), lt(sq.count, labelingSurveysPairs.maxAnswersCount)) // Check that the pair has not reached the maxCount
				)
			)
			.orderBy(asc(labelingSurveysPairs.createdAt))
			.limit(1);
	} else {
		// else, select a random pair for the next question with a maxCount of 1.
		const sq = db
			.select({
				pairId: labelingSurveysAnswers.pairId,
				count: count(labelingSurveysAnswers.id).as('count'),
			})
			.from(labelingSurveysAnswers)
			.groupBy(labelingSurveysAnswers.pairId)
			.as('sq');

		[pair] = await db
			.select({ id: labelingSurveysPairs.id })
			.from(labelingSurveysPairs)
			.leftJoin(sq, eq(labelingSurveysPairs.id, sq.pairId))
			.leftJoin(
				labelingSurveysAnswers,
				and(
					eq(labelingSurveysPairs.id, labelingSurveysAnswers.pairId),
					eq(labelingSurveysAnswers.userId, user.id)
				)
			)
			.where(
				and(
					isNull(labelingSurveysAnswers.id), // Check that the pair has not been answered by the user yet
					eq(labelingSurveysPairs.chapterId, chapterId), // Check that the pair is from the current chapter
					eq(labelingSurveysPairs.maxAnswersCount, 1), // Check that the pair has a maxCount of 1
					or(isNull(sq.count), lt(sq.count, labelingSurveysPairs.maxAnswersCount)) // Check that the pair has not reached the maxCount
				)
			)
			.orderBy(asc(labelingSurveysPairs.createdAt))
			.limit(1);
	}

	if (!pair) {
		const newPair = await createNewPair(surveyId, chapterId);
		pair = { id: newPair.id };
	}

	// Create an empty answer associated to the pair
	console.log('answerId', answerId);
	const [newLeaf] = await db
		.insert(labelingSurveysAnswers)
		.values({
			userId: user.id,
			pairId: pair.id,
			surveyId,
			chapterId,
			prevAnswerId: answerId,
		})
		.returning();
	if (!newLeaf) {
		throw new Error('New answer leaf could not be inserted for an unknown reason.');
	}

	if (answerId) {
		await db
			.update(labelingSurveysAnswers)
			.set({ nextAnswerId: newLeaf.id })
			.where(eq(labelingSurveysAnswers.id, answerId));
	}

	const [survey] = await db
		.select()
		.from(labelingSurveys)
		.where(eq(labelingSurveys.id, surveyId))
		.limit(1);
	if (!survey) {
		throw new Error('Could not find the survey for the current chapter.');
	}

	if (survey.allowBreaks) {
		// Create a break event
		// Look if there was a break event in the last t minutes.
		// Look if user answered more than n questions in the last t minutes.
		const now = new Date();

		// Find if there was a break in the last t (survey.sessionDuration) minutes.
		const [lastBreak] = await db
			.select()
			.from(labelingSurveysBreaks)
			.where(
				and(
					eq(labelingSurveysBreaks.userId, user.id),
					eq(labelingSurveysBreaks.chapterId, chapterId),
					gt(
						labelingSurveysBreaks.endAt,
						new Date(now.getTime() - 1000 * 60 * survey.sessionDuration)
					)
				)
			)
			.orderBy(asc(labelingSurveysBreaks.startAt))
			.limit(1);

		console.log('lastBreak', lastBreak);

		// Find the number of answers the user answered in the last t (survey.sessionDuration) minutes since last break if one was found
		const [answeredCountInBreak] = await db
			.select({ count: count(labelingSurveysAnswers.id) })
			.from(labelingSurveysAnswers)
			.where(
				and(
					eq(labelingSurveysAnswers.userId, user.id),
					eq(labelingSurveysAnswers.chapterId, chapterId),
					gt(
						labelingSurveysAnswers.createdAt,
						lastBreak
							? lastBreak.startAt
							: new Date(now.getTime() - 1000 * 60 * survey.sessionDuration)
					)
				)
			);

		console.log('answeredCountInBreak', answeredCountInBreak);

		if (!answeredCountInBreak) {
			throw new Error('Could not count the number of answers for the current chapter and user.');
		}

		if (answeredCountInBreak.count > survey.breakFrequency) {
			console.log('Creating break');
			const newBreak = await createBreak(user.id, chapterId, surveyId, survey.breakDuration);
			redirect(`/surveys/labeling/${surveyId}/${chapterId}/break`);
		}
	}

	redirect(`/surveys/labeling/${surveyId}/${chapterId}/${newLeaf.id}`);
}
