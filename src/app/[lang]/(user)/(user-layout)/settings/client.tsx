'use client';

import passwordUpdate from '@lib/actions/password-update';
import { ButtonSubmit } from '@lib/components/button-submit';
import { Button, ButtonIcon, ButtonIconLoading } from '@lib/components/primitives/button';
import { Input } from '@lib/components/primitives/input';
import { Label } from '@lib/components/primitives/label';
import LabeledField from '@lib/components/primitives/labeled-field';
import * as m from '@translations/messages';
import { ArrowRight, Eye, EyeOff } from 'lucide-react';
import { useMemo, useState } from 'react';
import { useFormState } from 'react-dom';

export function PasswordUpdateForm() {
	const [formState, formAction] = useFormState(passwordUpdate, undefined);
	const [showPassword, setShowPassword] = useState(false);
	const passwordInputType = useMemo(() => (showPassword ? 'text' : 'password'), [showPassword]);
	const [hasCurrentPassword, setHasCurrentPassword] = useState(false);

	return (
		<form
			action={formAction}
			className="flex animate-fly-up flex-col gap-3 rounded-lg border border-border bg-background p-8"
		>
			<h1 className="mb-4 text-xl font-semibold">{m.password_change()}</h1>
			<LabeledField>
				<Label htmlFor="current-password">{m.password_current()}</Label>
				<Input
					type="password"
					name="currentPassword"
					id="current-password"
					onInput={(e) => setHasCurrentPassword(!!e.currentTarget.value.length)}
				/>
				{/* <ErrorMessages errors={formState?.errors}/> */}
			</LabeledField>
			<LabeledField>
				<Label htmlFor="new-password">{m.password_new()}</Label>
				<fieldset className="flex flex-row gap-2" disabled={!hasCurrentPassword}>
					<Input type={passwordInputType} name="newPassword" id="new-password" className="flex-1" />
					<Button
						variant="outline"
						className="aspect-square"
						type="button"
						onClick={() => setShowPassword((v) => !v)}
					>
						<ButtonIcon icon={showPassword ? EyeOff : Eye} />
					</Button>
				</fieldset>
				{/* <ErrorMessages errors={formState?.errors.}/> */}
			</LabeledField>
			<LabeledField>
				<Label htmlFor="new-password-confirm">{m.password_new_confirm()}</Label>
				<Input
					type={passwordInputType}
					name="newPasswordConfirm"
					id="new-password-confirm"
					disabled={!hasCurrentPassword}
				/>
				{/* <ErrorMessages errors={formState?.errors.}/> */}
			</LabeledField>
			<ButtonSubmit className="self-end" type="submit" disabled={!hasCurrentPassword}>
				{m.save()}
				<ButtonIconLoading icon={ArrowRight} />
			</ButtonSubmit>
		</form>
	);
}

export function EmailUpdateForm() {
	const [formState, formAction] = useFormState(passwordUpdate, undefined);

	return (
		<form
			action={formAction}
			className="flex animate-fly-up flex-col gap-3 rounded-lg border border-border bg-background p-8 fill-mode-both"
			style={{ animationDelay: '250ms' }}
		>
			<h1 className="mb-4 text-xl font-semibold">{m.email_change()}</h1>
			<em className="text-muted-foreground">À venir</em>
		</form>
	);
}
