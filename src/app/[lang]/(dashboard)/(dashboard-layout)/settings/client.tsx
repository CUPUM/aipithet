'use client';

import passwordUpdate from '@lib/actions/password-update';
import ButtonPasswordToggle from '@lib/components/button-password-toggle';
import ButtonSubmit from '@lib/components/button-submit';
import { ButtonIconLoading } from '@lib/components/primitives/button';
import { ErrorMessages } from '@lib/components/primitives/error-messages';
import Field from '@lib/components/primitives/field';
import { Input } from '@lib/components/primitives/input';
import { Label } from '@lib/components/primitives/label';
import useActionSuccess from '@lib/hooks/action-success';
import { usePasswordReveal } from '@lib/hooks/password-reveal';
import * as m from '@translations/messages';
import { ArrowRight } from 'lucide-react';
import { useState } from 'react';
import { useFormState } from 'react-dom';

export function PasswordUpdateForm() {
	const [formState, formAction] = useFormState(passwordUpdate, undefined);
	const currentPasswordVisibility = usePasswordReveal(false);
	const newPasswordVisibility = usePasswordReveal(false);
	const [hasCurrentPassword, setHasCurrentPassword] = useState(false);
	const formRef = useActionSuccess(formState?.success);

	return (
		<form
			ref={formRef}
			action={formAction}
			className="flex animate-fly-up flex-col gap-3 rounded-lg border border-border bg-background p-8"
		>
			<h1 className="mb-4 text-xl font-semibold">{m.password_change()}</h1>
			<Field>
				<Label htmlFor="current-password">{m.password_current()}</Label>
				<div className="flex flex-row gap-2">
					<Input
						type={currentPasswordVisibility.type}
						name="currentPassword"
						id="current-password"
						className="flex-1"
						onInput={(e) => setHasCurrentPassword(!!e.currentTarget.value.length)}
					/>
					<ButtonPasswordToggle
						variant="outline"
						reveal={currentPasswordVisibility.reveal}
						toggle={currentPasswordVisibility.toggle}
					/>
				</div>
				<ErrorMessages errors={formState?.errors?.currentPassword?._errors} />
			</Field>
			<Field>
				<Label htmlFor="new-password">{m.password_new()}</Label>
				<fieldset className="flex flex-row gap-2" disabled={!hasCurrentPassword}>
					<Input
						type={newPasswordVisibility.type}
						name="newPassword"
						id="new-password"
						className="flex-1"
					/>
					<ButtonPasswordToggle
						variant="outline"
						reveal={newPasswordVisibility.reveal}
						toggle={newPasswordVisibility.toggle}
					/>
				</fieldset>
				<ErrorMessages errors={formState?.errors?.newPassword?._errors} />
			</Field>
			<Field>
				<Label htmlFor="new-password-confirm">{m.password_new_confirm()}</Label>
				<Input
					type={newPasswordVisibility.type}
					name="newPasswordConfirm"
					id="new-password-confirm"
					disabled={!hasCurrentPassword}
				/>
				<ErrorMessages errors={formState?.errors?.newPasswordConfirm?._errors} />
			</Field>
			<ButtonSubmit className="self-end" type="submit" disabled={!hasCurrentPassword}>
				{m.save()}
				<ButtonIconLoading icon={ArrowRight} />
			</ButtonSubmit>
		</form>
	);
}

export function EmailUpdateForm() {
	const [_formState, formAction] = useFormState(passwordUpdate, undefined);

	return (
		<form
			action={formAction}
			className="flex animate-fly-up flex-col gap-3 rounded-lg border border-border bg-background p-8 fill-mode-both"
			style={{ animationDelay: '100ms' }}
		>
			<h1 className="mb-4 text-xl font-semibold">{m.email_change()}</h1>
			<em className="text-muted-foreground">{m.coming_soon()}</em>
		</form>
	);
}
