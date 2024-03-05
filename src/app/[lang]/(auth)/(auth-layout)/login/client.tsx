'use client';

import { Button } from '@lib/components/primitives/button';
import { FieldMessage } from '@lib/components/primitives/field-message';
import { Input } from '@lib/components/primitives/input';
import { Label } from '@lib/components/primitives/label';
import LabeledField from '@lib/components/primitives/labeled-field';
import { Spinner } from '@lib/components/primitives/spinner';
import Link from '@lib/i18n/Link';
import * as m from '@translations/messages';
import { Eye, EyeOff, LogIn } from 'lucide-react';
import { useState } from 'react';
import { useFormState, useFormStatus } from 'react-dom';
import { login } from './server';

function SubmitButton() {
	const { pending } = useFormStatus();

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
	const [showPassword, setShowPassword] = useState(false);

	return (
		<form action={formAction} className="flex flex-col gap-4">
			<h1 className="text-3xl font-medium mb-4">{m.login()}</h1>
			<LabeledField>
				<Label htmlFor="email">{m.email()}</Label>
				<Input type="email" id="email" name="email" />
				{formState.errors?.email && (
					<FieldMessage type="error">{formState.errors.email.join(' ')}</FieldMessage>
				)}
			</LabeledField>
			<LabeledField>
				<Label htmlFor="password">{m.password()}</Label>
				<div className="flex flex-row gap-2 self-stretch">
					<Input
						className="flex-1"
						type={showPassword ? 'text' : 'password'}
						id="password"
						name="password"
					/>
					<Button
						variant="outline"
						className="aspect-square p-0"
						type="button"
						onClick={() => setShowPassword(!showPassword)}
					>
						{showPassword ? (
							<EyeOff className="w-[1.25em] h-[1.25em]" />
						) : (
							<Eye className="w-[1.25em] h-[1.25em]" />
						)}
					</Button>
				</div>
			</LabeledField>
			<SubmitButton />
			<Button asChild variant="link">
				<Link href="/signup">{m.signup()}</Link>
			</Button>
		</form>
	);
}
