import { withLang } from '@lib/i18n/utilities';
import { Button, Heading, Section, Text } from '@react-email/components';
import * as m from '@translations/messages';
import type { AvailableLanguageTag } from '@translations/runtime';
import { Template } from '../template';

export default function SurveyJoinedTemplate(props: {
	surveyTitle: string;
	editor?: boolean;
	lang: AvailableLanguageTag;
}) {
	return (
		<Template>
			<Section className="w-full max-w-[60ch] text-center">
				<Heading as="h1" className="font-sans text-2xl">
					{props.editor
						? m.survey_joined_editor_email_title(undefined, { languageTag: props.lang })
						: m.survey_joined_pariticpant_email_title(undefined, { languageTag: props.lang })}
				</Heading>
			</Section>
			<Section className="w-full max-w-[60ch] text-center">
				<Text className="m-0 p-0 text-4xl">🎉</Text>
				<Text className="whitespace-pre-line text-left font-sans text-sm">
					{m.survey_joined_email_body(
						{
							userType: props.editor ? m.editor() : m.participant(),
							surveyTitle: props.surveyTitle,
						},
						{ languageTag: props.lang }
					)}
				</Text>
				<Button
					className="rounded-[1em] bg-violet-700 px-5 py-4 font-sans text-sm font-medium text-gray-50"
					href={`${process.env.VERCEL_PROJECT_PRODUCTION_URL}/${withLang('/surveys', props.lang)}`}
					hrefLang={props.lang}
				>
					{m.my_surveys(undefined, { languageTag: props.lang })}
				</Button>
			</Section>
		</Template>
	);
}
