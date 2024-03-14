import { withLang } from '@lib/i18n/utilities';
import { Button, Heading, Section, Text } from '@react-email/components';
import * as m from '@translations/messages';
import { languageTag } from '@translations/runtime';
import { Template } from '../template';

export default function SurveyInvitationTemplate(props: {
	code: string;
	expiresAt: Date;
	surveyTitle: string;
}) {
	const lang = languageTag();

	return (
		<Template>
			<Section className="text-center w-full max-w-[60ch]">
				<Heading as="h1" className="font-sans text-2xl">
					{m.survey_invitation_email_title()}
				</Heading>
			</Section>
			<Section className="text-center w-full max-w-[60ch]">
				<Text className="text-4xl p-0 m-0">🎉</Text>
				<Text className="font-sans text-sm text-left whitespace-pre-line">
					{m.survey_invitation_email_body({
						date: (props.expiresAt ?? new Date()).toLocaleDateString(`${lang}-CA`, {
							weekday: 'long',
							year: 'numeric',
							month: 'long',
							day: 'numeric',
						}),
					})}
				</Text>
				<code className="font-mono block tracking-[0.5em] indent-[0.5em] text-lg p-4 rounded-[1em] border border-solid border-slate-200 font-normal mb-4">
					{props.code ?? 'CODE NOT FOUND'}
				</code>
				<Button
					className="text-sm font-sans font-medium text-gray-50 bg-violet-700 rounded-[1em] px-5 py-4"
					href={`${process.env.VERCEL_URL}/${withLang('/verify-email')}`}
					hrefLang={lang}
				>
					🎟️&emsp;{m.survey_invitation_email_button()}&emsp;🎟️
				</Button>
			</Section>
		</Template>
	);
}
