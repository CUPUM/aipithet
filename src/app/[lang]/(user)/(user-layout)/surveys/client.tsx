'use client';

import { surveyCreate } from '@lib/actions/survey-create';
import surveyInvitationClaim from '@lib/actions/survey-invitation-claim';
import ButtonSubmit from '@lib/components/button-submit';
import { ButtonIconLoading } from '@lib/components/primitives/button';
import { ErrorMessages } from '@lib/components/primitives/error-messages';
import Field from '@lib/components/primitives/field';
import { Input } from '@lib/components/primitives/input';
import * as m from '@translations/messages';
import { ArrowRight, Plus } from 'lucide-react';
import { useState } from 'react';
import { useFormState } from 'react-dom';

export function SurveyInvitationClaimForm() {
	const [formState, formAction] = useFormState(surveyInvitationClaim, undefined);
	const [hasCode, setHasCode] = useState(false);
	return (
		<form
			action={formAction}
			className="flex flex-1 animate-fly-down flex-col gap-3 rounded-lg border border-border bg-background p-8 fill-mode-both"
			style={{ animationDelay: '200ms' }}
		>
			<h1 className="mb-4 text-xl font-semibold">{m.survey_join()}</h1>
			<Field>
				<div className="flex flex-row gap-2">
					<Input
						type="text"
						name="code"
						id="invitation-code"
						className="min-w-40 flex-1 font-mono text-lg tracking-wider placeholder:relative placeholder:-top-0.5 placeholder:font-sans placeholder:text-sm placeholder:tracking-normal"
						placeholder={m.invitation_code()}
						onInput={(e) => setHasCode(!!e.currentTarget.value.length)}
					/>
					<ButtonSubmit className="aspect-square" disabled={!hasCode}>
						<ButtonIconLoading icon={ArrowRight} />
					</ButtonSubmit>
				</div>
				<ErrorMessages errors={formState?.errors?.code?._errors} />
			</Field>
		</form>
	);
}

export function SurveyCreateForm() {
	const [_formState, formAction] = useFormState(surveyCreate, undefined);
	return (
		<form
			action={formAction}
			className="flex flex-1 animate-fly-down items-center justify-center rounded-lg border border-border bg-background p-8 fill-mode-both"
			style={{ animationDelay: '100ms' }}
		>
			<ButtonSubmit size="lg">
				<ButtonIconLoading icon={Plus} />
				{m.survey_create_long()}
			</ButtonSubmit>
		</form>
	);
}
