'use client';

import surveyConfigurationUpdate from '@lib/actions/survey-configuration-update';
import surveyShare from '@lib/actions/survey-invite';
import surveyPresentationUpdate from '@lib/actions/survey-presentation-update';
import ButtonSubmit from '@lib/components/button-submit';
import { Button, ButtonIcon, ButtonIconLoading } from '@lib/components/primitives/button';
import { ErrorMessages } from '@lib/components/primitives/error-messages';
import Field from '@lib/components/primitives/field';
import { Input } from '@lib/components/primitives/input';
import { Label } from '@lib/components/primitives/label';
import { Textarea } from '@lib/components/primitives/textarea';
import { LABELING_SURVEY_LIKERT_STEP_COUNT_MAX } from '@lib/database/constants';
import { LANG_NAMES } from '@lib/i18n/constants';
import * as m from '@translations/messages';
import { availableLanguageTags } from '@translations/runtime';
import { Check, Minus, Plus } from 'lucide-react';
import { Fragment, useState } from 'react';
import { useFormState } from 'react-dom';
import type { EditorLabelingSurvey } from './page';

export function SurveyPresentationForm(props: EditorLabelingSurvey) {
	const [formState, formAction] = useFormState(surveyPresentationUpdate, undefined);
	return (
		<form
			action={formAction}
			className="flex animate-fly-up flex-col gap-8 rounded-lg border border-border bg-background p-8 fill-mode-both"
		>
			<h1 className="text-xl font-semibold">{m.presentation()}</h1>
			<div className="flex flex-col gap-8 lg:flex-row">
				{availableLanguageTags.map((lang, i) => (
					<Fragment key={lang}>
						<fieldset className="flex flex-1 flex-col gap-6">
							<legend className="sticky top-0 float-left self-start rounded-full bg-accent px-3 py-2 text-xs font-semibold uppercase tracking-wide shadow-[0_.5em_1em_0.25em] shadow-background">
								{LANG_NAMES[lang]}
							</legend>
							<input type="hidden" name={`${lang}.id`} value={props.id} readOnly />
							<input type="hidden" name={`${lang}.lang`} value={lang} readOnly />
							<Field>
								<Label htmlFor={`title-${lang}`}>{m.title(undefined, { languageTag: lang })}</Label>
								<Input
									name={`${lang}.title`}
									id={`title-${lang}`}
									type="text"
									className="font-semibold"
									defaultValue={props.translations[lang].title ?? ''}
								/>
								<ErrorMessages errors={formState?.errors?.[lang]?.title?._errors} />
							</Field>
							<Field>
								<Label htmlFor={`summary-${lang}`}>
									{m.summary(undefined, { languageTag: lang })}
								</Label>
								<Textarea
									name={`${lang}.summary`}
									id={`summary-${lang}`}
									rows={15}
									defaultValue={props.translations[lang].summary ?? ''}
									className="leading-relaxed text-foreground/80"
								/>
								<ErrorMessages errors={formState?.errors?.[lang]?.summary?._errors} />
							</Field>
							<Field>
								<Label htmlFor={`description-${lang}`}>
									{m.description(undefined, { languageTag: lang })}
								</Label>
								<Textarea
									name={`${lang}.description`}
									id={`description-${lang}`}
									rows={20}
									defaultValue={props.translations[lang].description ?? ''}
									className="leading-relaxed text-foreground/80"
								/>
								<ErrorMessages errors={formState?.errors?.[lang]?.description?._errors} />
							</Field>
						</fieldset>
						{i < availableLanguageTags.length - 1 && (
							<hr className="block h-auto w-auto self-stretch border-l border-t border-border" />
						)}
					</Fragment>
				))}
			</div>
			<ButtonSubmit className="sticky bottom-0 self-end shadow-[0_1em_1em_0.5em] shadow-background">
				{m.save()}
				<ButtonIconLoading icon={Check} />
			</ButtonSubmit>
		</form>
	);
}

export function SurveyConfigurationForm(props: EditorLabelingSurvey) {
	const [formState, formAction] = useFormState(surveyConfigurationUpdate, undefined);
	const [stepCount, setStepCount] = useState(props.likertStepCount);
	return (
		<form
			action={formAction}
			className="flex animate-fly-up flex-col gap-8 rounded-lg border border-border bg-background p-8 delay-300 fill-mode-both"
		>
			<h1 className="text-xl font-semibold">{m.settings()}</h1>
			<input type="hidden" name="id" value={props.id} readOnly />
			<Field className="md:flex-row md:gap-8">
				<div className="flex flex-1 flex-col gap-4">
					<Label>{m.survey_likert_step_count()}</Label>
					<p className="text-sm text-muted-foreground">
						{m.survey_likert_step_count_description()}
					</p>
				</div>
				<div className="flex flex-1 flex-col gap-4">
					<div className="p-4">
						{/* <Slider
							min={0}
							max={LABELING_SURVEY_LIKERT_STEP_COUNT_MAX}
							step={1}
							value={[stepCount]}
							onValueChange={([v]) => {
								if (v !== undefined) {
									setStepCount(v);
								}
							}}
						/> */}
					</div>
					<div className="flex flex-row gap-2">
						<Button
							type="button"
							variant="ghost"
							className="aspect-square"
							onClick={() => setStepCount((v) => Math.max(0, --v))}
						>
							<ButtonIcon icon={Minus} />
						</Button>
						{/* <Input
							name="+likertStepCount"
							min={0}
							max={LABELING_SURVEY_LIKERT_STEP_COUNT_MAX}
							step={1}
							type="number"
							className="text-center font-mono"
							onInput={(e) =>
								setStepCount(
									Math.min(
										Math.max(0, parseInt(e.currentTarget.value)),
										LABELING_SURVEY_LIKERT_STEP_COUNT_MAX
									)
								)
							}
						/> */}
						<Button
							type="button"
							variant="ghost"
							className="aspect-square"
							onClick={() =>
								setStepCount((v) => Math.min(LABELING_SURVEY_LIKERT_STEP_COUNT_MAX, ++v))
							}
						>
							<ButtonIcon icon={Plus} />
						</Button>
					</div>
				</div>
				<ErrorMessages errors={formState?.errors?.likertStepCount?._errors} />
			</Field>
			<ButtonSubmit className=" bottom-0 self-end shadow-[0_1em_1em_0.5em] shadow-background">
				{m.save()}
				<ButtonIconLoading icon={Check} />
			</ButtonSubmit>
		</form>
	);
}

export function SurveySharingForm(props: EditorLabelingSurvey) {
	const [formState, formAction] = useFormState(surveyShare, undefined);
	return (
		<form
			action={formAction}
			className="flex animate-fly-up flex-col gap-8 rounded-lg border border-border bg-background p-8 delay-300 fill-mode-both"
		>
			<h1 className="text-xl font-semibold">{m.sharing()}</h1>
			<input type="hidden" name="id" value={props.id} readOnly />
		</form>
	);
}

export function SurveySecurityForm(props: EditorLabelingSurvey) {
	return (
		<form action="" className="rounded-lg bg-background p-8">
			<section>
				<ButtonSubmit variant="destructive">{m.survey_delete()}</ButtonSubmit>
			</section>
		</form>
	);
}
