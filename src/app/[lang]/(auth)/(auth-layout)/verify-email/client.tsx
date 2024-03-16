'use client';

import { emailVerificationSend } from '@lib/actions/email-verification-send';
import { emailVerify } from '@lib/actions/email-verify';
import ButtonSubmit from '@lib/components/button-submit';
import { ButtonIconLoading, ButtonIconSpace } from '@lib/components/primitives/button';
import Field from '@lib/components/primitives/field';
import { Input } from '@lib/components/primitives/input';
import { Label } from '@lib/components/primitives/label';
import * as m from '@translations/messages';
import { KeyRound, RefreshCw } from 'lucide-react';
import { useFormState } from 'react-dom';

export function EmailVerifyForm() {
	const [_formState, formAction] = useFormState(emailVerify, { errors: {} });
	return (
		<form action={formAction} className="flex flex-col gap-4">
			<h1 className="mb-4 text-3xl font-medium">{m.email_verification_code_email_title()}</h1>
			<Field>
				<Label htmlFor="code">{m.email_verification_code()}</Label>
				<Input
					id="code"
					name="code"
					required
					className="font-mono text-xl uppercase tracking-[.5em]"
				/>
			</Field>
			<ButtonSubmit>
				<ButtonIconLoading icon={KeyRound} />
				{m.validate()}
				<ButtonIconSpace />
			</ButtonSubmit>
			<ButtonSubmit formAction={emailVerificationSend} variant="ghost" formNoValidate>
				<ButtonIconLoading icon={RefreshCw} />
				{m.verification_code_send_new()}
				<ButtonIconSpace />
			</ButtonSubmit>
		</form>
	);
}
