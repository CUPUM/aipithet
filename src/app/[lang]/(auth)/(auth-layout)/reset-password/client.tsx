'use client';

import { Button, ButtonIcon, ButtonIconSpace } from '@lib/components/primitives/button';
import { ErrorMessages } from '@lib/components/primitives/error-messages';
import { Input } from '@lib/components/primitives/input';
import { Label } from '@lib/components/primitives/label';
import LabeledField from '@lib/components/primitives/labeled-field';
import * as m from '@translations/messages';
import { RefreshCw } from 'lucide-react';
import { useEffect, useRef } from 'react';
import { useFormState, useFormStatus } from 'react-dom';
import { resetPassword } from './server';

function SubmitButton() {
	const { pending } = useFormStatus();
	return (
		<Button disabled={pending} data-loading={pending} type="submit">
			<ButtonIcon icon={RefreshCw} loading={pending} />
			{m.reset()}
			<ButtonIconSpace />
		</Button>
	);
}

export function ResetPasswordForm() {
	const [formState, formAction] = useFormState(resetPassword, undefined);
	const formRef = useRef<HTMLFormElement>(null);
	useEffect(() => {
		if (formState?.reset) {
			formRef.current?.reset();
		}
	}, [formState]);
	return (
		<form action={formAction} className="flex flex-col gap-4" ref={formRef}>
			<h1 className="text-3xl font-medium mb-4">{m.reset_password()}</h1>
			<LabeledField>
				<Label htmlFor="email">{m.email()}</Label>
				<Input type="email" name="email" id="email" />
				<ErrorMessages errors={formState?.errors?.email?._errors} />
			</LabeledField>
			<ErrorMessages errors={formState?.errors?._errors} />
			<SubmitButton />
		</form>
	);
}
