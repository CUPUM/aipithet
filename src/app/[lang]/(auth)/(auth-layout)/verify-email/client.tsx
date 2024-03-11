'use client';

import { Button, ButtonIcon, ButtonIconSpace } from '@lib/components/primitives/button';
import { Input } from '@lib/components/primitives/input';
import { Label } from '@lib/components/primitives/label';
import LabeledField from '@lib/components/primitives/labeled-field';
import * as m from '@translations/messages';
import { KeyRound, RefreshCw, Undo } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useFormState, useFormStatus } from 'react-dom';
import { sendEmailVerificationCode, verifyEmail } from './server';

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

function SubmitCodeButton() {
	const { pending } = useFormStatus();
	return (
		<Button disabled={pending} data-loading={pending} type="submit">
			<ButtonIcon icon={KeyRound} loading={pending} />
			{m.validate()}
			<ButtonIconSpace />
		</Button>
	);
}

function ResendCodeButton() {
	const { pending } = useFormStatus();
	return (
		<Button
			disabled={pending}
			data-loading={pending}
			type="submit"
			formAction={sendEmailVerificationCode}
			variant="ghost"
			formNoValidate
		>
			<ButtonIcon icon={RefreshCw} loading={pending} />
			{m.verification_code_send_new()}
			<ButtonIconSpace />
		</Button>
	);
}

export function VerifyEmailForm() {
	const [_formState, formAction] = useFormState(verifyEmail, { errors: {} });
	return (
		<form action={formAction} className="flex flex-col gap-4">
			<h1 className="text-3xl font-medium mb-4">{m.email_verification_code_title()}</h1>
			<LabeledField>
				<Label htmlFor="code">{m.email_verification_code()}</Label>
				<Input
					id="code"
					name="code"
					required
					className="text-xl uppercase font-mono tracking-[.5em]"
				/>
			</LabeledField>
			<SubmitCodeButton />
			<ResendCodeButton />
		</form>
	);
}
