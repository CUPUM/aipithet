'use client';

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
import passwordResetFinalize from '@lib/crud/actions/password-reset-finalize';
import * as m from '@translations/messages';
import { Check, Eye, EyeOff } from 'lucide-react';
import { useMemo, useState } from 'react';
import { useFormState } from 'react-dom';

export function PasswordResetFinalizeForm(props: { token: string }) {
	const [formState, formAction] = useFormState(passwordResetFinalize, undefined);
	const [showPassword, setShowPassword] = useState(false);
	const passwordInputType = useMemo(() => (showPassword ? 'text' : 'password'), [showPassword]);
	return (
		<form action={formAction} className="flex flex-col gap-4">
			<h1 className="mb-4 text-3xl font-medium">{m.reset_password()}</h1>
			<input type="hidden" name="token" readOnly defaultValue={props.token} />
			<Field>
				<Label htmlFor="new-password">{m.password_new()}</Label>
				<div className="flex flex-row gap-2 self-stretch">
					<Input className="flex-1" type={passwordInputType} name="newPassword" id="new-password" />
					<Button
						variant="outline"
						className="aspect-square"
						type="button"
						onClick={() => setShowPassword((v) => !v)}
					>
						<ButtonIcon icon={showPassword ? EyeOff : Eye} />
					</Button>
				</div>
				<ErrorMessages errors={formState?.errors.newPassword?._errors} />
			</Field>
			<Field>
				<Label htmlFor="new-password-confirm">{m.password_confirm()}</Label>
				<Input type={passwordInputType} name="newPasswordConfirm" id="new-password-confirm" />
				<ErrorMessages errors={formState?.errors.newPasswordConfirm?._errors} />
			</Field>
			<ButtonSubmit>
				<ButtonIconLoading icon={Check} />
				{m.update_my_password()}
				<ButtonIconSpace />
			</ButtonSubmit>
		</form>
	);
}
