'use client';

import surveyInvitationParticipantCreate from '@lib/actions/survey-invitation-participant-create';
import ButtonSubmit from '@lib/components/button-submit';
import { Button, ButtonIconLoading } from '@lib/components/primitives/button';
import { Input } from '@lib/components/primitives/input';
import * as m from '@translations/messages';
import { availableLanguageTags, sourceLanguageTag } from '@translations/runtime';
import { RefreshCw, Send, X } from 'lucide-react';
import { useFormState } from 'react-dom';
import type { SurveyInvitations } from './page';

export function PendingInvitationForm(props: SurveyInvitations[number]) {
	return (
		<li className="flex flex-row items-center gap-4 rounded-sm bg-border/50 p-4">
			<span className="w-half rounded-[0.5rem] bg-border px-4 py-2.5 font-mono text-sm tracking-wide opacity-80">
				{props.email}
			</span>
			<hr className="ml-auto block h-[unset] self-stretch border-l border-t border-border" />
			<form className="flex flex-row items-center gap-2">
				<span className="text-sm text-muted-foreground">{m.time_left()}</span>
				<ButtonSubmit className="aspect-square" size="sm" variant="secondary">
					<ButtonIconLoading icon={RefreshCw} />
				</ButtonSubmit>
			</form>
			<hr className="block h-[unset] self-stretch border-l border-t border-border" />
			<form className="flex flex-row gap-2">
				<ButtonSubmit className="aspect-square" size="sm" variant="destructive">
					<ButtonIconLoading icon={X} />
				</ButtonSubmit>
			</form>
		</li>
	);
}

export function CreateParticipantInvitationForm(props: { surveyId: string }) {
	const [_formState, formAction] = useFormState(surveyInvitationParticipantCreate, undefined);
	return (
		<form className="flex flex-row items-end gap-2 rounded-sm bg-border/25 p-6" action={formAction}>
			<input type="hidden" name="surveyId" defaultValue={props.surveyId} readOnly />
			<Input
				type="email"
				name="email"
				required
				placeholder={m.email_placeholder()}
				className="border-dashed bg-transparent"
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
	const [_formState, formAction] = useFormState(surveyInvitationParticipantCreate, undefined);
	return (
		<form className="flex flex-row items-end gap-2 rounded-sm bg-border/25 p-6" action={formAction}>
			<input type="hidden" name="surveyId" defaultValue={props.surveyId} readOnly />
			<Input
				type="email"
				name="email"
				required
				placeholder={m.email_placeholder()}
				className="border-dashed bg-transparent"
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
