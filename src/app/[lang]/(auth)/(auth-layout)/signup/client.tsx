'use client';

import signup from '@lib/actions/signup';
import ButtonSubmit from '@lib/components/button-submit';
import {
	Button,
	ButtonIcon,
	ButtonIconLoading,
	ButtonIconSpace,
} from '@lib/components/primitives/button';
import { ErrorMessages } from '@lib/components/primitives/error-messages';
import Field from '@lib/components/primitives/field';
import { Input } from '@lib/components/primitives/input';
import { Label } from '@lib/components/primitives/label';
import * as m from '@translations/messages';
import { Eye, EyeOff, UserPlus } from 'lucide-react';
import { useMemo, useState } from 'react';
import { useFormState } from 'react-dom';

export function SignupForm() {
	const [formState, formAction] = useFormState(signup, undefined);
	const [showPassword, setShowPassword] = useState(false);
	const passwordInputType = useMemo(() => (showPassword ? 'text' : 'password'), [showPassword]);
	return (
		<form action={formAction} className="flex flex-col gap-4">
			<h1 className="mb-4 text-3xl font-medium">{m.signup()}</h1>
			<Field>
				<Label htmlFor="email">{m.email()}</Label>
				<Input id="email" type="email" placeholder={m.email_placeholder()} name="email" />
				<ErrorMessages errors={formState?.errors.email?._errors} />
			</Field>
			<Field>
				<Label htmlFor="password">{m.password()}</Label>
				<div className="flex flex-row gap-2 self-stretch">
					<Input className="flex-1" type={passwordInputType} id="password" name="password" />
					<Button
						variant="outline"
						className="aspect-square"
						type="button"
						onClick={() => setShowPassword((v) => !v)}
					>
						<ButtonIcon icon={showPassword ? EyeOff : Eye} />
					</Button>
				</div>
				<ErrorMessages errors={formState?.errors.password?._errors} />
			</Field>
			<Field>
				<Label htmlFor="password-confirm">{m.password_confirm()}</Label>
				<Input type={passwordInputType} id="password-confirm" name="passwordConfirm" />
				<ErrorMessages errors={formState?.errors.passwordConfirm?._errors} />
			</Field>
			<ButtonSubmit>
				<ButtonIconLoading icon={UserPlus} />
				{m.sign_me_up()}
				<ButtonIconSpace />
			</ButtonSubmit>
		</form>
	);
}
