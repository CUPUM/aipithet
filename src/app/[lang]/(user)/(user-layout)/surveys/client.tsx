'use client';

import { surveyCreate } from '@lib/actions/survey-create';
import surveyInvitationClaim from '@lib/actions/survey-invitation-claim';
import { ButtonIconLoading } from '@lib/components/primitives/button';
import { Input } from '@lib/components/primitives/input';
import { SubmitButton } from '@lib/components/submit-button';
import * as m from '@translations/messages';
import { ArrowRight, PenBox } from 'lucide-react';
import { useFormState } from 'react-dom';

export function ClaimSurveyInvitationForm() {
	const [formState, formAction] = useFormState(surveyInvitationClaim, undefined);
	return (
		<form action={formAction}>
			<h1>Join a survey</h1>
			<div className="flex flex-row gap-2">
				<Input
					type="text"
					name="code"
					id="invitation-code"
					className="flex-1"
					placeholder={m.invitation_code()}
				/>
				{/* <ErrorMessages errors={formState.} /> */}
				<SubmitButton className="aspect-square">
					<ButtonIconLoading icon={ArrowRight} />
				</SubmitButton>
			</div>
		</form>
	);
}

export function CreateSurveyForm() {
	const [formState, formAction] = useFormState(surveyCreate, undefined);
	return (
		<form action={formAction}>
			<SubmitButton>
				<ButtonIconLoading icon={PenBox} />
				Start creating your own survey!
			</SubmitButton>
		</form>
	);
}
