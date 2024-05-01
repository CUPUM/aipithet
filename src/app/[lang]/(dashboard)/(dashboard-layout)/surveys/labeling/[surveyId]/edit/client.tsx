'use client';

import surveyBreakUpdate from '@lib/actions/survey-break-update';
import surveyConfigurationUpdate from '@lib/actions/survey-configuration-update';
import surveyLabelCreate from '@lib/actions/survey-label-create';
import surveyLabelDelete from '@lib/actions/survey-label-delete';
import surveyLabelsUpdate from '@lib/actions/survey-labels-update';
import surveyPresentationUpdate from '@lib/actions/survey-presentation-update';
import ButtonSubmit from '@lib/components/button-submit';
import LanguagesFieldsets from '@lib/components/languages-fieldset';
import { Button, ButtonIcon, ButtonIconLoading } from '@lib/components/primitives/button';
import { ErrorMessages } from '@lib/components/primitives/error-messages';
import Field from '@lib/components/primitives/field';
import { Input } from '@lib/components/primitives/input';
import { Label } from '@lib/components/primitives/label';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@lib/components/primitives/select';
import { Slider } from '@lib/components/primitives/slider';
import { Switch } from '@lib/components/primitives/switch';
import { Textarea } from '@lib/components/primitives/textarea';
import { LABELING_SURVEY_SLIDER_STEP_COUNT_MAX } from '@lib/database/constants';
import * as m from '@translations/messages';
import { availableLanguageTags, languageTag } from '@translations/runtime';
import { Check, Minus, Plus, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { useFormState } from 'react-dom';
import type {
	EditorLabelingSurvey,
	EditorLabelingSurveyLabels,
	SelectableImagesPools,
} from './page';

export function SurveyPresentationForm(props: EditorLabelingSurvey) {
	const [formState, formAction] = useFormState(surveyPresentationUpdate, undefined);
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
							<Label htmlFor={`summary-${fieldsetLang}`}>
								{m.summary(undefined, { languageTag: fieldsetLang })}
							</Label>
							<Textarea
								name={`${fieldsetLang}.summary`}
								id={`summary-${fieldsetLang}`}
								rows={5}
								defaultValue={props.translations[fieldsetLang].summary ?? ''}
								className="leading-relaxed text-foreground/80"
							/>
							<ErrorMessages errors={formState?.errors?.[fieldsetLang]?.summary?._errors} />
						</Field>
						<Field>
							<Label htmlFor={`description-${fieldsetLang}`}>
								{m.description(undefined, { languageTag: fieldsetLang })}
							</Label>
							<Textarea
								name={`${fieldsetLang}.description`}
								id={`description-${fieldsetLang}`}
								rows={20}
								defaultValue={props.translations[fieldsetLang].description ?? ''}
								className="leading-relaxed text-foreground/80"
							/>
							<ErrorMessages errors={formState?.errors?.[fieldsetLang]?.description?._errors} />
						</Field>
						<Field>
							<Label htmlFor={`help-${fieldsetLang}`}>
								{m.help(undefined, { languageTag: fieldsetLang })}
							</Label>
							<Textarea
								name={`${fieldsetLang}.help`}
								id={`help-${fieldsetLang}`}
								rows={5}
								defaultValue={props.translations[fieldsetLang].help ?? ''}
								className="leading-relaxed text-foreground/80"
							/>
							<ErrorMessages errors={formState?.errors?.[fieldsetLang]?.help?._errors} />
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

export function SurveyConfigurationForm(
	props: EditorLabelingSurvey & { selectableImagesPools: SelectableImagesPools }
) {
	const [formState, formAction] = useFormState(surveyConfigurationUpdate, undefined);
	const [stepCount, setStepCount] = useState(props.sliderStepCount);
	return (
		<form
			action={formAction}
			className="flex animate-fly-up flex-col gap-12 rounded-lg border border-border bg-background delay-300 fill-mode-both"
		>
			<h2 className="p-8 pb-0 text-xl font-semibold">{m.settings()}</h2>
			<input type="hidden" name="id" value={props.id} readOnly />
			<Field className="gap-4 px-8 md:flex-row">
				<div className="flex flex-1 flex-col gap-4">
					<Label>{m.survey_slider_step_count()}</Label>
					<p className="text-sm leading-relaxed text-muted-foreground">
						{m.survey_slider_step_count_description()}
					</p>
				</div>
				<div className="flex flex-1 flex-col gap-2 md:pt-4">
					<div className="p-4">
						<Slider
							min={0}
							max={LABELING_SURVEY_SLIDER_STEP_COUNT_MAX}
							step={1}
							value={[stepCount]}
							onValueChange={([v]) => {
								if (v !== undefined) {
									setStepCount(v);
								}
							}}
						/>
					</div>
					<div className="flex flex-row justify-center gap-2">
						<Button
							type="button"
							variant="ghost"
							className="aspect-square"
							onClick={() => setStepCount((v) => Math.max(0, --v))}
						>
							<ButtonIcon icon={Minus} />
						</Button>
						<Input
							name="+sliderStepCount"
							min={0}
							max={LABELING_SURVEY_SLIDER_STEP_COUNT_MAX}
							step={1}
							type="number"
							className="basis-20 text-center hide-arrows"
							value={stepCount}
							onInput={(e) =>
								setStepCount(
									Math.min(
										Math.max(0, parseInt(e.currentTarget.value)),
										LABELING_SURVEY_SLIDER_STEP_COUNT_MAX
									)
								)
							}
						/>
						<Button
							type="button"
							variant="ghost"
							className="aspect-square"
							onClick={() =>
								setStepCount((v) => Math.min(LABELING_SURVEY_SLIDER_STEP_COUNT_MAX, ++v))
							}
						>
							<ButtonIcon icon={Plus} />
						</Button>
					</div>
				</div>
				<ErrorMessages errors={formState?.errors?.sliderStepCount?._errors} />
			</Field>
			<hr />
			<Field className="gap-4 px-8 md:flex-row">
				<div className="flex flex-1 flex-col gap-4">
					<Label>{m.image_pool()}</Label>
					<p className="text-sm leading-relaxed text-muted-foreground">
						{m.survey_image_pool_select_long()}
					</p>
				</div>
				<div className="flex flex-1 flex-col md:pt-6">
					<Select name="imagePoolId" defaultValue={props.imagePoolId || undefined}>
						<SelectTrigger className="w-auto min-w-60 self-center">
							<SelectValue placeholder="Select an image pool" />
						</SelectTrigger>
						<SelectContent>
							{props.selectableImagesPools.map((pool) => (
								<SelectItem key={pool.id} value={pool.id} textValue={pool.title || m.untitled()}>
									{pool.title || (
										<span className="italic text-muted-foreground">{m.untitled()}</span>
									)}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
				</div>
			</Field>
			<div className="sticky bottom-0 my-8 flex flex-row justify-end px-8">
				<ButtonSubmit className=" bottom-0">
					<ButtonIconLoading icon={Check} />
					{m.save()}
				</ButtonSubmit>
			</div>
		</form>
	);
}

export function SurveyBreakForm(props: EditorLabelingSurvey) {
	const [formState, formAction] = useFormState(surveyBreakUpdate, undefined);
	return (
		<form
			action={formAction}
			className="flex animate-fly-up flex-col gap-12 rounded-lg border border-border bg-background delay-300 fill-mode-both"
		>
			<div className="flex flex-row items-center justify-between p-8 pb-0">
				<h2 className="text-xl font-semibold">Break</h2>
				<Switch name="&allowBreaks" defaultChecked={props.allowBreaks} />
			</div>
			<input type="hidden" name="id" value={props.id} readOnly />
			<Field className="gap-4 px-8 md:flex-row">
				<div className="flex flex-1 flex-col gap-4">
					<Label>Frequency</Label>
					<p className="my-4 text-sm leading-relaxed text-muted-foreground">
						How often should there be a break ?
					</p>
				</div>
				<div className="flex flex-1 flex-col md:pt-6">
					<Input
						type="number"
						name="+breakFrequency"
						className="w-auto min-w-60 self-center"
						defaultValue={props.breakFrequency}
						min={0}
					/>
				</div>
			</Field>
			<hr />
			<Field className="gap-4 px-8 md:flex-row">
				<div className="flex flex-1 flex-col gap-4">
					<Label>Duration</Label>
					<p className="my-4 text-sm leading-relaxed text-muted-foreground">
						How long should the break last ? (in minutes)
					</p>
				</div>
				<div className="flex flex-1 flex-col md:pt-6">
					<Input
						type="number"
						name="+breakDuration"
						className="w-auto min-w-60 self-center"
						defaultValue={props.breakDuration}
						min={0}
					/>
				</div>
			</Field>
			<div className="sticky bottom-0 my-8 flex flex-row justify-end px-8">
				<ButtonSubmit className=" bottom-0">
					<ButtonIconLoading icon={Check} />
					{m.save()}
				</ButtonSubmit>
			</div>
		</form>
	);
}

function SurveyLabelFieldset(
	props: EditorLabelingSurveyLabels[number] & {
		index: number;
		surveyId: string;
	}
) {
	const [currentLang, setCurrentLang] = useState(languageTag());
	const deleteLabel = surveyLabelDelete.bind(null, { id: props.id, surveyId: props.surveyId });
	return (
		<li className="flex flex-row items-start gap-2">
			<span className="flex h-11 w-6 items-center font-mono text-[.75rem] font-medium text-muted-foreground">
				{props.index + 1}.
			</span>
			{availableLanguageTags.map((lang) => (
				<fieldset
					key={lang}
					className="hidden flex-1 flex-row gap-2 aria-expanded:flex"
					aria-expanded={currentLang === lang || undefined}
				>
					<input
						type="hidden"
						defaultValue={lang}
						readOnly
						name={`labels[${props.index}].translations.${lang}.lang`}
						form="labels-form"
					/>
					<input
						type="hidden"
						defaultValue={props.id}
						readOnly
						name={`labels[${props.index}].translations.${lang}.id`}
						form="labels-form"
					/>
					<Input
						className="flex-[0.25] duration-500 animate-in fade-in slide-in-from-left-2"
						placeholder={m.label(undefined, { languageTag: lang })}
						defaultValue={props.translations[lang].text || ''}
						name={`labels[${props.index}].translations.${lang}.text`}
						form="labels-form"
					/>
					<Textarea
						rows={4}
						className="flex-1 resize-none leading-relaxed delay-75 duration-300 animate-in fade-in slide-in-from-left-4 fill-mode-both"
						placeholder={m.description(undefined, { languageTag: lang })}
						defaultValue={props.translations[lang].description || ''}
						name={`labels[${props.index}].translations.${lang}.description`}
						form="labels-form"
					/>
				</fieldset>
			))}
			<menu className="flex h-10 flex-row items-stretch gap-1 rounded-full border border-border p-1">
				{availableLanguageTags.map((lang) => (
					<button
						type="button"
						onClick={() => setCurrentLang(lang)}
						key={lang}
						className="flex items-center justify-center rounded-full px-3 text-sm font-medium capitalize transition-all hover:bg-primary/10 hover:text-primary aria-checked:bg-accent"
						aria-checked={currentLang === lang || undefined}
					>
						{lang}
					</button>
				))}
			</menu>
			<form action={deleteLabel}>
				<ButtonSubmit
					variant="destructive"
					className="aspect-square"
					size="sm"
					onClick={(e) => {
						if (!confirm(m.survey_label_delete_confirm())) {
							e.preventDefault();
							e.stopPropagation();
						}
					}}
				>
					<ButtonIconLoading icon={Trash2} />
				</ButtonSubmit>
			</form>
		</li>
	);
}

export function SurveyLabelsForm(
	props: EditorLabelingSurvey & { labels: EditorLabelingSurveyLabels }
) {
	const [_formState, formAction] = useFormState(surveyLabelsUpdate, undefined);
	return (
		<section className="flex animate-fly-up flex-col gap-8 rounded-lg border border-border bg-background p-8 delay-300 fill-mode-both">
			<h2 className="text-xl font-semibold">{m.labels()}</h2>
			<p className="text-sm leading-relaxed text-muted-foreground">{m.survey_labels_long()}</p>
			<ul className="flex flex-col gap-6">
				{props.labels.map((label, index) => (
					<SurveyLabelFieldset {...label} index={index} key={label.id} />
				))}
			</ul>
			<form
				className="col-start-2 self-center border-dashed"
				action={surveyLabelCreate.bind(null, props.id)}
			>
				<ButtonSubmit variant="outline" className="border-dashed">
					<ButtonIconLoading icon={Plus} />
					{m.survey_label_create()}
				</ButtonSubmit>
			</form>
			<form action={formAction} className="sticky bottom-0 self-end" id="labels-form">
				<ButtonSubmit>
					<ButtonIconLoading icon={Check} />
					{m.save()}
				</ButtonSubmit>
			</form>
		</section>
	);
}
