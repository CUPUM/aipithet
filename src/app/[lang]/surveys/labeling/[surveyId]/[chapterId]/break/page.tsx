import { authorize } from '@lib/auth/auth';
import { db } from '@lib/database/db';
import {
	labelingSurveys,
	labelingSurveysAnswers,
	labelingSurveysBreaks,
} from '@lib/database/schema/public';
import { redirect } from '@lib/i18n/utilities-server';
import { and, asc, eq, gt, isNull, lt } from 'drizzle-orm';
import { cache } from 'react';
import Markdown from 'react-markdown';
import { TimerButton } from './client';

const getSurvey = cache(async function (surveyId: string) {
	const { user } = await authorize();

	const [survey] = await db
		.select()
		.from(labelingSurveys)
		.where(and(eq(labelingSurveys.id, surveyId)))
		.limit(1);

	if (!survey) {
		throw new Error('Survey not Found');
	}

	return survey;
});

const getBreak = cache(async function (surveyId: string, chapterId: string, date: Date) {
	const { user } = await authorize();

	const [userBreak] = await db
		.select()
		.from(labelingSurveysBreaks)
		.where(
			and(
				eq(labelingSurveysBreaks.userId, user.id),
				eq(labelingSurveysBreaks.chapterId, chapterId),
				lt(labelingSurveysBreaks.startAt, date),
				gt(labelingSurveysBreaks.endAt, date)
			)
		)
		.orderBy(asc(labelingSurveysBreaks.createdAt))
		.limit(1);
	return userBreak;
});

const getLastAnswer = cache(async function (surveyId: string, chapterId: string) {
	const { user } = await authorize();

	const [answer] = await db
		.select()
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
	return answer;
});

export default async function Page(props: { params: { surveyId: string; chapterId: string } }) {
	const survey = await getSurvey(props.params.surveyId);
	const answer = await getLastAnswer(props.params.surveyId, props.params.chapterId);

	if (!answer) {
		throw new Error('No answer found');
	}

	const userBreak = await getBreak(props.params.surveyId, props.params.chapterId, new Date());

	if (!userBreak) {
		redirect(`/surveys/labeling/${props.params.surveyId}/${props.params.chapterId}/${answer.id}`);
		return null;
	}

	return (
		<div className="flex w-full max-w-screen-lg flex-1 flex-col items-stretch justify-center gap-4 self-center">
			<Markdown>{survey.breakMessage}</Markdown>
			<TimerButton
				url={`/surveys/labeling/${props.params.surveyId}/${props.params.chapterId}/${answer.id}`}
				deadline={userBreak.endAt}
			/>
		</div>
	);
}
