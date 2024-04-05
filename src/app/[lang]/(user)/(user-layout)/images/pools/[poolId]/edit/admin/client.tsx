'use client';

import imagePoolDelete from '@lib/actions/image-pool-delete';
import imagePoolEditorDelete from '@lib/actions/image-pool-editor-delete';
import ButtonSubmit from '@lib/components/button-submit';
import { Button, ButtonIconLoading } from '@lib/components/primitives/button';
import { Input } from '@lib/components/primitives/input';
import * as m from '@translations/messages';
import { availableLanguageTags, sourceLanguageTag } from '@translations/runtime';
import { Send, Trash2 } from 'lucide-react';
import { useFormState } from 'react-dom';

export function ImagePoolEditorInviteForm(props: { poolId: string }) {
	const [_formState, formAction] = useFormState(imagePoolEditorDelete, undefined);
	return (
		<form action={formAction} className="flex flex-col gap-4 rounded-sm bg-border/50 p-6">
			<div className="flex flex-row gap-2">
				<input type="hidden" readOnly name="poolId" defaultValue={props.poolId} />
				<Input
					type="email"
					name="email"
					required
					placeholder={m.email_placeholder()}
					className="border-dashed bg-transparent"
				/>
				<Button asChild variant="secondary" className="px-4 font-medium capitalize">
					<select name="preferredLang" defaultValue={sourceLanguageTag}>
						{availableLanguageTags.map((l) => (
							<option key={l} value={l} label={l} />
						))}
					</select>
				</Button>
				<ButtonSubmit>
					{m.invitation_send()}
					<ButtonIconLoading icon={Send} />
				</ButtonSubmit>
			</div>
		</form>
	);
}

export function ImagePoolDeleteForm(props: { poolId: string }) {
	return (
		<form action={imagePoolDelete.bind(null, props.poolId)}>
			<ButtonSubmit
				variant="destructive"
				onClick={(e) => {
					if (
						!confirm(
							'Do you really want to delete this image pool? All associated images will be deleted'
						)
					) {
						e.preventDefault();
						e.stopPropagation();
					}
				}}
			>
				{m.del()}
				<ButtonIconLoading icon={Trash2} />
			</ButtonSubmit>
		</form>
	);
}
