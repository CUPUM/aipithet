import { authorize } from '@lib/auth/auth';
import { isAllowed } from '@lib/auth/utilities';
import { Button, ButtonIcon } from '@lib/components/primitives/button';
import { Skeleton } from '@lib/components/primitives/skeleton';
import { db } from '@lib/database/db';
import { labelingSurveys, labelingSurveysTranslations } from '@lib/database/schema/public';
import Link from '@lib/i18n/Link';
import { canEditLabelingSurvey, canParticipateLabelingSurvey } from '@lib/queries/queries';
import * as m from '@translations/messages';
import { languageTag } from '@translations/runtime';
import { and, desc, eq, or } from 'drizzle-orm';
import { getColumns } from 'drizzle-orm-helpers';
import { ArrowRight, FileEdit } from 'lucide-react';
import { Suspense } from 'react';
import { SurveyCreateForm, SurveyInvitationClaimForm } from './client';

async function getSurveys() {
	const { user } = await authorize();
	const lang = languageTag();
	const { id, createdAt } = getColumns(labelingSurveys);
	const { title, summary } = getColumns(labelingSurveysTranslations);
	return await db
		.select({
			id,
			title,
			summary,
			createdAt,
			isParticipant: canParticipateLabelingSurvey({ userId: user.id }).mapWith(Boolean),
			isEditor: canEditLabelingSurvey({ userId: user.id })!.mapWith(Boolean),
		})
		.from(labelingSurveys)
		.leftJoin(
			labelingSurveysTranslations,
			and(
				eq(labelingSurveysTranslations.id, labelingSurveys.id),
				eq(labelingSurveysTranslations.lang, lang)
			)
		)
		.where(
			or(
				canParticipateLabelingSurvey({ userId: user.id }),
				canEditLabelingSurvey({ userId: user.id })
			)
		)
		.orderBy(desc(createdAt));
}

async function Surveys() {
	const surveys = await getSurveys();
	const lang = languageTag();
	return surveys.map((survey) => (
		<li className="group/link relative rounded-md border border-border bg-background">
			<div className="grid cursor-pointer grid-cols-[3fr_1fr] place-content-stretch p-6">
				<div className="pointer-events-none z-10 flex flex-col gap-2">
					<h3 className="text-ellipsis whitespace-nowrap text-xl font-medium">
						{survey.title || <span className="italic opacity-50">{m.untitled()}</span>}
					</h3>
					<p className="h-20 text-ellipsis text-sm text-muted-foreground">
						{survey.summary || <span className="italic opacity-50">{m.description_none()}</span>}
					</p>
					<span className="text-sm font-thin text-muted-foreground">
						{m.created_at({
							date: survey.createdAt.toLocaleDateString(`${lang}-CA`, {
								day: 'numeric',
								month: 'short',
								year: 'numeric',
							}),
							time: survey.createdAt.toLocaleTimeString(`${lang}-CA`, { timeStyle: 'long' }),
						})}
					</span>
				</div>
				<div className="pointer-events-auto flex flex-col items-end gap-4">
					{survey.isParticipant ? (
						<Button asChild size="sm" className="z-10">
							<Link href={`/surveys/labeling/${survey.id}`} className="text-sm">
								{m.survey_open()}
								<ButtonIcon icon={ArrowRight} />
							</Link>
						</Button>
					) : null}
					{survey.isEditor ? (
						<Button asChild variant="secondary" size="sm" className="z-10">
							<Link href={`/surveys/labeling/${survey.id}/edit`} className="text-sm">
								{m.edit()}
								<ButtonIcon icon={FileEdit} />
							</Link>
						</Button>
					) : null}
				</div>
			</div>
			<Link
				href={`/surveys/labeling/${survey.id}${survey.isParticipant ? '' : '/edit'}`}
				className="absolute inset-0 rounded-[inherit] border border-transparent transition-all group-hover/link:border-primary group-hover/link:bg-border/50"
			></Link>
		</li>
	));
}

export default async function Page() {
	const { user } = await authorize();
	return (
		<div className="flex w-full max-w-screen-lg flex-1 flex-col items-stretch gap-4 self-center">
			<h2 className="mb-4 text-4xl font-semibold">{m.my_surveys()}</h2>
			<ul className="flex flex-col gap-4">
				<Suspense fallback={<Skeleton className="h-40 rounded-sm bg-border/50" />}>
					<Surveys />
				</Suspense>
			</ul>
			<section className="flex flex-row flex-wrap gap-4">
				{isAllowed(user, 'surveys.create') && <SurveyCreateForm />}
				<SurveyInvitationClaimForm />
			</section>
		</div>
	);
}
