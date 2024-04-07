'use client';

import surveyInvite from '@lib/actions/survey-invite';
import ButtonSubmit from '@lib/components/button-submit';
import { Button, ButtonIconLoading } from '@lib/components/primitives/button';
import { Input } from '@lib/components/primitives/input';
import * as m from '@translations/messages';
import { availableLanguageTags, sourceLanguageTag } from '@translations/runtime';
import { RefreshCcw, Send, X } from 'lucide-react';
import { useFormState } from 'react-dom';

export function SurveyUser(props: {
	id: string;
	email: string;
	pending: boolean;
	createdAt: Date | null;
}) {
	return (
		<li className="flex flex-row items-center rounded-md bg-border/50 p-3">
			<span className="rounded-full bg-border px-4 py-2 text-sm text-foreground/80">
				{props.email}
			</span>
			<form className="flex flex-1 flex-row items-center justify-end gap-2">
				{props.pending ? (
					<ButtonSubmit variant="secondary" size="sm" className="aspect-square">
						<ButtonIconLoading icon={RefreshCcw} />
					</ButtonSubmit>
				) : null}
				<ButtonSubmit variant="destructive" size="sm" className="aspect-square">
					<ButtonIconLoading icon={X} />
				</ButtonSubmit>
			</form>
		</li>
	);
}

export function CreateParticipantInvitationForm(props: { surveyId: string }) {
	const [_formState, formAction] = useFormState(surveyInvite, undefined);
	return (
		<form
			className="flex flex-row items-end gap-2 rounded-lg border border-dashed border-input p-2"
			action={formAction}
		>
			<input type="hidden" name="surveyId" value={props.surveyId} readOnly />
			<Input
				type="email"
				name="email"
				required
				placeholder={m.email_placeholder()}
				className="rounded-sm border-none bg-transparent"
			/>
			<Button asChild className="cursor-pointer px-4 font-medium capitalize" variant="secondary">
				<select name="preferredLang" defaultValue={sourceLanguageTag}>
					{availableLanguageTags.map((l) => (
						<option key={l} value={l}>
							{l}
						</option>
					))}
				</select>
			</Button>
			<ButtonSubmit>
				{m.invitation_send()}
				<ButtonIconLoading icon={Send} />
			</ButtonSubmit>
		</form>
	);
}

export function CreateEditorInvitationForm(props: { surveyId: string }) {
	const [_formState, formAction] = useFormState(surveyInvite, undefined);
	return (
		<form
			className="flex flex-row items-end gap-2 rounded-lg border border-dashed border-input p-2"
			action={formAction}
		>
			<input type="hidden" name="surveyId" value={props.surveyId} readOnly />
			<input type="hidden" name="&editor" value="true" readOnly />
			<Input
				type="email"
				name="email"
				required
				placeholder={m.email_placeholder()}
				className="rounded-sm border-none bg-transparent"
			/>
			<Button asChild className="cursor-pointer px-4 font-medium capitalize" variant="secondary">
				<select name="preferredLang" defaultValue={sourceLanguageTag}>
					{availableLanguageTags.map((l) => (
						<option key={l} value={l}>
							{l}
						</option>
					))}
				</select>
			</Button>
			<ButtonSubmit>
				{m.invitation_send()}
				<ButtonIconLoading icon={Send} />
			</ButtonSubmit>
		</form>
	);
}
