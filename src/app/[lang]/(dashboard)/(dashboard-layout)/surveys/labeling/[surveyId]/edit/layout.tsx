import { authorize } from '@lib/auth/auth';
import { ButtonIcon } from '@lib/components/primitives/button';
import { db } from '@lib/database/db';
import { labelingSurveys, labelingSurveysTranslations } from '@lib/database/schema/public';
import { canEditLabelingSurvey } from '@lib/queries/queries';
import * as m from '@translations/messages';
import { languageTag } from '@translations/runtime';
import { and, eq } from 'drizzle-orm';
import { notFound } from 'next/navigation';
import type { ReactNode } from 'react';
import { DashboardNavbarButton } from '../../../../client';
import {
	LABELING_SURVEY_EDITOR_ROUTES_ARR,
	LABELING_SURVEY_EDITOR_ROUTES_DETAILS,
} from './constants';

export default async function Layout(props: { children: ReactNode; params: { surveyId: string } }) {
	const lang = languageTag();
	const { user } = await authorize();
	const [survey] = await db
		.select({ title: labelingSurveysTranslations.title })
		.from(labelingSurveys)
		.leftJoin(
			labelingSurveysTranslations,
			and(
				eq(labelingSurveys.id, labelingSurveysTranslations.id),
				eq(labelingSurveysTranslations.lang, lang)
			)
		)
		.where(
			and(eq(labelingSurveys.id, props.params.surveyId), canEditLabelingSurvey({ userId: user.id }))
		)
		.limit(1);
	if (!survey) {
		notFound();
	}
	return (
		<div className="flex w-full max-w-screen-lg flex-1 flex-col items-stretch justify-start gap-6 self-center">
			<header className="flex flex-col gap-6">
				<h1 className="text-5xl font-semibold">
					{survey.title || <span className="italic opacity-50">{m.untitled()}</span>}
				</h1>
				<nav className="-mx-2 -mb-2 flex flex-row gap-1 self-start overflow-x-auto rounded-md p-2 text-sm">
					{LABELING_SURVEY_EDITOR_ROUTES_ARR.map((surveyRoute, i) => {
						const details = LABELING_SURVEY_EDITOR_ROUTES_DETAILS[surveyRoute];
						return (
							<DashboardNavbarButton
								layoutRoot={!surveyRoute}
								className="rounded-md"
								data-danger={'danger' in details ? details.danger : undefined}
								href={`/surveys/labeling/${props.params.surveyId}/edit${surveyRoute}`}
								key={`survey-route-${i}`}
								style={{ animationDelay: `${75 * i + 250}ms` }}
							>
								{'icon' in details ? <ButtonIcon icon={details.icon} /> : undefined}
								{details.t()}
							</DashboardNavbarButton>
						);
					})}
				</nav>
			</header>
			{props.children}
		</div>
	);
}
