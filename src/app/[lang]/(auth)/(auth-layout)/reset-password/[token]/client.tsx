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
import { Check, Eye, EyeOff } from 'lucide-react';
import { useState } from 'react';
import { useFormState } from 'react-dom';
import type { finalizePasswordReset } from './page';

export function PasswordResetFinalizeForm(props: {
	formAction: ReturnType<typeof finalizePasswordReset>;
}) {
	const [formState, formAction] = useFormState(props.formAction, undefined);
	console.log(formState);
	const [showPassword, setShowPassword] = useState(false);
	return (
		<form action={formAction} className="flex flex-col gap-4">
			<h1 className="text-3xl font-medium mb-4">{m.reset_password()}</h1>
			<LabeledField>
				<Label htmlFor="newPassword">{m.password_new()}</Label>
				<div className="flex flex-row gap-2 self-stretch">
					<Input
						className="flex-1"
						type={showPassword ? 'text' : 'password'}
						name="newPassword"
						id="newPassword"
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
				<ErrorMessages errors={formState?.errors.newPassword?._errors} />
			</LabeledField>
			<LabeledField>
				<Label htmlFor="newPasswordConfirm">{m.confirm_password()}</Label>
				<Input
					type={showPassword ? 'text' : 'password'}
					name="newPasswordConfirm"
					id="newPasswordConfirm"
				/>
				<ErrorMessages errors={formState?.errors.newPasswordConfirm?._errors} />
			</LabeledField>
			<ButtonSubmit>
				<ButtonIconLoading icon={Check} />
				{m.update_my_password()}
				<ButtonIconSpace />
			</ButtonSubmit>
		</form>
	);
}
