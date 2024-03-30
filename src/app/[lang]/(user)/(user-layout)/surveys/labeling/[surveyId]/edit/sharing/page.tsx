import * as m from '@translations/messages';
import { SurveySharingForm } from './client';

export default async function Page(props: { params: { surveyId: string } }) {
	return (
		<>
			<SurveySharingForm />
			<section>
				<h3>{m.editors()}</h3>
			</section>
			<section>
				<h3>{m.participants()}</h3>
			</section>
		</>
	);
}
