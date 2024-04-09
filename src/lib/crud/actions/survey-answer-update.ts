'use server';

import { authorize } from '@lib/auth/auth';
import { db } from '@lib/database/db';
import { labelingSurveysAnswers } from '@lib/database/schema/public';
import { labelingSurveysAnswersSchema, labelingSurveysSchema } from '@lib/database/validation';
import { and, eq } from 'drizzle-orm';
import { now } from 'drizzle-orm-helpers/pg';
import { validateFormData } from '../validation';
import surveyAnswerNext from './survey-answer-next';

export default async function surveyAnswerUpdate(state: unknown, formData: FormData) {
	const { user } = await authorize();
	const parsed = validateFormData(
		formData,
		labelingSurveysAnswersSchema
			.pick({
				chapterId: true,
				score: true,
				id: true,
			})
			.required({ id: true })
			.extend({
				surveyId: labelingSurveysSchema.shape.id.unwrap(),
			})
			.strip()
	);
	if (!parsed.success) {
		return parsed.fail;
	}
	await db
		.update(labelingSurveysAnswers)
		.set({ score: parsed.data.score, answeredAt: now() })
		.where(
			and(eq(labelingSurveysAnswers.id, parsed.data.id), eq(labelingSurveysAnswers.userId, user.id))
		);
	return surveyAnswerNext(parsed.data.surveyId, parsed.data.chapterId);
}
