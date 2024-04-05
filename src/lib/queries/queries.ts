import { db } from '@lib/database/db';
import {
	imagesPools,
	imagesPoolsEditors,
	labelingSurveys,
	labelingSurveysEditors,
	labelingSurveysParticipants,
} from '@lib/database/schema/public';
import type { SQLWrapper } from 'drizzle-orm';
import { and, eq, exists, or } from 'drizzle-orm';

/**
 * @todo Implement restrictive filter.
 */
export function canEditImagePool({
	userId,
	poolId = imagesPools.id,
}: {
	userId: string | SQLWrapper;
	poolId?: string | SQLWrapper;
}) {
	return or(
		poolId !== imagesPools.id
			? exists(
					db
						.select()
						.from(imagesPools)
						.where(and(eq(imagesPools.id, poolId), eq(imagesPools.createdById, userId)))
				)
			: eq(imagesPools.createdById, userId),
		exists(
			db
				.select()
				.from(imagesPoolsEditors)
				.where(
					and(eq(imagesPoolsEditors.imagePoolId, poolId), eq(imagesPoolsEditors.userId, userId))
				)
		)
	);
}

export function canParticipateLabelingSurvey({
	userId,
	surveyId = labelingSurveys.id,
}: {
	userId: string | SQLWrapper;
	surveyId?: string | SQLWrapper;
}) {
	return exists(
		db
			.select()
			.from(labelingSurveysParticipants)
			.where(
				and(
					eq(labelingSurveysParticipants.surveyId, surveyId),
					eq(labelingSurveysParticipants.userId, userId)
				)
			)
	);
}

export function canEditLabelingSurvey({
	userId,
	surveyId = labelingSurveys.id,
}: {
	userId: string | SQLWrapper;
	surveyId?: string | SQLWrapper;
}) {
	return or(
		surveyId !== labelingSurveys.id
			? exists(
					db
						.select()
						.from(labelingSurveys)
						.where(and(eq(labelingSurveys.id, surveyId), eq(labelingSurveys.createdById, userId)))
				)
			: eq(labelingSurveys.createdById, userId),
		exists(
			db
				.select()
				.from(labelingSurveysEditors)
				.where(
					and(
						eq(labelingSurveysEditors.surveyId, surveyId),
						eq(labelingSurveysEditors.userId, userId)
					)
				)
		)
	);
}
