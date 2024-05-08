import { authorize } from '@lib/auth/auth';
import { db } from '@lib/database/db';
import { users } from '@lib/database/schema/auth';
import {
	labelingSurveysAnswers,
	labelingSurveysChapters,
	labelingSurveysChaptersTranslations,
} from '@lib/database/schema/public';
import { canEditLabelingSurvey } from '@lib/queries/queries';
import * as m from '@translations/messages';
import { languageTag } from '@translations/runtime';
import { and, count, eq } from 'drizzle-orm';
import { getColumns } from 'drizzle-orm-helpers';
import { notFound } from 'next/navigation';

const getParticipants = async (surveyId: string, chapterId: string) => {
	const participants = await db
		.select({ userEmail: users.email, count: count(labelingSurveysAnswers.id) })
		.from(labelingSurveysAnswers)
		.where(
			and(
				eq(labelingSurveysAnswers.surveyId, surveyId),
				eq(labelingSurveysAnswers.chapterId, chapterId)
			)
		)
		.leftJoin(users, eq(users.id, labelingSurveysAnswers.userId))
		.groupBy(users.email);

	return participants;
};

const getChapter = async (surveyId: string, chapterId: string) => {
	const { user } = await authorize();
	const { title, description } = getColumns(labelingSurveysChaptersTranslations);
	return (
		(
			await db
				.select({
					...getColumns(labelingSurveysChapters),
					title,
					description,
				})
				.from(labelingSurveysChapters)
				.where(
					and(
						eq(labelingSurveysChapters.id, chapterId),
						canEditLabelingSurvey({
							userId: user.id,
							surveyId: labelingSurveysChapters.surveyId,
						})
					)
				)
				.leftJoin(
					labelingSurveysChaptersTranslations,
					and(
						eq(labelingSurveysChaptersTranslations.id, labelingSurveysChapters.id),
						eq(labelingSurveysChaptersTranslations.lang, languageTag())
					)
				)
				.limit(1)
		)[0] ?? null
	);
};

export default async function Page(props: { params: { surveyId: string; chapterId: string } }) {
	const { user } = await authorize();
	const chapter = await getChapter(props.params.surveyId, props.params.chapterId);

	if (!chapter) {
		notFound();
	}

	const participants = await getParticipants(props.params.surveyId, props.params.chapterId);

	return (
		<div className="flex w-full max-w-screen-lg flex-1 flex-col items-stretch justify-start gap-6 self-center">
			<header className="flex flex-col gap-6">
				<h1 className="text-5xl font-semibold">
					{chapter.title || <span className="italic opacity-50">{m.untitled()}</span>}
				</h1>
			</header>
			<main className="flex flex-col gap-6">
				<h2 className="text-3xl font-semibold">{m.participants()}</h2>
				<ul className="flex flex-col gap-6">
					{participants.map((participant) => (
						<li key={participant.userEmail} className="flex items-center gap-6">
							<span>{participant.userEmail}</span>
							<progress
								value={chapter.maxAnswersCount ? participant.count : undefined}
								max={chapter.maxAnswersCount || undefined}
								className="h-3 flex-1 [&::-webkit-progress-bar]:rounded-full [&::-webkit-progress-bar]:bg-border [&::-webkit-progress-value]:rounded-full [&::-webkit-progress-value]:bg-primary [&::-webkit-progress-value]:transition-all [&::-webkit-progress-value]:duration-500"
							/>
							<span>
								{participant.count} / {chapter.maxAnswersCount}
							</span>
						</li>
					))}
				</ul>
			</main>
		</div>
	);
}
