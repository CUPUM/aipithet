'use client';

import { surveyCreate } from '@lib/actions/survey-create';
import surveyInvitationClaim from '@lib/actions/survey-invitation-claim';
import { ButtonSubmit } from '@lib/components/button-submit';
import { ButtonIconLoading } from '@lib/components/primitives/button';
import { Input } from '@lib/components/primitives/input';
import * as m from '@translations/messages';
import { ArrowRight, PenBox } from 'lucide-react';
import { useFormState } from 'react-dom';

export function SurveyInvitationClaimForm() {
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
				<ButtonSubmit className="aspect-square">
					<ButtonIconLoading icon={ArrowRight} />
				</ButtonSubmit>
			</div>
		</form>
	);
}

export function SurveyCreateForm() {
	const [formState, formAction] = useFormState(surveyCreate, undefined);
	return (
		<form action={formAction}>
			<ButtonSubmit>
				<ButtonIconLoading icon={PenBox} />
				Start creating your own survey!
			</ButtonSubmit>
		</form>
	);
}
