import surveyAnswerNext from '@lib/actions/survey-answer-next';
import { authorize } from '@lib/auth/auth';
import ButtonSubmit from '@lib/components/button-submit';
import { Button, ButtonIconLoading } from '@lib/components/primitives/button';
import { db } from '@lib/database/db';
import {
	labelingSurveysChapters,
	labelingSurveysChaptersTranslations,
} from '@lib/database/schema/public';
import { canParticipateLabelingSurvey } from '@lib/queries/queries';
import * as m from '@translations/messages';
import { languageTag } from '@translations/runtime';
import { and, eq } from 'drizzle-orm';
import { getColumns } from 'drizzle-orm-helpers';
import { ChevronLeft, Tag } from 'lucide-react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import Markdown from 'react-markdown';

async function getChapter(chapterId: string) {
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
						canParticipateLabelingSurvey({
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
}

export default async function Page(props: { params: { surveyId: string; chapterId: string } }) {
	const chapter = await getChapter(props.params.chapterId);
	if (!chapter) {
		notFound();
	}
	return (
		<article className="flex w-full flex-col gap-10 px-2 pb-20 md:px-6">
			<Link href={`/surveys/labeling/${props.params.surveyId}`}>
				<Button className="bg-secondary">
					<ChevronLeft />
					{m.go_back()}
				</Button>
			</Link>
			<section className="w-full max-w-screen-lg self-center">
				<header className="mb-12 flex flex-col justify-center p-6 pb-0">
					<h1 className="animate-fly-upfont-semibold text-7xl leading-tight">
						{chapter.title || <span className="italic text-muted-foreground">{m.untitled()}</span>}
					</h1>
				</header>
				<section className="survey-description mb-16 text-lg">
					{chapter.description ? (
						<Markdown>{chapter.description}</Markdown>
					) : (
						<p>{m.description_none()}</p>
					)}
				</section>
				<menu className="sticky bottom-10 flex w-full flex-row justify-center gap-2">
					<form
						action={surveyAnswerNext.bind(
							null,
							props.params.surveyId,
							props.params.chapterId,
							null
						)}
					>
						<ButtonSubmit>
							{m.resume_labeling()}
							<ButtonIconLoading icon={Tag} />
						</ButtonSubmit>
					</form>
				</menu>
			</section>
		</article>
	);
}
