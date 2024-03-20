import { authorize } from '@lib/auth/auth';
import { isAllowed } from '@lib/auth/utilities';
import { Skeleton } from '@lib/components/primitives/skeleton';
import { db } from '@lib/database/db';
import { labelingSurveys, labelingSurveysTranslations } from '@lib/database/schema/public';
import Link from '@lib/i18n/Link';
import { isEditableLabelingSurvey, isParticipatingLabelingSurvey } from '@lib/queries/queries';
import * as m from '@translations/messages';
import { languageTag } from '@translations/runtime';
import { and, eq } from 'drizzle-orm';
import { Edit } from 'lucide-react';
import { Suspense } from 'react';
import { SurveyCreateForm, SurveyInvitationClaimForm } from './client';

async function ParticipatingSurveys() {
	const { user } = await authorize();
	const surveys = await db
		.select({
			id: labelingSurveys.id,
			title: labelingSurveysTranslations.title,
			summary: labelingSurveysTranslations.summary,
		})
		.from(labelingSurveys)
		.leftJoin(
			labelingSurveysTranslations,
			and(
				eq(labelingSurveys.id, labelingSurveysTranslations.id),
				eq(labelingSurveysTranslations.lang, languageTag())
			)
		)
		.where(isParticipatingLabelingSurvey(user.id));
	return (
		<>
			{surveys.length ? (
				surveys.map((survey) => (
					<li key={survey.id}>
						<Link href={`/surveys/labeling/${survey.id}`}>{survey.title}</Link>
					</li>
				))
			) : (
				<li className="p-4 text-sm text-muted">Aucun sondage trouvé</li>
			)}
		</>
	);
}

async function EditableSurveys() {
	const { user } = await authorize();
	const surveys = await db
		.select({
			id: labelingSurveys.id,
			title: labelingSurveysTranslations.title,
			summary: labelingSurveysTranslations.summary,
		})
		.from(labelingSurveys)
		.leftJoin(
			labelingSurveysTranslations,
			and(
				eq(labelingSurveys.id, labelingSurveysTranslations.id),
				eq(labelingSurveysTranslations.lang, languageTag())
			)
		)
		.where(isEditableLabelingSurvey(user.id));
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
								<h4 className="text-md font-medium">
									{survey.title ?? <span className="italic opacity-50">{m.untitled()}</span>}
								</h4>
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
				<li className="p-4 text-sm text-muted">Aucun sondage trouvé</li>
			)}
		</>
	);
}

export default async function Page() {
	const { user } = await authorize();
	return (
		<div className="flex w-full max-w-screen-lg flex-1 flex-col items-stretch gap-5 self-center p-2">
			<section className="flex flex-col gap-4">
				<h2 className="mb-4 text-4xl font-semibold">{m.my_surveys()}</h2>
				<section className="flex animate-fly-up flex-col rounded-lg border border-border bg-background delay-100 fill-mode-both">
					<h3 className="px-6 py-4 text-xl font-semibold">{m.participating()}</h3>
					<ul className="relative flex flex-col gap-2 border-t border-border p-4">
						<Suspense
							fallback={
								<Skeleton className="rounded-sm p-6 opacity-50 delay-0 fill-mode-both">
									Loading
								</Skeleton>
							}
						>
							<ParticipatingSurveys />
						</Suspense>
					</ul>
				</section>
				<section className="flex animate-fly-up flex-col rounded-lg border border-border bg-background delay-200 fill-mode-both">
					<h3 className="px-6 py-4 text-xl font-semibold">{m.editor()}</h3>
					<ul className="relative flex flex-col gap-2 border-t border-border p-4">
						<Suspense
							fallback={
								<Skeleton className="rounded-sm p-6 opacity-50 delay-0 fill-mode-both">
									Loading
								</Skeleton>
							}
						>
							<EditableSurveys />
						</Suspense>
					</ul>
				</section>
			</section>
			<section className="flex flex-row flex-wrap gap-4">
				{isAllowed(user, 'surveys.create') && <SurveyCreateForm />}
				<SurveyInvitationClaimForm />
			</section>
		</div>
	);
}
