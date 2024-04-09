'use client';

import surveyAnswerUpdate from '@lib/actions/survey-answer-update';
import ButtonSubmit from '@lib/components/button-submit';
import { ButtonIconLoading } from '@lib/components/primitives/button';
import * as m from '@translations/messages';
import { RefreshCcw, Star } from 'lucide-react';
import type { ImageProps } from 'next/image';
import Image from 'next/image';
import { useMemo, useState } from 'react';
import { useFormState } from 'react-dom';
import type { ImageIndex, SurveyAnswer } from './page';

/**
 * @todo Add expandable description.
 */
export function LabelClient(props: SurveyAnswer) {
	return <hgroup></hgroup>;
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
		<div className="relative">
			<Image
				{...imageProps}
				className="rounded-sm bg-border/50 object-contain"
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
			className="pointer-events-none absolute inset-0 flex items-center justify-center p-[inherit]"
		>
			<input type="hidden" value={props.surveyId} readOnly name="surveyId" />
			<input type="hidden" value={props.chapterId} readOnly name="chapterId" />
			<input type="hidden" value={props.id} readOnly name="id" />
			<input
				name="score"
				type="range"
				step={step}
				min={-1}
				max={1}
				defaultValue={props.score || 0}
				className="pointer-events-auto w-full"
				onChange={() => setDirty(true)}
			/>
			{dirty ? (
				<ButtonSubmit className="pointer-events-auto">
					{m.submit()}
					<ButtonIconLoading icon={Star} />
				</ButtonSubmit>
			) : null}
		</form>
	);
}

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
