import { authorize } from '@lib/auth/auth';
import { db } from '@lib/database/db';
import { labelingSurveys } from '@lib/database/schema/public';
import { eq } from 'drizzle-orm';
import { notFound } from 'next/navigation';
import {
	SurveyConfigurationForm,
	SurveyPresentationForm,
	SurveySecurityForm,
	SurveySharingForm,
} from './client';

export default async function Page(props: { params: { surveyId: string } }) {
	const { user } = await authorize();
	const [survey] = await db
		.select()
		.from(labelingSurveys)
		.where(eq(labelingSurveys.id, props.params.surveyId))
		.limit(1);
	if (!survey) {
		notFound();
	}
	return (
		<div className="flex w-full max-w-screen-lg flex-1 flex-col items-stretch justify-center gap-5 self-center p-2">
			<SurveyPresentationForm />
			<SurveyConfigurationForm />
			<SurveySharingForm />
			<SurveySecurityForm />
		</div>
	);
}
