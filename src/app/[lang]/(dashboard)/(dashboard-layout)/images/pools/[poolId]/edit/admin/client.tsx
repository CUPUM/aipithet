'use client';

import imagePoolDelete from '@lib/actions/image-pool-delete';
import imagePoolEditorDelete from '@lib/actions/image-pool-editor-delete';
import imagePoolEditorInvite from '@lib/actions/image-pool-editor-invite';
import ButtonSubmit from '@lib/components/button-submit';
import { Button, ButtonIconLoading } from '@lib/components/primitives/button';
import { Input } from '@lib/components/primitives/input';
import * as m from '@translations/messages';
import { availableLanguageTags, sourceLanguageTag } from '@translations/runtime';
import { Send, Trash2, X } from 'lucide-react';
import { useFormState } from 'react-dom';
import type { Editors } from './page';

export function EditorForm(props: { editor: Editors[number]; poolId: string }) {
	return (
		<form
			action={imagePoolEditorDelete.bind(null, props.poolId, props.editor.id)}
			className="flex flex-row gap-2 rounded-md bg-border/50 p-4"
		>
			<span className="mr-auto flex items-center rounded-full bg-border px-4 py-1 font-mono text-sm tracking-wide text-foreground/80">
				{props.editor.email}
			</span>
			{props.editor.isCreator ? (
				<span className="flex h-10 items-center rounded-full border border-border px-4 text-sm text-muted-foreground">
					Creator
				</span>
			) : (
				<ButtonSubmit variant="destructive" className="aspect-square" size="sm">
					<ButtonIconLoading icon={X} />
				</ButtonSubmit>
			)}
		</form>
	);
}

export function ImagePoolEditorInviteForm(props: { poolId: string }) {
	const [_formState, formAction] = useFormState(imagePoolEditorInvite, undefined);
	return (
		<form
			action={formAction}
			className="flex flex-col gap-4 rounded-lg border border-dashed border-input p-2"
		>
			<div className="flex flex-row gap-2">
				<input type="hidden" readOnly name="poolId" value={props.poolId} />
				<Input
					type="email"
					name="email"
					required
					placeholder={m.email_placeholder()}
					className="rounded-sm border-none bg-transparent"
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
