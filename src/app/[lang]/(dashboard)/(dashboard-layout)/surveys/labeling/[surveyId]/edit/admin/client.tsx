'use client';

import surveyDelete from '@lib/actions/survey-delete';
import ButtonSubmit from '@lib/components/button-submit';
import * as m from '@translations/messages';

export function SurveyDeleteForm(props: { surveyId: string }) {
	return (
		<form action={surveyDelete.bind(null, props.surveyId)} className="rounded-lg bg-background p-8">
			<section>
				<ButtonSubmit
					variant="destructive"
					onClick={(e) => {
						if (
							!confirm(
								'Do you really wish to delete this survey? All previously collected answers related to this survey will be lost!'
							)
						) {
							e.preventDefault();
							e.stopPropagation();
						}
					}}
				>
					{m.survey_delete()}
				</ButtonSubmit>
			</section>
		</form>
	);
}
