'use client';

export function SurveySecurityForm(props: EditorLabelingSurvey) {
	return (
		<form action="" className="rounded-lg bg-background p-8">
			<section>
				<ButtonSubmit variant="destructive">{m.survey_delete()}</ButtonSubmit>
			</section>
		</form>
	);
}
