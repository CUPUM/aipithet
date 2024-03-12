'use client';

import {
	Button,
	ButtonIcon,
	ButtonIconSpace,
	LoadingButtonIcon,
} from '@lib/components/primitives/button';
import { ErrorMessages } from '@lib/components/primitives/error-messages';
import { Input } from '@lib/components/primitives/input';
import { Label } from '@lib/components/primitives/label';
import LabeledField from '@lib/components/primitives/labeled-field';
import { SubmitButton } from '@lib/components/submit-button';
import { EMPTY_FORMATTED_ERRORS } from '@lib/database/constants';
import * as m from '@translations/messages';
import { Eye, EyeOff, UserPlus } from 'lucide-react';
import { useState } from 'react';
import { useFormState } from 'react-dom';
import { signup } from './server';

export function SignupForm() {
	const [formState, formAction] = useFormState(signup, EMPTY_FORMATTED_ERRORS);
	const [showPassword, setShowPassword] = useState(false);
	return (
		<form action={formAction} className="flex flex-col gap-4">
			<h1 className="text-3xl font-medium mb-4">{m.signup()}</h1>
			<LabeledField>
				<Label htmlFor="email">{m.email()}</Label>
				<Input id="email" type="email" placeholder={m.email_placeholder()} name="email" />
				<ErrorMessages errors={formState.errors.email?._errors} />
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
						className="aspect-square"
						type="button"
						onClick={() => setShowPassword(!showPassword)}
					>
						<ButtonIcon icon={showPassword ? EyeOff : Eye} />
					</Button>
				</div>
				<ErrorMessages errors={formState.errors.password?._errors} />
			</LabeledField>
			<LabeledField>
				<Label htmlFor="passwordConfirm">{m.confirm_password()}</Label>
				<Input
					type={showPassword ? 'text' : 'password'}
					id="passwordConfirm"
					name="passwordConfirm"
				/>
				<ErrorMessages errors={formState.errors.passwordConfirm?._errors} />
			</LabeledField>
			<SubmitButton>
				<LoadingButtonIcon icon={UserPlus} />
				{m.sign_me_up()}
				<ButtonIconSpace />
			</SubmitButton>
		</form>
	);
}
