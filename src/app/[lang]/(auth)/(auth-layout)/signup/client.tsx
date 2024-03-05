'use client';

import { Button } from '@lib/components/primitives/button';
import { Input } from '@lib/components/primitives/input';
import { Label } from '@lib/components/primitives/label';
import LabeledField from '@lib/components/primitives/labeled-field';
import { Spinner } from '@lib/components/primitives/spinner';
import Link from '@lib/i18n/Link';
import * as m from '@translations/messages';
import { UserPlus2 } from 'lucide-react';
import { useFormState, useFormStatus } from 'react-dom';
import { signup } from './server';

function SubmitButton() {
	const { pending, data, method, action } = useFormStatus();

	return (
		<Button className="gap-2" disabled={pending} data-loading={pending} type="submit">
			{pending ? (
				<Spinner className="w-[1.25em] h-[1.25em]" />
			) : (
				<UserPlus2 className="opacity-50 w-[1.25em] h-[1.25em]" />
			)}
			{m.sign_me_up()}
			<span className="w-[1.25em] select-none" />
		</Button>
	);
}

export function SignupForm() {
	const [formState, formAction] = useFormState(signup, { errors: {} });

	return (
		<form action={formAction} className="flex flex-col gap-4">
			<h1 className="text-3xl font-medium mb-4">{m.signup()}</h1>
			<LabeledField>
				<Label htmlFor="email">{m.email()}</Label>
				<Input id="email" type="email" placeholder={m.email_placeholder()} name="email" />
			</LabeledField>
			<fieldset className="grid w-full max-w-sm items-center gap-2 mt-2">
				<LabeledField>
					<Label htmlFor="password">{m.password()}</Label>
					<Input type="password" id="password" name="password" />
				</LabeledField>
				<LabeledField>
					<Label htmlFor="passwordConfirm">{m.confirm_password()}</Label>
					<Input type="password" id="passwordConfirm" name="passwordConfirm" />
				</LabeledField>
			</fieldset>
			<SubmitButton />
			{/* <hr className="mt-6 mb-2 mx-0" /> */}
			<Button asChild variant="link">
				<Link href="/login">{m.login()}</Link>
			</Button>
		</form>
	);
}
