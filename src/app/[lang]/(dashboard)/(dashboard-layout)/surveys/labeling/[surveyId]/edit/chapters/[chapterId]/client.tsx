'use client';

import fixCriteriaBug from '@lib/actions/fix-criteria-bug';
import imagePairsUpload from '@lib/actions/image-pairs-upload';
import surveyChapterConfigurationUpdate from '@lib/actions/survey-chapter-configuration-update';
import surveyChapterEnd from '@lib/actions/survey-chapter-end';
import surveyChapterPresentationUpdate from '@lib/actions/survey-chapter-presentation-update';
import surveyChapterStart from '@lib/actions/survey-chapter-start';
import ButtonSubmit from '@lib/components/button-submit';
import LanguagesFieldsets from '@lib/components/languages-fieldset';
import { Button, ButtonIconLoading } from '@lib/components/primitives/button';
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
import { Textarea } from '@lib/components/primitives/textarea';
import { toDateTimeLocalString } from '@lib/components/utilities';
import * as m from '@translations/messages';
import { Check, Upload } from 'lucide-react';
import { useState } from 'react';
import { useFormState } from 'react-dom';
import type { EditorLabelingSurveyChapter, SelectableImagesPools } from './page';

export function SurveyChapterPresentationForm(props: EditorLabelingSurveyChapter) {
	const [formState, formAction] = useFormState(surveyChapterPresentationUpdate, undefined);

	return (
		<form
			action={formAction}
			className="flex flex-col gap-6 rounded-lg border border-border bg-background p-8"
		>
			<h4 className="text-xl font-semibold">{m.presentation()}</h4>
			<LanguagesFieldsets>
				{(tag) => (
					<>
						<input type="hidden" name={`${tag}.id`} value={props.id} readOnly />
						<input type="hidden" name={`${tag}.lang`} value={tag} readOnly />
						<Field>
							<Label htmlFor={`title-${tag}`}>{m.title(undefined, { languageTag: tag })}</Label>
							<Input
								name={`${tag}.title`}
								id={`title-${tag}`}
								type="text"
								className="font-semibold"
								defaultValue={props.translations[tag].title ?? ''}
							/>
							<ErrorMessages errors={formState?.errors?.[tag]?.title?._errors} />
						</Field>
						<Field>
							<Label htmlFor={`summary-${tag}`}>{m.summary(undefined, { languageTag: tag })}</Label>
							<Textarea
								name={`${tag}.summary`}
								id={`summary-${tag}`}
								rows={2}
								defaultValue={props.translations[tag].summary ?? ''}
								className="leading-relaxed text-foreground/80"
							/>
							<ErrorMessages errors={formState?.errors?.[tag]?.summary?._errors} />
						</Field>
						<Field>
							<Label htmlFor={`description-${tag}`}>
								{m.description(undefined, { languageTag: tag })}
							</Label>
							<Textarea
								name={`${tag}.description`}
								id={`description-${tag}`}
								rows={5}
								defaultValue={props.translations[tag].description ?? ''}
								className="leading-relaxed text-foreground/80"
							/>
							<ErrorMessages errors={formState?.errors?.[tag]?.description?._errors} />
						</Field>
					</>
				)}
			</LanguagesFieldsets>
			<ButtonSubmit className="sticky bottom-0 self-end">
				{m.save()}
				<ButtonIconLoading icon={Check} />
			</ButtonSubmit>
		</form>
	);
}

export function SurveyChapterConfigurationForm(
	props: EditorLabelingSurveyChapter & { selectableImagesPools: SelectableImagesPools }
) {
	const [formState, formAction] = useFormState(surveyChapterConfigurationUpdate, undefined);

	return (
		<form
			action={formAction}
			className="flex flex-col gap-6 rounded-lg border border-border bg-background py-8"
		>
			<input type="hidden" name="id" value={props.id} readOnly />
			<h4 className="px-8 pb-0 text-xl font-semibold">{m.settings()}</h4>
			<Field className="p-8 pb-0 md:flex-row md:gap-8">
				<div className="flex flex-col gap-2">
					<Label>{m.date_range_active()}</Label>
					<p className="my-4 text-sm leading-relaxed text-muted-foreground">
						{m.date_range_active_long()}
					</p>
				</div>
				<div className="flex flex-row items-start gap-4">
					<Field>
						<Label>{m.start()}</Label>
						<Input
							name="start"
							type="datetime-local"
							defaultValue={props.start ? toDateTimeLocalString(props.start) : undefined}
						/>
						<ErrorMessages errors={formState?.errors?.start?._errors} />
					</Field>
					<span className="mt-9 group-disabled:opacity-10">&mdash;</span>
					<Field>
						<Label>{m.end()}</Label>
						<Input
							name="end"
							type="datetime-local"
							defaultValue={props.end ? toDateTimeLocalString(props.end) : undefined}
						/>
						<ErrorMessages errors={formState?.errors?.end?._errors} />
					</Field>
				</div>
			</Field>
			<Field className="self-end p-8 pt-0">
				{props.isActive ? (
					<ButtonSubmit variant="secondary" formAction={surveyChapterEnd.bind(null, props.id)}>
						{m.end_now()}
					</ButtonSubmit>
				) : (
					<ButtonSubmit formAction={surveyChapterStart.bind(null, props.id)}>
						{m.start_now()}
					</ButtonSubmit>
				)}
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
			<hr />
			<Field className="gap-4 px-8 md:flex-row">
				<div className="flex flex-1 flex-col gap-4">
					<Label>Chapter Mode (Fixed or Random)</Label>
				</div>
				<div className="flex flex-1 flex-col md:pt-6">
					<Select name="mode" defaultValue={props.mode}>
						<SelectTrigger className="w-auto min-w-60 self-center">
							<SelectValue placeholder="Select a mode" />
						</SelectTrigger>
						<SelectContent>
							<SelectItem key="fixed" value="fixed" textValue="fixed">
								fixed
							</SelectItem>
							<SelectItem key="random" value="random" textValue="random">
								random
							</SelectItem>
						</SelectContent>
					</Select>
				</div>
			</Field>
			<Field className="p-8">
				<Label>{m.answer_quota()}</Label>
				<p className="my-4 text-sm leading-relaxed text-muted-foreground">
					How many labeling pages should participants be limited to or expected to answer for this
					chapter?
				</p>
				<Input
					type="number"
					name="+maxAnswersCount"
					className="w-auto self-start"
					defaultValue={props.maxAnswersCount || undefined}
					min={0}
				/>
				<ErrorMessages errors={formState?.errors?.maxAnswersCount?._errors} />
			</Field>
			<div className="sticky bottom-0 self-end px-8">
				<ButtonSubmit>
					{m.save()}
					<ButtonIconLoading icon={Check} />
				</ButtonSubmit>
			</div>
		</form>
	);
}

export function ImagePairsUploadForm(props: { chapterId: string; surveyId: string }) {
	const [formState, formAction] = useFormState(imagePairsUpload, undefined);
	console.log(formState);
	const [value, setValue] = useState(false);
	return (
		<form action={formAction} className="sticky bottom-0 flex flex-col items-start">
			<input type="hidden" value={props.chapterId} name="chapterId" readOnly />
			<input type="hidden" value={props.surveyId} name="surveyId" readOnly />
			<fieldset className="flex flex-row gap-2">
				<Button
					asChild
					variant="secondary"
					className="cursor-pointer p-1 file:mr-4 file:h-full file:cursor-pointer file:rounded-sm file:border-none file:bg-input file:px-5"
				>
					<input
						type="file"
						required
						accept="application/json"
						name="file"
						onChange={(e) => setValue(!!e.target.value)}
					/>
				</Button>
				{value ? (
					<ButtonSubmit className="animate-puff-grow">
						{m.upload()}
						<ButtonIconLoading icon={Upload} />
					</ButtonSubmit>
				) : null}
				<ErrorMessages
					errors={formState && 'errors' in formState ? formState.errors.file?._errors : undefined}
				/>
			</fieldset>
		</form>
	);
}

export function FixCriteriaBug(props: { chapterId: string; surveyId: string }) {
	const [formState, formAction] = useFormState(fixCriteriaBug, undefined);
	return (
		<form action={formAction}>
			<input type="hidden" value={props.chapterId} name="chapterId" readOnly />
			<input type="hidden" value={props.surveyId} name="surveyId" readOnly />
			<ButtonSubmit className="sticky bottom-0 self-end">
				Fix Criteria Bug
				<ButtonIconLoading icon={Check} />
			</ButtonSubmit>
		</form>
	);
}
