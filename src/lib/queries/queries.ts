import { db } from '@lib/database/db';
import {
	labelingSurveys,
	labelingSurveysEditors,
	labelingSurveysParticipants,
} from '@lib/database/schema/public';
import { and, eq, exists, or } from 'drizzle-orm';

export function isParticipatingLabelingSurvey(userId: string) {
	return exists(
		db
			.select()
			.from(labelingSurveysParticipants)
			.where(
				and(
					eq(labelingSurveysParticipants.surveyId, labelingSurveys.id),
					eq(labelingSurveysParticipants.userId, userId)
				)
			)
	);
}

export function isEditableLabelingSurvey(userId: string) {
	return or(
		eq(labelingSurveys.createdById, userId),
		exists(
			db.select().from(labelingSurveysEditors).where(eq(labelingSurveysEditors.userId, userId))
		)
	);
}
