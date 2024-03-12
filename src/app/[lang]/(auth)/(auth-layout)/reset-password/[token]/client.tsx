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
import * as m from '@translations/messages';
import { ArrowLeft, Check } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import { useFormState } from 'react-dom';

export function BackButton() {
	const router = useRouter();
	return (
		<Button onClick={() => router.back()} variant="link" size="sm">
			<ButtonIcon icon={ArrowLeft} />
			{m.go_back()}
			<ButtonIconSpace />
		</Button>
	);
}

export function FinalizePasswordResetForm(props: {
	formAction: (state: unknown, formData: FormData) => Promise<unknown>;
}) {
	const [formState, formAction] = useFormState(props.formAction, undefined);
	const param = useParams();
	return (
		<form action={formAction} className="flex flex-col gap-4">
			<h1 className="text-3xl font-medium mb-4">{m.reset_password()}</h1>
			<LabeledField>
				<Label htmlFor="newPassword">{m.password_new()}</Label>
				<Input type="password" name="newPassword" id="newPassword" />
				<ErrorMessages errors={formState} />
			</LabeledField>
			<LabeledField>
				<Label htmlFor="newPasswordConfirm">{m.confirm_password()}</Label>
				<Input type="password" name="newPasswordConfirm" id="newPasswordConfirm" />
				<ErrorMessages errors={formState} />
			</LabeledField>
			<SubmitButton>
				<LoadingButtonIcon icon={Check} />
				{m.update_my_password()}
				<ButtonIconSpace />
			</SubmitButton>
		</form>
	);
}
