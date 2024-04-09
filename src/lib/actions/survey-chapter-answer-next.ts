'use server';

import { authorize } from '@lib/auth/auth';
import { db } from '@lib/database/db';
import {
	images,
	labelingSurveys,
	labelingSurveysAnswers,
	labels,
} from '@lib/database/schema/public';
import { redirect } from '@lib/i18n/utilities-server';
import { and, eq } from 'drizzle-orm';
import { random } from 'drizzle-orm-helpers/pg';

export default async function surveyChapterAnswerNext(surveyId: string, chapterId: string) {
	const { user } = await authorize();
	const [image1, image2] = await db
		.select({ id: images.id })
		.from(images)
		.leftJoin(labelingSurveys, and(eq(images.poolId, labelingSurveys.imagePoolId)))
		.where(eq(labelingSurveys.id, surveyId))
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
