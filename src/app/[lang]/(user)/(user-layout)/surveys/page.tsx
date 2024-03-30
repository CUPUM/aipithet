import { authorize } from '@lib/auth/auth';
import { isAllowed } from '@lib/auth/utilities';
import { Skeleton } from '@lib/components/primitives/skeleton';
import { db } from '@lib/database/db';
import { labelingSurveys, labelingSurveysTranslations } from '@lib/database/schema/public';
import Link from '@lib/i18n/Link';
import { canEditLabelingSurvey, canParticipateLabelingSurvey } from '@lib/queries/queries';
import * as m from '@translations/messages';
import { languageTag } from '@translations/runtime';
import { and, desc, eq } from 'drizzle-orm';
import { getColumns } from 'drizzle-orm-helpers';
import { Edit } from 'lucide-react';
import { Suspense } from 'react';
import { SurveyCreateForm, SurveyInvitationClaimForm } from './client';

async function ParticipatingSurveys() {
	const { user } = await authorize();
	const lang = languageTag();
	const { id, createdAt } = getColumns(labelingSurveys);
	const { title, summary } = getColumns(labelingSurveysTranslations);
	const surveys = await db
		.select({
			id,
			createdAt,
			title,
			summary,
		})
		.from(labelingSurveys)
		.leftJoin(
			labelingSurveysTranslations,
			and(
				eq(labelingSurveys.id, labelingSurveysTranslations.id),
				eq(labelingSurveysTranslations.lang, lang)
			)
		)
		.where(canParticipateLabelingSurvey({ userId: user.id }))
		.orderBy(desc(createdAt));
	return (
		<>
			{surveys.length ? (
				surveys.map((survey) => (
					<li key={survey.id}>
						<Link href={`/surveys/labeling/${survey.id}`}>{survey.title}</Link>
					</li>
				))
			) : (
				<li className="p-4 text-sm italic text-muted-foreground">{m.surveys_none_found()}</li>
			)}
		</>
	);
}

async function EditableSurveys() {
	const lang = languageTag();
	const { user } = await authorize();
	const { id, createdAt } = getColumns(labelingSurveys);
	const { title, summary } = getColumns(labelingSurveysTranslations);
	const surveys = await db
		.select({
			id,
			createdAt,
			title,
			summary,
		})
		.from(labelingSurveys)
		.leftJoin(
			labelingSurveysTranslations,
			and(
				eq(labelingSurveys.id, labelingSurveysTranslations.id),
				eq(labelingSurveysTranslations.lang, lang)
			)
		)
		.where(canEditLabelingSurvey({ userId: user.id }))
		.orderBy(desc(createdAt));
	return (
		<>
			{surveys.length ? (
				surveys.map((survey, i) => (
					<li key={survey.id}>
						<Link
							href={`/surveys/labeling/${survey.id}/edit`}
							className="group/link flex animate-puff-grow flex-row items-start gap-6 rounded-sm border border-background bg-accent/25 px-6 py-5 transition-all duration-75 fill-mode-both hover:border-primary hover:bg-primary/10"
							style={{ animationDelay: `${i * 50 + 200}ms` }}
						>
							<div className="flex flex-1 flex-col gap-2">
								<span className="text-xs text-muted-foreground">{m.title()}</span>
								<h4 className="text-md overflow-x-hidden text-ellipsis whitespace-nowrap font-medium">
									{survey.title || <span className="italic opacity-50">{m.untitled()}</span>}
								</h4>
								<span className="text-xs text-muted-foreground">
									{m.created_at({
										date: survey.createdAt.toLocaleDateString(lang),
										time: survey.createdAt.toLocaleTimeString(lang),
									})}
								</span>
							</div>
							<div className="flex flex-[2] flex-col gap-2">
								<span className="text-xs text-muted-foreground">{m.summary()}</span>
								<h4 className="text-md text-muted-foreground">
									{survey.summary || <span className="font-light italic opacity-50">...</span>}
								</h4>
							</div>
							<Edit
								strokeWidth={2}
								className="h-4 w-4 opacity-50 transition-all group-hover/link:animate-pulse group-hover/link:opacity-100"
							/>
						</Link>
					</li>
				))
			) : (
				<li className="p-4 text-sm italic text-muted-foreground">{m.surveys_none_found()}</li>
			)}
		</>
	);
}

export default async function Page() {
	const { user } = await authorize();
	return (
		<div className="flex w-full max-w-screen-lg flex-1 flex-col items-stretch gap-4 self-center">
			<h2 className="mb-4 text-4xl font-semibold">{m.my_surveys()}</h2>
			<section className="flex animate-fly-up flex-col rounded-lg border border-border bg-background delay-100 fill-mode-both">
				<h3 className="px-6 py-4 text-xl font-semibold">{m.participating()}</h3>
				<ul className="relative flex max-h-[50vh] shrink flex-col gap-2 overflow-y-auto border-t border-border p-4">
					<Suspense
						fallback={
							<Skeleton className="flex flex-col items-start gap-4 rounded-sm bg-accent/25 p-4">
								<Skeleton className="h-2 w-10 max-w-full rounded-[.35rem] bg-accent delay-200" />
								<Skeleton className="h-4 w-40 max-w-full rounded-[.35rem] bg-accent delay-500" />
								<Skeleton className="h-2 w-20 max-w-[50%] rounded-[.35rem] bg-accent delay-700" />
							</Skeleton>
						}
					>
						<ParticipatingSurveys />
					</Suspense>
				</ul>
			</section>
			<section className="flex animate-fly-up flex-col rounded-lg border border-border bg-background delay-200 fill-mode-both">
				<h3 className="px-6 py-4 text-xl font-semibold">{m.editor()}</h3>
				<ul className="relative flex max-h-[50vh] flex-col gap-2 overflow-y-auto border-t border-border p-4">
					<Suspense
						fallback={
							<Skeleton className="rounded-sm bg-accent p-6 opacity-50 delay-0 fill-mode-both">
								Loading
							</Skeleton>
						}
					>
						<EditableSurveys />
					</Suspense>
				</ul>
			</section>
			<section className="flex flex-row flex-wrap gap-4">
				{isAllowed(user, 'surveys.create') && <SurveyCreateForm />}
				<SurveyInvitationClaimForm />
			</section>
		</div>
	);
}
