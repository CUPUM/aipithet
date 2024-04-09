'use client';

import { useMemo } from 'react';
import type { SurveyAnswer } from './page';

export function LabelingForm(props: SurveyAnswer) {
	const step = useMemo(
		() => (props.sliderStepCount ? 1 / props.sliderStepCount : 0.01),
		[props.sliderStepCount]
	);
	return (
		<form
			action=""
			className="pointer-events-none absolute inset-0 flex items-center justify-center p-[inherit]"
		>
			<input
				name="score"
				type="range"
				step={step}
				min={-1}
				max={1}
				defaultValue={props.score || 0}
				className="pointer-events-auto w-full"
			/>
		</form>
	);
}
