'use server';

import { authorize } from '@lib/auth/auth';
import { db } from '@lib/database/db';
import { labelingSurveysAnswers } from '@lib/database/schema/public';
import { labelingSurveysAnswersSchema, labelingSurveysSchema } from '@lib/database/validation';
import { and, eq } from 'drizzle-orm';
import { now } from 'drizzle-orm-helpers/pg';
import surveyAnswerNext from './survey-answer-next';
import { validateFormData } from './validation';

export default async function surveyAnswerUpdate(
	comment: string | undefined,
	active: { 0: boolean; 1: boolean; 2: boolean },
	state: unknown,
	formData: FormData
) {
	const { user } = await authorize();
	const parsed = validateFormData(
		formData,
		labelingSurveysAnswersSchema
			.pick({
				chapterId: true,
				score1: true,
				score2: true,
				score3: true,
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
		.set({
			score1: parsed.data.score1,
			score2: parsed.data.score2,
			score3: parsed.data.score3,
			score1Answered: active[0],
			score2Answered: active[1],
			score3Answered: active[2],
			answeredAt: now(),
			comment: comment,
		})
		.where(
			and(eq(labelingSurveysAnswers.id, parsed.data.id), eq(labelingSurveysAnswers.userId, user.id))
		);

	await surveyAnswerNext(parsed.data.surveyId, parsed.data.chapterId, parsed.data.id);
}
