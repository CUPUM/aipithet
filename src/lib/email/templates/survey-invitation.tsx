import { withLang } from '@lib/i18n/utilities';
import { Button, Heading, Section, Text } from '@react-email/components';
import * as m from '@translations/messages';
import type { AvailableLanguageTag } from '@translations/runtime';
import { Template } from '../template';

export default function SurveyInvitationTemplate(props: {
	code: string;
	expiresAt: Date;
	surveyTitle: string;
	lang: AvailableLanguageTag;
}) {
	return (
		<Template>
			<Section className="w-full max-w-[60ch] text-center">
				<Heading as="h1" className="font-sans text-2xl">
					{m.survey_invitation_email_title(undefined, { languageTag: props.lang })}
				</Heading>
			</Section>
			<Section className="w-full max-w-[60ch] text-center">
				<Text className="m-0 p-0 text-4xl">🎉</Text>
				<Text className="whitespace-pre-line text-left font-sans text-sm">
					{m.survey_invitation_email_body(
						{
							date: (props.expiresAt ?? new Date()).toLocaleDateString(`${props.lang}-CA`, {
								weekday: 'long',
								year: 'numeric',
								month: 'long',
								day: 'numeric',
							}),
						},
						{ languageTag: props.lang }
					)}
				</Text>
				<code className="mb-4 block rounded-[1em] border border-solid border-slate-200 p-4 indent-[0.5em] font-mono text-lg font-normal tracking-[0.5em]">
					{props.code ?? 'CODE NOT FOUND'}
				</code>
				<Button
					className="rounded-[1em] bg-violet-700 px-5 py-4 font-sans text-sm font-medium text-gray-50"
					href={`${process.env.VERCEL_URL}/${withLang('/verify-email', props.lang)}`}
					hrefLang={props.lang}
				>
					🎟️&emsp;{m.survey_invitation_email_button(undefined, { languageTag: props.lang })}&emsp;🎟️
				</Button>
			</Section>
		</Template>
	);
}
