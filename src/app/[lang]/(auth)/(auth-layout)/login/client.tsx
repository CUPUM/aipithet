'use client';

import { ButtonSubmit } from '@lib/components/button-submit';
import {
	Button,
	ButtonIcon,
	ButtonIconLoading,
	ButtonIconSpace,
} from '@lib/components/primitives/button';
import { ErrorMessages } from '@lib/components/primitives/error-messages';
import { Input } from '@lib/components/primitives/input';
import { Label } from '@lib/components/primitives/label';
import LabeledField from '@lib/components/primitives/labeled-field';
import * as m from '@translations/messages';
import { Eye, EyeOff, LogIn } from 'lucide-react';
import { useMemo, useState } from 'react';
import { useFormState } from 'react-dom';
import login from '../../../../../lib/actions/login';

export function LoginForm() {
	const [formState, formAction] = useFormState(login, undefined);
	const [showPassword, setShowPassword] = useState(false);
	const toggledInputType = useMemo(() => (showPassword ? 'text' : 'password'), [showPassword]);
	return (
		<form action={formAction} className="flex flex-col gap-4">
			<h1 className="text-3xl font-medium mb-4">{m.login()}</h1>
			<LabeledField>
				<Label htmlFor="email">{m.email()}</Label>
				<Input type="email" id="email" name="email" />
				<ErrorMessages errors={formState?.errors?.email?._errors} />
			</LabeledField>
			<LabeledField>
				<Label htmlFor="password">{m.password()}</Label>
				<div className="flex flex-row gap-2 self-stretch">
					<Input className="flex-1" type={toggledInputType} id="password" name="password" />
					<Button
						variant="outline"
						className="aspect-square"
						type="button"
						onClick={() => setShowPassword((v) => !v)}
					>
						<ButtonIcon icon={showPassword ? EyeOff : Eye} />
					</Button>
				</div>
				<ErrorMessages errors={formState?.errors?.password?._errors} />
			</LabeledField>
			<ErrorMessages errors={formState?.errors._errors} />
			<ButtonSubmit>
				<ButtonIconLoading icon={LogIn} />
				{m.login()}
				<ButtonIconSpace />
			</ButtonSubmit>
		</form>
	);
}
