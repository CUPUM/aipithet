'use client';

import { emailVerificationSend } from '@lib/actions/email-verification-send';
import { emailVerify } from '@lib/actions/email-verify';
import {
	Button,
	ButtonIcon,
	ButtonIconLoading,
	ButtonIconSpace,
} from '@lib/components/primitives/button';
import { Input } from '@lib/components/primitives/input';
import { Label } from '@lib/components/primitives/label';
import LabeledField from '@lib/components/primitives/labeled-field';
import { SubmitButton } from '@lib/components/submit-button';
import * as m from '@translations/messages';
import { KeyRound, RefreshCw, Undo } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useFormState } from 'react-dom';

export function BackButton() {
	const router = useRouter();
	return (
		<Button onClick={() => router.back()}>
			<ButtonIcon icon={Undo} />
			{m.go_back()}
			<ButtonIconSpace />
		</Button>
	);
}

export function VerifyEmailForm() {
	const [_formState, formAction] = useFormState(emailVerify, { errors: {} });
	return (
		<form action={formAction} className="flex flex-col gap-4">
			<h1 className="text-3xl font-medium mb-4">{m.email_verification_code_email_title()}</h1>
			<LabeledField>
				<Label htmlFor="code">{m.email_verification_code()}</Label>
				<Input
					id="code"
					name="code"
					required
					className="text-xl uppercase font-mono tracking-[.5em]"
				/>
			</LabeledField>
			<SubmitButton>
				<ButtonIconLoading icon={KeyRound} />
				{m.validate()}
				<ButtonIconSpace />
			</SubmitButton>
			<SubmitButton formAction={emailVerificationSend} variant="ghost" formNoValidate>
				<ButtonIconLoading icon={RefreshCw} />
				{m.verification_code_send_new()}
				<ButtonIconSpace />
			</SubmitButton>
		</form>
	);
}
