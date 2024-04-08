import * as m from '@translations/messages';
import { SurveyDeleteForm } from './client';

export default async function Page(props: { params: { surveyId: string } }) {
	return (
		<article className="animate-fly-up rounded-lg border border-border bg-background">
			<section className="p-8">{m.coming_soon()}</section>
			<hr className="border-b border-l border-r-0 border-t-0 border-border" />
			<SurveyDeleteForm surveyId={props.params.surveyId} />
		</article>
	);
}
