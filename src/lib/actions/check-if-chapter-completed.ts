import { authorize } from '@lib/auth/auth';
import { db } from '@lib/database/db';
import { labelingSurveysAnswers, labelingSurveysChapters } from '@lib/database/schema/public';
import { and, count, eq } from 'drizzle-orm';
import { redirect } from 'next/navigation';

export async function checkIfChapterCompleted(surveyId: string, chapterId: string) {
	const { user } = await authorize();

	const [answersCount] = await db
		.select({
			chapterId: labelingSurveysAnswers.chapterId,
			count: count(labelingSurveysAnswers.id),
		})
		.from(labelingSurveysAnswers)
		.where(
			and(
				eq(labelingSurveysAnswers.userId, user.id),
				eq(labelingSurveysAnswers.chapterId, chapterId)
			)
		)
		.groupBy(labelingSurveysAnswers.chapterId)
		.limit(1);
	const answerCount = answersCount?.count ?? 0;
	const [chapter] = await db
		.select({ maxAnswersCount: labelingSurveysChapters.maxAnswersCount })
		.from(labelingSurveysChapters)
		.where(eq(labelingSurveysChapters.id, chapterId))
		.limit(1);

	if (!chapter) {
		throw new Error('Chapter not found');
	}

	if (chapter.maxAnswersCount && answerCount >= chapter.maxAnswersCount) {
		redirect(`/surveys/labeling/${surveyId}/${chapterId}/completed`);
	}

	return answerCount;
}
