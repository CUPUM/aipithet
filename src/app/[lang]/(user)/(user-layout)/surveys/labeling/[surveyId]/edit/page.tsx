import { authorize } from '@lib/auth/auth';
import { CACHE_TAGS } from '@lib/constants';
import { labelingSurveys, labelingSurveysTranslations } from '@lib/database/schema/public';
import { withTranslations } from '@lib/i18n/aggregation';
import { isEditableLabelingSurvey } from '@lib/queries/queries';
import * as m from '@translations/messages';
import { languageTag } from '@translations/runtime';
import { and, eq } from 'drizzle-orm';
import { unstable_cache as cache } from 'next/cache';
import { notFound } from 'next/navigation';
import {
	SurveyConfigurationForm,
	SurveyPresentationForm,
	SurveySecurityForm,
	SurveySharingForm,
} from './client';

const getEditorLabelingSurvey = cache(
	async function getEditorLabelingSurvey(surveyId: string) {
		const { user } = await authorize();
		const agg = withTranslations(labelingSurveys, labelingSurveysTranslations, (t, tt) => ({
			field: t.id,
			reference: tt.id,
		}));
		return (
			await agg
				.where(and(eq(labelingSurveys.id, surveyId), isEditableLabelingSurvey(user.id)))
				.limit(1)
		)[0];
	},
	[],
	{ tags: [CACHE_TAGS.EDITOR_SURVEY_PRESENTATION, CACHE_TAGS.EDITOR_SURVEY_CONFIG] }
);

export type EditorLabelingSurvey = NonNullable<Awaited<ReturnType<typeof getEditorLabelingSurvey>>>;

export default async function Page(props: { params: { surveyId: string } }) {
	const survey = await getEditorLabelingSurvey(props.params.surveyId);
	const lang = languageTag();

	if (!survey) {
		notFound();
	}

	return (
		<div className="flex w-full max-w-screen-xl flex-1 flex-col items-stretch justify-center gap-5 self-center p-2">
			<h1 className="text-4xl font-semibold">
				<span className="text-muted-foreground">{m.survey()}&thinsp;:</span>&ensp;
				{survey.translations[lang].title || (
					<span className="italic opacity-50">{m.untitled()}</span>
				)}
			</h1>
			<SurveyPresentationForm {...survey} />
			<SurveyConfigurationForm {...survey} />
			<SurveySharingForm {...survey} />
			<SurveySecurityForm {...survey} />
		</div>
	);
}
