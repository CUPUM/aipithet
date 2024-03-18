'use client';

import surveyPresentationUpdate from '@lib/actions/survey-presentation-update';
import ButtonSubmit from '@lib/components/button-submit';
import { ButtonIconLoading } from '@lib/components/primitives/button';
import Field from '@lib/components/primitives/field';
import { Input } from '@lib/components/primitives/input';
import { Label } from '@lib/components/primitives/label';
import { Textarea } from '@lib/components/primitives/textarea';
import { LANG_NAMES } from '@lib/i18n/constants';
import * as m from '@translations/messages';
import { availableLanguageTags } from '@translations/runtime';
import { Check } from 'lucide-react';
import { useFormState } from 'react-dom';

export function SurveyPresentationForm(props: { surveyId: string }) {
	const [formState, formAction] = useFormState(surveyPresentationUpdate, props.surveyId);
	return (
		<form action={formAction} className="flex flex-col gap-8 rounded-lg border border-border p-8 ">
			<h1 className="text-xl font-semibold">{m.presentation()}</h1>
			<div className="flex flex-col gap-8 lg:flex-row">
				{availableLanguageTags.map((lang, i) => (
					<>
						<fieldset key={lang} className="flex flex-1 flex-col gap-4">
							<legend className="float-left mb-2 self-start rounded-full bg-foreground px-2 py-1 font-semibold text-muted">
								{LANG_NAMES[lang]}
							</legend>
							<Field>
								<Label htmlFor={`title-${lang}`}>{m.title(undefined, { languageTag: lang })}</Label>
								<Input name="title" id={`title-${lang}`} type="text" />
							</Field>
							<Field>
								<Label htmlFor={`summary-${lang}`}>
									{m.summary(undefined, { languageTag: lang })}
								</Label>
								<Textarea name="summary" id={`summary-${lang}`} />
							</Field>
							<Field>
								<Label htmlFor={`description-${lang}`}>
									{m.description(undefined, { languageTag: lang })}
								</Label>
								<Textarea name="description" id={`description-${lang}`} />
							</Field>
						</fieldset>
						{i < availableLanguageTags.length - 1 && (
							<hr className="block h-auto w-auto self-stretch border-l border-t border-border" />
						)}
					</>
				))}
			</div>
			<ButtonSubmit className="self-end">
				{m.save()}
				<ButtonIconLoading icon={Check} />
			</ButtonSubmit>
		</form>
	);
}

export function SurveyConfigurationForm() {
	return <form action="">Configuration</form>;
}

export function SurveySharingForm() {
	return <form action="">Sharing</form>;
}

export function SurveySecurityForm() {
	return <form action="">Security</form>;
}
