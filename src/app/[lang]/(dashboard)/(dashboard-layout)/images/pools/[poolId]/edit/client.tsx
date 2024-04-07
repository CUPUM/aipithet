'use client';

import imagePoolPresentationUpdate from '@lib/actions/image-pool-presentation-update';
import ButtonSubmit from '@lib/components/button-submit';
import LanguagesFieldsets from '@lib/components/languages-fieldset';
import { ButtonIconLoading } from '@lib/components/primitives/button';
import { ErrorMessages } from '@lib/components/primitives/error-messages';
import Field from '@lib/components/primitives/field';
import { Input } from '@lib/components/primitives/input';
import { Label } from '@lib/components/primitives/label';
import { Textarea } from '@lib/components/primitives/textarea';
import * as m from '@translations/messages';
import { Check } from 'lucide-react';
import { useFormState } from 'react-dom';
import type { EditorImagePool } from './page';

export function ImagePoolPresentationUpdateForm(props: EditorImagePool) {
	const [formState, formAction] = useFormState(imagePoolPresentationUpdate, undefined);
	return (
		<form
			action={formAction}
			className="flex animate-fly-up flex-col gap-6 rounded-lg border border-border bg-background p-8 fill-mode-both"
		>
			<h2 className="text-xl font-semibold">{m.presentation()}</h2>
			<LanguagesFieldsets>
				{(fieldsetLang) => (
					<>
						<input type="hidden" name={`${fieldsetLang}.id`} value={props.id} readOnly />
						<input type="hidden" name={`${fieldsetLang}.lang`} value={fieldsetLang} readOnly />
						<Field>
							<Label htmlFor={`title-${fieldsetLang}`}>
								{m.title(undefined, { languageTag: fieldsetLang })}
							</Label>
							<Input
								name={`${fieldsetLang}.title`}
								id={`title-${fieldsetLang}`}
								type="text"
								className="font-semibold"
								defaultValue={props.translations[fieldsetLang].title ?? ''}
							/>
							<ErrorMessages errors={formState?.errors?.[fieldsetLang]?.title?._errors} />
						</Field>
						<Field>
							<Label htmlFor={`description-${fieldsetLang}`}>
								{m.description(undefined, { languageTag: fieldsetLang })}
							</Label>
							<Textarea
								name={`${fieldsetLang}.description`}
								id={`description-${fieldsetLang}`}
								rows={5}
								defaultValue={props.translations[fieldsetLang].description ?? ''}
								className="leading-relaxed text-foreground/80"
							/>
							<ErrorMessages errors={formState?.errors?.[fieldsetLang]?.description?._errors} />
						</Field>
					</>
				)}
			</LanguagesFieldsets>
			<ButtonSubmit className="sticky bottom-0 self-end">
				<ButtonIconLoading icon={Check} />
				{m.save()}
			</ButtonSubmit>
		</form>
	);
}
