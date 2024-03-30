'use client';

import surveyChapterCreate from '@lib/actions/survey-chapter-create';
import ButtonSubmit from '@lib/components/button-submit';
import { ButtonIconLoading } from '@lib/components/primitives/button';
import * as m from '@translations/messages';
import { Plus } from 'lucide-react';

export function SurveyChapterCreateForm(props: { surveyId: string }) {
	return (
		<form
			action={surveyChapterCreate}
			className="flex aspect-[5/3] animate-puff-grow items-stretch justify-stretch"
		>
			<ButtonSubmit
				name="surveyId"
				value={props.surveyId}
				className="flex h-[unset] flex-1 animate-fly-down items-center justify-center rounded-lg border-dashed bg-background p-8 fill-mode-both"
				variant="outline"
			>
				<ButtonIconLoading icon={Plus} />
				<span className="relative">{m.survey_chapter_create()}</span>
			</ButtonSubmit>
		</form>
	);
}
