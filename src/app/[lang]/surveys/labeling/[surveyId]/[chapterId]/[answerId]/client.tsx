'use client';

import surveyAnswerUpdate from '@lib/actions/survey-answer-update';
import ButtonSubmit from '@lib/components/button-submit';
import { ButtonIconLoading } from '@lib/components/primitives/button';
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '@lib/components/primitives/dialog';
import * as m from '@translations/messages';
import { RefreshCcw, Star } from 'lucide-react';
import type { ImageProps } from 'next/image';
import Image from 'next/image';
import { useMemo, useState } from 'react';
import { useFormState } from 'react-dom';
import Markdown from 'react-markdown';
import type { ImageIndex, SurveyAnswer } from './page';

export function LabelClient(props: {
	id: string;
	text: string | null;
	description: string | null;
	lang: 'en' | 'fr';
}) {
	return (
		<hgroup>
			<Dialog>
				<DialogTrigger className="cursor-help rounded-md px-5 py-2 text-2xl font-semibold text-foreground transition-all hover:bg-primary/10 hover:text-primary">
					{props.text || <span className="italic text-muted-foreground">{m.label_no_text()}</span>}
				</DialogTrigger>
				<DialogContent className="border-none">
					<DialogHeader>
						<DialogTitle className="text-4xl font-semibold">
							{props.text || (
								<span className="italic text-muted-foreground">{m.label_no_text()}</span>
							)}
						</DialogTitle>
					</DialogHeader>
					{props.description ? (
						<Markdown>{props.description}</Markdown>
					) : (
						<p className="italic text-muted-foreground">{m.description_none()}</p>
					)}
				</DialogContent>
			</Dialog>
		</hgroup>
	);
}

function ImageErrorForm() {
	return (
		<form className="row absolute bottom-0 z-10 flex w-full items-center justify-center p-6">
			<ButtonSubmit size="sm" variant="destructive">
				<ButtonIconLoading icon={RefreshCcw} />
				{m.image_broken()} ?
			</ButtonSubmit>
		</form>
	);
}

export function AnswerImageClient({
	imageId,
	index,
	answerId,
	...imageProps
}: ImageProps & { imageId: string; index: ImageIndex; answerId: string }) {
	const [broken, setBroken] = useState(false);
	return (
		<div className="relative h-full w-full">
			<Image
				{...imageProps}
				className="aspect-square rounded-sm bg-border/50 object-cover"
				fill
				onError={() => {
					setBroken(true);
				}}
			/>
			{broken ? <ImageErrorForm /> : null}
		</div>
	);
}

export function LabelingFormClient(props: SurveyAnswer & { surveyId: string }) {
	const [formState, formAction] = useFormState(surveyAnswerUpdate, undefined);
	const step = useMemo(
		() => (props.sliderStepCount ? 1 / props.sliderStepCount : 0.01),
		[props.sliderStepCount]
	);
	const [dirty, setDirty] = useState(false);
	return (
		<form
			action={formAction}
			className="pointer-events-none inset-0 flex flex-col items-center justify-center p-[inherit]"
		>
			<input type="hidden" value={props.surveyId} readOnly name="surveyId" />
			<input type="hidden" value={props.chapterId} readOnly name="chapterId" />
			<input type="hidden" value={props.id} readOnly name="id" />
			<div className="pointer-events-auto w-full px-10">
				<label>
					<LabelClient {...props.labels[1]}></LabelClient>
				</label>
				<input
					name="+score1"
					type="range"
					step={step}
					min={-1}
					max={1}
					defaultValue={props.score1 || 0}
					className="w-full cursor-pointer appearance-none bg-transparent transition-all slider-thumb:mt-1.5 slider-thumb:size-5 slider-thumb:-translate-y-1/2 slider-thumb:appearance-none slider-thumb:rounded-full slider-thumb:bg-primary slider-thumb:shadow-[0_0.5em_1em_-0.35em_black] slider-thumb:transition-all hover:slider-thumb:size-24 slider-track:h-3 slider-track:rounded-full slider-track:bg-input/25 slider-track:transition-all slider-track:duration-500 hover:slider-track:bg-input"
					onClick={() => setDirty(true)}
				/>
			</div>
			<div className="pointer-events-auto w-full px-10">
				<label>
					<LabelClient {...props.labels[2]}></LabelClient>
				</label>
				<input
					name="+score2"
					type="range"
					step={step}
					min={-1}
					max={1}
					defaultValue={props.score2 || 0}
					className="w-full cursor-pointer appearance-none bg-transparent transition-all slider-thumb:mt-1.5 slider-thumb:size-5 slider-thumb:-translate-y-1/2 slider-thumb:appearance-none slider-thumb:rounded-full slider-thumb:bg-primary slider-thumb:shadow-[0_0.5em_1em_-0.35em_black] slider-thumb:transition-all hover:slider-thumb:size-24 slider-track:h-3 slider-track:rounded-full slider-track:bg-input/25 slider-track:transition-all slider-track:duration-500 hover:slider-track:bg-input"
					onClick={() => setDirty(true)}
				/>
			</div>
			<div className="pointer-events-auto w-full px-10">
				<label>
					<LabelClient {...props.labels[3]}></LabelClient>
				</label>
				<input
					name="+score3"
					type="range"
					step={step}
					min={-1}
					max={1}
					defaultValue={props.score3 || 0}
					className="w-full cursor-pointer appearance-none bg-transparent transition-all slider-thumb:mt-1.5 slider-thumb:size-5 slider-thumb:-translate-y-1/2 slider-thumb:appearance-none slider-thumb:rounded-full slider-thumb:bg-primary slider-thumb:shadow-[0_0.5em_1em_-0.35em_black] slider-thumb:transition-all hover:slider-thumb:size-24 slider-track:h-3 slider-track:rounded-full slider-track:bg-input/25 slider-track:transition-all slider-track:duration-500 hover:slider-track:bg-input"
					onClick={() => setDirty(true)}
				/>
			</div>
			{dirty ? (
				<menu className="mt-8">
					<ButtonSubmit className="pointer-events-auto animate-puff-grow text-lg font-medium shadow-lg">
						{m.submit()}
						<ButtonIconLoading icon={Star} />
					</ButtonSubmit>
				</menu>
			) : null}
		</form>
	);
}

// export function LabelingFormClient(props: SurveyAnswer & { surveyId: string }) {
// 	const [formState, formAction] = useFormState(surveyAnswerUpdate, undefined);
// 	const step = useMemo(
// 		() => (props.sliderStepCount ? 1 / props.sliderStepCount : 0.01),
// 		[props.sliderStepCount]
// 	);
// 	const [dirty, setDirty] = useState(false);
// 	return (
// 		<form
// 			action={formAction}
// 			className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center p-[inherit]"
// 		>
// 			<input type="hidden" value={props.surveyId} readOnly name="surveyId" />
// 			<input type="hidden" value={props.chapterId} readOnly name="chapterId" />
// 			<input type="hidden" value={props.id} readOnly name="id" />
// 			<label className="pointer-events-auto w-full px-10">
// 				<input
// 					name="+score"
// 					type="range"
// 					step={step}
// 					min={-1}
// 					max={1}
// 					defaultValue={props.score1 || 0}
// 					className="w-full cursor-pointer appearance-none bg-transparent transition-all slider-thumb:mt-1.5 slider-thumb:size-20 slider-thumb:-translate-y-1/2 slider-thumb:appearance-none slider-thumb:rounded-full slider-thumb:bg-primary slider-thumb:shadow-[0_0.5em_1em_-0.35em_black] slider-thumb:transition-all hover:slider-thumb:size-5 slider-track:h-3 slider-track:rounded-full slider-track:bg-input/25 slider-track:transition-all slider-track:duration-500 hover:slider-track:bg-input"
// 					onClick={() => setDirty(true)}
// 				/>
// 			</label>
// 			{dirty ? (
// 				<menu className="absolute bottom-0">
// 					<ButtonSubmit className="pointer-events-auto animate-puff-grow text-lg font-medium shadow-lg">
// 						{m.submit()}
// 						<ButtonIconLoading icon={Star} />
// 					</ButtonSubmit>
// 				</menu>
// 			) : null}
// 		</form>
// 	);
// }

{
	/* <Slider.Root
				step={step}
				min={-1}
				max={1}
				defaultValue={[props.score ?? 0]}
				name="score"
				onValueChange={() => {
					setDirty(true);
				}}
				className="group/slider absolute z-10 flex h-full w-full touch-none select-none flex-row items-center aria-[disabled=true]:hidden data-[pending=true]:pointer-events-none data-[pending=true]:cursor-not-allowed"
			>
				<Slider.Track className="relative flex grow touch-none select-none flex-row items-center">
					<div className="text-base-200 dark:text-base-900 pointer-events-none absolute flex w-full touch-none select-none flex-row items-center gap-4 p-4 opacity-0 transition-all duration-100 ease-out group-hover/slider:opacity-90 group-data-[disabled]/slider:opacity-0">
						<ChevronLeft
							size="2em"
							stroke="3.5"
							className="translate-x-2 opacity-0 transition-all delay-100 duration-100 ease-out group-hover/slider:translate-x-0 group-hover/slider:opacity-100"
						/>
						<div className="ease-out-expo h-1.5 flex-1 scale-x-75 rounded-full bg-current shadow-black/20 transition-transform duration-100 group-hover/slider:scale-x-100 group-hover/slider:shadow-sm"></div>
						<ChevronRight
							size="2em"
							stroke="3.5"
							className="-translate-x-2 opacity-0 transition-all delay-100 duration-100 ease-out group-hover/slider:translate-x-0 group-hover/slider:opacity-100"
						/>
					</div>
					<div
						className={cn(
							'from-accent1-900/0 to-accent1-600/90 absolute h-16 rounded-full bg-gradient-to-r transition-all duration-100 ease-out group-data-[disabled]/slider:opacity-0',
							{
								'bg-gradient-to-l': (props.score ?? 0) < 0,
							}
						)}
						style={{
							width: `${(Math.abs(props.score ?? 0) / 2) * 100}%`,
							left: (props.score ?? 0) >= 0 ? '50%' : undefined,
							right: (props.score ?? 0) < 0 ? '50%' : undefined,
						}}
					/>
					<Slider.Range className="bg-accent1-500 absolute rounded-full data-[orientation=horizontal]:h-6 data-[orientation=vertical]:w-6" />
				</Slider.Track>
				<Tooltip content={props.thumbLabel} delayDuration={1000}>
          <Slider.Thumb
            onKeyDownCapture={updateKeys}
            onKeyUp={updateKeys}
            className="animate-pop-in bg-accent1-500 outline-focus hover:bg-accent1-600 dark:bg-accent1-600 dark:hover:bg-accent1-500 text-accent1-100 shadow-accent1-900/30 hover:shadow-accent1-800/60 active:text-accent1-200 active:shadow-accent1-900/60 flex aspect-square w-20 flex-none cursor-move items-center justify-center rounded-full shadow-md transition-all duration-150 ease-out hover:text-white hover:shadow-lg active:scale-105 active:shadow-md active:outline-8 data-[disabled]:scale-90 data-[disabled]:opacity-0 group-data-[pending=true]/slider:scale-110"
            aria-label="Representativeness"
            style={{ scale: pending ? undefined : 1 + Math.abs(rating ?? 0 / 5) }}
          >
            <IconChevronLeft className="opacity-25" />
            <IconStarFilled className="group-data-[pending=true]/slider:animate-spin" />
            <IconChevronRight className="opacity-25" />
          </Slider.Thumb>
        </Tooltip>
			</Slider.Root> */
}
