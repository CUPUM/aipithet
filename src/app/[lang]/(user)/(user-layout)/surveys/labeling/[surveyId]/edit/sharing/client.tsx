'use client';

import surveyInvite from '@lib/actions/survey-invite';
import { useFormState } from 'react-dom';
import type { EditorLabelingSurvey } from '../page';

export function SurveySharingForm(props: EditorLabelingSurvey) {
	const [formState, formAction] = useFormState(surveyInvite, undefined);
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
