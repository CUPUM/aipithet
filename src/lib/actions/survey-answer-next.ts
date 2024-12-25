'use server';

import { authorize } from '@lib/auth/auth';
import { db } from '@lib/database/db';
import {
	images,
	imagesPrompts,
	imagesPromptsRelation,
	labelingSurveys,
	labelingSurveysAnswers,
	labelingSurveysBreaks,
	labelingSurveysChapters,
	labelingSurveysPairs,
	labels,
} from '@lib/database/schema/public';
import { and, asc, count, eq, gt, isNull, lt, not, or } from 'drizzle-orm';
import { random } from 'drizzle-orm-helpers/pg';
import { unionAll } from 'drizzle-orm/pg-core';
import { redirect } from 'next/navigation';

async function createNewPair(surveyId: string, chapterId: string) {
	// Select a random prompt, two random images, and three random labels to create a new pair.
	// The sampling mechansim ensures that all prompts are sampled equally, and that all images are sampled equally.

	const imagesUnionSq = unionAll(
		db
			.select({ id: labelingSurveysPairs.image1Id })
			.from(labelingSurveysPairs)
			.where(eq(labelingSurveysPairs.chapterId, chapterId)),
		db
			.select({ id: labelingSurveysPairs.image2Id })
			.from(labelingSurveysPairs)
			.where(eq(labelingSurveysPairs.chapterId, chapterId))
	).as('imagesUnionSq');

	// Select only the prompts from the proper poolId, and order them by the number of occurrences.
	const [parentPrompt] = await db
		.select({ id: imagesPrompts.id, count: count(imagesUnionSq.id).as('count') })
		.from(imagesPrompts)
		.leftJoin(
			labelingSurveysChapters,
			eq(imagesPrompts.poolId, labelingSurveysChapters.imagePoolId)
		)
		.where(eq(labelingSurveysChapters.id, chapterId))
		.leftJoin(images, eq(images.promptId, imagesPrompts.id))
		.leftJoin(imagesUnionSq, eq(images.id, imagesUnionSq.id))
		.groupBy(imagesPrompts.id)
		.orderBy(asc(count(imagesUnionSq.id)), random())
		.limit(1);

	if (!parentPrompt) {
		throw new Error('Could not pick random prompt');
	}

	let [childPrompt] = await db
		.select({ id: imagesPrompts.id })
		.from(imagesPrompts)
		.leftJoin(imagesPromptsRelation, eq(imagesPrompts.id, imagesPromptsRelation.childPromptId))
		.where(eq(imagesPromptsRelation.parentPromptId, parentPrompt.id))
		.orderBy(random())
		.limit(1);

	if (!childPrompt) {
		childPrompt = parentPrompt;
	}

	console.log('Parent prompt:', parentPrompt);
	console.log('Child prompt:', childPrompt);

	const [image1] = await db
		.select({ id: images.id, ext: images.externalId, count: count(imagesUnionSq.id) })
		.from(images)
		.leftJoin(imagesUnionSq, eq(images.id, imagesUnionSq.id))
		.where(eq(images.promptId, parentPrompt.id))
		.groupBy(images.id)
		.orderBy(asc(count(imagesUnionSq.id)), random())
		.limit(1);

	if (!image1) {
		throw new Error('Could not find a first image.');
	}

	const [image2] = await db
		.select({ id: images.id, ext: images.externalId, count: count(imagesUnionSq.id) })
		.from(images)
		.leftJoin(imagesUnionSq, eq(images.id, imagesUnionSq.id))
		.where(and(eq(images.promptId, childPrompt.id), not(eq(images.id, image1.id))))
		.groupBy(images.id)
		.orderBy(asc(count(imagesUnionSq.id)), random())
		.limit(1);

	if (!image2) {
		throw new Error('Could not find a second image.');
	}

	const sq_label = unionAll(
		db.select({ id: labelingSurveysPairs.label1Id }).from(labelingSurveysPairs),
		db.select({ id: labelingSurveysPairs.label2Id }).from(labelingSurveysPairs),
		db.select({ id: labelingSurveysPairs.label3Id }).from(labelingSurveysPairs)
	).as('sq');

	const [label1, label2, label3] = await db
		.select({ id: labels.id, count: count(sq_label.id) })
		.from(labels)
		.where(eq(labels.surveyId, surveyId))
		.leftJoin(sq_label, eq(labels.id, sq_label.id))
		.groupBy(labels.id)
		.orderBy(asc(count(sq_label.id)), random())
		.limit(3);

	if (!label1 || !label2 || !label3) {
		throw new Error('No label found to generate image.');
	}

	const [newPair] = await db
		.insert(labelingSurveysPairs)
		.values({
			chapterId: chapterId,
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

async function getNextFixedPair(userId: string, chapterId: string) {
	const [pair] = await db
		.select({ id: labelingSurveysPairs.id })
		.from(labelingSurveysPairs)
		.leftJoin(
			labelingSurveysAnswers,
			and(
				eq(labelingSurveysPairs.id, labelingSurveysAnswers.pairId),
				eq(labelingSurveysAnswers.userId, userId)
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

	if (!pair) {
		throw new Error('No pair found.');
	}
	return pair;
}

async function getNextRandomPair(userId: string, chapterId: string) {
	// Check how many answers for the current chapter the user has already answered.
	const [answeredCount] = await db
		.select({ count: count(labelingSurveysAnswers.id) })
		.from(labelingSurveysAnswers)
		.where(
			and(
				eq(labelingSurveysAnswers.userId, userId),
				eq(labelingSurveysAnswers.chapterId, chapterId)
			)
		);

	if (!answeredCount) {
		throw new Error('Could not count the number of answers for the current chapter and user.');
	}
	let pair: { id: string } | undefined = undefined;
	if ((answeredCount.count + 1) % 10 === 0) {
		// If the user has answered 10, 20, 30, ... questions, select a pair with a maxCount not defined.
		// Must check that the pair has not been answered by the user yet.
		console.log('Creating a dynamic pair with maxCount not defined.');
		pair = await getNextFixedPair(userId, chapterId);
	} else if ((answeredCount.count + 1) % 5 === 0) {
		console.log('Creating a dynamic pair with maxCount not defined.');
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
					eq(labelingSurveysAnswers.userId, userId)
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
					eq(labelingSurveysAnswers.userId, userId)
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

	return pair;
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

	const [chapter] = await db
		.select()
		.from(labelingSurveysChapters)
		.where(eq(labelingSurveysChapters.id, chapterId))
		.limit(1);
	if (!chapter) {
		throw new Error('Could not find chapter.');
	}

	let pair;
	if (chapter.mode === 'fixed') {
		pair = await getNextFixedPair(user.id, chapterId);
	} else if (chapter.mode === 'random') {
		pair = await getNextRandomPair(user.id, chapterId);
	} else {
		throw new Error('Mode not supported.');
	}

	if (!pair) {
		console.log('Creating a new pair.');
		const newPair = await createNewPair(surveyId, chapterId);
		pair = { id: newPair.id };
	}

	// Create an empty answer associated to the pair
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

		if (!answeredCountInBreak) {
			throw new Error('Could not count the number of answers for the current chapter and user.');
		}

		if (answeredCountInBreak.count > survey.breakFrequency) {
			const newBreak = await createBreak(user.id, chapterId, surveyId, survey.breakDuration);
			redirect(`/surveys/labeling/${surveyId}/${chapterId}/break`);
		}
	}

	redirect(`/surveys/labeling/${surveyId}/${chapterId}/${newLeaf.id}`);
}
