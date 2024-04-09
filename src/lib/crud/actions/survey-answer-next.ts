'use server';

import { authorize } from '@lib/auth/auth';
import { db } from '@lib/database/db';
import {
	images,
	imagesPrompts,
	labelingSurveys,
	labelingSurveysAnswers,
	labels,
} from '@lib/database/schema/public';
import { redirect } from '@lib/i18n/utilities-server';
import { and, asc, eq, isNull } from 'drizzle-orm';
import { random } from 'drizzle-orm-helpers/pg';

export default async function surveyAnswerNext(surveyId: string, chapterId: string) {
	const { user } = await authorize();
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
	const [prompt] = await db
		.select({ id: imagesPrompts.id })
		.from(imagesPrompts)
		.limit(1)
		.orderBy(random());
	if (!prompt) {
		throw new Error('Could not pick random prompt');
	}
	const [image1, image2] = await db
		.select({ id: images.id })
		.from(images)
		.leftJoin(labelingSurveys, and(eq(images.poolId, labelingSurveys.imagePoolId)))
		.where(and(eq(labelingSurveys.id, surveyId), eq(images.promptId, prompt.id)))
		.orderBy(random())
		.limit(2);
	if (!image1 || !image2) {
		throw new Error('Too few images were gathered to build an answer leaf.');
	}
	const [label] = await db
		.select()
		.from(labels)
		.where(eq(labels.surveyId, surveyId))
		.orderBy(random())
		.limit(1);
	if (!label) {
		throw new Error('No label found to generate image.');
	}
	const [newLeaf] = await db
		.insert(labelingSurveysAnswers)
		.values({
			userId: user.id,
			chapterId: chapterId,
			image1Id: image1.id,
			image2Id: image2.id,
			labelId: label.id,
		})
		.returning();
	if (!newLeaf) {
		throw new Error('New answer leaf could not be inserted for an unknown reason.');
	}
	redirect(`/surveys/labeling/${surveyId}/${chapterId}/${newLeaf.id}`);
}
