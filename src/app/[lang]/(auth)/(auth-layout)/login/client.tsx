'use client';

import { Button } from '@lib/components/primitives/button';
import { Input } from '@lib/components/primitives/input';
import { Label } from '@lib/components/primitives/label';
import LabeledField from '@lib/components/primitives/labeled-field';
import { Spinner } from '@lib/components/primitives/spinner';
import Link from '@lib/i18n/Link';
import * as m from '@translations/messages';
import { LogIn } from 'lucide-react';
import { useFormState, useFormStatus } from 'react-dom';
import { login } from './server';

function SubmitButton() {
	const { pending, data, method, action } = useFormStatus();

	return (
		<Button className="gap-2" disabled={pending} data-loading={pending} type="submit">
			{pending ? (
				<Spinner className="w-[1.25em] h-[1.25em]" />
			) : (
				<LogIn className="opacity-50 w-[1.25em] h-[1.25em]" />
			)}
			{m.login()}
			<span className="w-[1.25em] select-none" />
		</Button>
	);
}

export function LoginForm() {
	const [formState, formAction] = useFormState(login, { errors: {} });
	const { pending, data, method, action } = useFormStatus();

	return (
		<form action={formAction} className="flex flex-col gap-4">
			<h1 className="text-3xl font-medium mb-4">{m.login()}</h1>
			<LabeledField>
				<Label htmlFor="email">{m.email()}</Label>
				<Input type="email" id="email" name="email" />
			</LabeledField>
			<LabeledField>
				<Label htmlFor="password">{m.password()}</Label>
				<Input type="password" id="password" name="password" />
			</LabeledField>
			<SubmitButton />
			<Button asChild variant="link">
				<Link href="/signup">{m.signup()}</Link>
			</Button>
		</form>
	);
}
