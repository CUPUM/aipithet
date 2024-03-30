import { db } from '@lib/database/db';
import {
	imagesPools,
	labelingSurveys,
	labelingSurveysEditors,
	labelingSurveysParticipants,
} from '@lib/database/schema/public';
import type { SQLWrapper } from 'drizzle-orm';
import { and, eq, exists, or } from 'drizzle-orm';
import { tru } from 'drizzle-orm-helpers';

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
	return tru;
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
						eq(labelingSurveysEditors.surveyId, surveyId ?? labelingSurveys.id),
						eq(labelingSurveysEditors.userId, userId)
					)
				)
		)
	);
}
