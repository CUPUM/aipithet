'use client';

import surveyAnswerUpdate from '@lib/actions/survey-answer-update';
import ButtonSubmit from '@lib/components/button-submit';
import { Button, ButtonIconLoading } from '@lib/components/primitives/button';
import { Checkbox } from '@lib/components/primitives/checkbox';
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '@lib/components/primitives/dialog';
import { DialogPortal } from '@radix-ui/react-dialog';
import * as m from '@translations/messages';
import { CircleHelp, MessageCircleMore, RefreshCcw, Save, Star } from 'lucide-react';
import type { ImageProps } from 'next/image';
import Image from 'next/image';
import Link from 'next/link';
import { useMemo, useState, type ComponentProps } from 'react';
import { useFormState } from 'react-dom';
import Markdown from 'react-markdown';
import type { ImageIndex, SurveyAnswer } from './page';

export function HelpClient(props: { help: string | null }) {
	return (
		<hgroup>
			<Dialog>
				<DialogTrigger className="cursor-help rounded-md px-5 py-2 text-2xl font-semibold text-foreground transition-all hover:bg-primary/10 hover:text-primary">
					<CircleHelp />
				</DialogTrigger>
				<DialogContent className="max-w-xl border-none">
					<DialogHeader>
						<DialogTitle className="text-4xl font-semibold">{m.help()}</DialogTitle>
					</DialogHeader>
					<Markdown
						components={{
							a: ({ children, href }) => (
								<a className="text-primary underline" href={href as string} target="_blank">
									{children}
								</a>
							),
						}}
					>
						{props.help}
					</Markdown>
				</DialogContent>
			</Dialog>
		</hgroup>
	);
}

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
		<Dialog>
			<DialogTrigger asChild>
				<div className="relative h-full w-full ">
					<Image
						{...imageProps}
						className="aspect-square rounded-sm bg-border/50 object-contain"
						fill
						onError={() => {
							setBroken(true);
						}}
					/>
					{broken ? <ImageErrorForm /> : null}
				</div>
			</DialogTrigger>
			<DialogContent className="h-full max-w-screen-lg">
				<DialogHeader>
					<DialogTitle></DialogTitle>
				</DialogHeader>
				<Image
					{...imageProps}
					className="aspect-square rounded-sm bg-border/50 object-contain"
					fill
					onError={() => {
						setBroken(true);
					}}
				/>
				{broken ? <ImageErrorForm /> : null}
			</DialogContent>
		</Dialog>
	);
}

function StepsDatalist(props: { count: number | null; max: number }) {
	const options = useMemo(() => {
		if (!props.count) {
			return [];
		}
		const step = props.max / props.count;
		return Array.from({ length: props.count }, (_, i) => (step * i).toFixed(1));
	}, [props.count]);
	return (
		<datalist id="steps">
			{options.map((o, i) => (
				<option value={`-${o}`} key={`step-left-${i}`}></option>
			))}
			<option value={0}></option>
			{options.map((o, i) => (
				<option value={o} key={`step-right-${i}`}></option>
			))}
		</datalist>
	);
}

function Slider({
	stepCount,
	...inputProps
}: Omit<ComponentProps<'input'>, 'className' | 'step'> & {
	stepCount: number | null;
	max: number;
	min: number;
}) {
	const step = useMemo(() => {
		if (!stepCount) {
			return 0.001;
		}
		return (inputProps.max ?? 1) / stepCount;
	}, [stepCount, inputProps.max]);
	const ticks = useMemo(() => {
		if (!stepCount) {
			return [inputProps.min, 0, inputProps.max];
		}
		const positives = Array.from({ length: stepCount }, (_, i) => step * i);
		const negatives = [...positives.map((v) => -1 * v)];
		return [...negatives, 0, ...positives];
	}, [stepCount, step]);
	return (
		<div className="relative">
			<div className="pointer-events-none absolute inset-0 flex flex-row items-center justify-between px-1.5 opacity-15">
				{ticks.map((v) => (
					<div
						className="h-1 w-0.5 rounded-full bg-foreground"
						key={`tick-${v}`}
						data-step={v}
					></div>
				))}
			</div>
			<input
				{...inputProps}
				step={step}
				type="range"
				className="w-full cursor-pointer appearance-none bg-transparent outline-none transition-all focus:outline-none focus-visible:outline-none slider-thumb:mt-1.5 slider-thumb:size-5 slider-thumb:-translate-y-1/2 slider-thumb:appearance-none slider-thumb:rounded-full slider-thumb:bg-primary slider-thumb:shadow-[0_0.5em_1em_-0.35em_black] slider-thumb:outline slider-thumb:outline-0 slider-thumb:outline-primary/0 slider-thumb:transition-all slider-thumb:hover:outline-[6px] slider-thumb:hover:outline-primary/35 slider-thumb:focus:outline-8 slider-thumb:focus:outline-primary/25 slider-track:h-3 slider-track:rounded-full slider-track:bg-input/25 slider-track:transition-all slider-track:duration-300 hover:slider-track:bg-input/50"
			/>
		</div>
	);
}

export function LabelingFormClient(props: SurveyAnswer & { surveyId: string }) {
	const [comment, setComment] = useState<string>();
	const [active, setActive] = useState({ 0: false, 1: false, 2: false });
	const surveyAnswerUpdateWithComment = surveyAnswerUpdate.bind(null, comment, active); // Currently this is a hack because calling submit inside the dialog doesn't work.
	const [formState, formAction] = useFormState(surveyAnswerUpdateWithComment, undefined);
	const min = -1;
	const max = 1;
	return (
		<form
			action={formAction}
			noValidate
			className="pointer-events-none inset-0 flex flex-col items-center justify-center p-[inherit]"
		>
			<input type="hidden" value={props.surveyId} readOnly name="surveyId" />
			<input type="hidden" value={props.chapterId} readOnly name="chapterId" />
			<input type="hidden" value={props.id} readOnly name="id" />
			<div className="pointer-events-auto w-full px-10">
				<div className="flex items-center">
					<label>
						<LabelClient {...props.labels[1]}></LabelClient>
					</label>
					<Checkbox name="&checked1" checked={active[0]} />
				</div>
				<Slider
					name="+score1"
					stepCount={props.sliderStepCount}
					min={min}
					max={max}
					defaultValue={props.score1 || 0}
					onClick={() => setActive((prev) => ({ ...prev, 0: true }))}
				/>
			</div>
			<div className="pointer-events-auto w-full px-10">
				<div className="flex items-center">
					<label>
						<LabelClient {...props.labels[2]}></LabelClient>
					</label>
					<Checkbox name="&checked2" checked={active[1]} />
				</div>
				<Slider
					name="+score2"
					stepCount={props.sliderStepCount}
					min={min}
					max={max}
					defaultValue={props.score2 || 0}
					onClick={() => setActive((prev) => ({ ...prev, 1: true }))}
				/>
			</div>
			<div className="pointer-events-auto w-full px-10">
				<div className="flex items-center">
					<label>
						<LabelClient {...props.labels[3]}></LabelClient>
					</label>
					<Checkbox name="&checked3" checked={active[2]} />
				</div>
				<Slider
					name="+score3"
					stepCount={props.sliderStepCount}
					min={min}
					max={max}
					defaultValue={props.score3 || 0}
					onClick={() => setActive((prev) => ({ ...prev, 2: true }))}
				/>
			</div>
			<nav className="mt-8 flex w-full justify-between px-10">
				{props.prevAnswerId ? (
					<Link
						href={`/surveys/labeling/${props.surveyId}/${props.chapterId}/${props.prevAnswerId}`}
					>
						<Button type="button" className="pointer-events-auto">
							Previous
						</Button>
					</Link>
				) : (
					<div></div>
				)}

				{Object.values(active).some((value) => value) ? (
					<menu className="flex gap-8">
						<ButtonSubmit className="pointer-events-auto animate-puff-grow text-lg font-medium shadow-lg">
							{m.submit()}
							<ButtonIconLoading icon={Star} />
						</ButtonSubmit>
						<Dialog>
							<DialogTrigger asChild>
								<Button
									variant="secondary"
									className="pointer-events-auto animate-puff-grow text-lg font-medium shadow-lg"
								>
									{m.add_comment()}
									<ButtonIconLoading icon={MessageCircleMore} />
								</Button>
							</DialogTrigger>
							<DialogPortal>
								<DialogContent>
									<DialogHeader>
										<DialogTitle>{m.add_comment()}</DialogTitle>
									</DialogHeader>
									<textarea
										name="comment"
										className="h-64 w-full rounded-md border border-border/50 bg-background p-4 shadow-lg"
										value={comment}
										onChange={(e) => setComment(e.target.value)}
										placeholder={m.write_comment()}
									/>
									<DialogFooter>
										<DialogClose asChild>
											<Button variant="destructive" onClick={() => setComment(undefined)}>
												{m.cancel()}
											</Button>
										</DialogClose>
										<DialogClose asChild>
											<ButtonSubmit className="pointer-events-auto animate-puff-grow text-lg font-medium shadow-lg">
												{m.save()}
												<ButtonIconLoading icon={Save} />
											</ButtonSubmit>
										</DialogClose>
									</DialogFooter>
								</DialogContent>
							</DialogPortal>
						</Dialog>
					</menu>
				) : null}

				{props.nextAnswerId ? (
					<Link
						href={`/surveys/labeling/${props.surveyId}/${props.chapterId}/${props.nextAnswerId}`}
					>
						<Button type="button" className="pointer-events-auto">
							Next
						</Button>
					</Link>
				) : (
					<div></div>
				)}
			</nav>
		</form>
	);
}
