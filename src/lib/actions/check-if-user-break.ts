import { authorize } from '@lib/auth/auth';
import { db } from '@lib/database/db';
import { labelingSurveysBreaks } from '@lib/database/schema/public';
import { and, eq, gt, lt } from 'drizzle-orm';
import { redirect } from 'next/navigation';

export async function checkIfUserBreak(surveyId: string, chapterId: string) {
	const { user } = await authorize();

	const now = new Date();

	//Check if there is a break active for the current user and chapter, if so, redirect to it.
	const [userBreak] = await db
		.select()
		.from(labelingSurveysBreaks)
		.where(
			and(
				eq(labelingSurveysBreaks.userId, user.id),
				eq(labelingSurveysBreaks.chapterId, chapterId),
				lt(labelingSurveysBreaks.startAt, now),
				gt(labelingSurveysBreaks.endAt, now)
			)
		)
		.limit(1);

	// If there is a break active, redirect to it.
	if (userBreak) {
		redirect(`/surveys/labeling/${surveyId}/${chapterId}/break`);
	}
}
