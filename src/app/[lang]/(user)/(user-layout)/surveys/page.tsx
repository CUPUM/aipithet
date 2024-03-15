import { SurveyCreateForm, SurveyInvitationClaimForm } from './client';

export default function Page() {
	return (
		<>
			<h1>My surveys</h1>
			<section>
				<h2>Ongoing surveys</h2>
			</section>
			<SurveyInvitationClaimForm />
			{}
			<SurveyCreateForm />
		</>
	);
}
