'use client';

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
import { ScatteredNodes } from '@lib/components/scattered-nodes';
import { SubmitButton } from '@lib/components/submit-button';
import * as m from '@translations/messages';
import { MailSearch, RefreshCw } from 'lucide-react';
import { useEffect, useRef } from 'react';
import { useFormState } from 'react-dom';
import passwordReset from '../../../../../lib/actions/password-reset';

export function ResetPasswordForm() {
	const [formState, formAction] = useFormState(passwordReset, undefined);
	const formRef = useRef<HTMLFormElement>(null);
	useEffect(() => {
		if (formState?.reset) {
			formRef.current?.reset();
		}
	}, [formState]);
	if (formState?.finalize) {
		return (
			<>
				<div className="absolute inset-0 -z-10 opacity-20">
					<ScatteredNodes
						pool={['✉️', '📨', '🔑']}
						className="animate-in zoom-in-75 duration-500 ease-out fill-mode-both fade-in-0 transition-all"
					/>
				</div>
				<article className="flex flex-col gap-4 animate-fly-up">
					<h1 className="text-3xl font-medium mb-4">{m.password_reset_success()}</h1>
					<p className="text-muted-foreground">{m.password_reset_see_mailbox()}</p>
					<Button asChild variant="outline">
						<a href="mailto:">
							<ButtonIcon icon={MailSearch} />
							{m.password_reset_see_mailbox_button()}
							<ButtonIconSpace />
						</a>
					</Button>
				</article>
			</>
		);
	}
	return (
		<form action={formAction} className="flex flex-col gap-4" ref={formRef}>
			<h1 className="text-3xl font-medium mb-4">{m.reset_password()}</h1>
			<LabeledField>
				<Label htmlFor="email">{m.email()}</Label>
				<Input type="email" name="email" id="email" />
				<ErrorMessages errors={formState?.errors?.email?._errors} />
			</LabeledField>
			<ErrorMessages errors={formState?.errors?._errors} />
			<SubmitButton>
				<ButtonIconLoading icon={RefreshCw} />
				{m.reset()}
				<ButtonIconSpace />
			</SubmitButton>
		</form>
	);
}
