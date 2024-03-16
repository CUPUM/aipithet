import { withLang } from '@lib/i18n/utilities';
import { languageTagServer } from '@lib/i18n/utilities-server';
import { Button, Heading, Section, Text } from '@react-email/components';
import * as m from '@translations/messages';
import { Template } from '../template';

export default function SurveyInvitationTemplate(props: {
	code: string;
	expiresAt: Date;
	surveyTitle: string;
}) {
	const lang = languageTagServer();

	return (
		<Template>
			<Section className="w-full max-w-[60ch] text-center">
				<Heading as="h1" className="font-sans text-2xl">
					{m.survey_invitation_email_title()}
				</Heading>
			</Section>
			<Section className="w-full max-w-[60ch] text-center">
				<Text className="m-0 p-0 text-4xl">🎉</Text>
				<Text className="whitespace-pre-line text-left font-sans text-sm">
					{m.survey_invitation_email_body({
						date: (props.expiresAt ?? new Date()).toLocaleDateString(`${lang}-CA`, {
							weekday: 'long',
							year: 'numeric',
							month: 'long',
							day: 'numeric',
						}),
					})}
				</Text>
				<code className="mb-4 block rounded-[1em] border border-solid border-slate-200 p-4 indent-[0.5em] font-mono text-lg font-normal tracking-[0.5em]">
					{props.code ?? 'CODE NOT FOUND'}
				</code>
				<Button
					className="rounded-[1em] bg-violet-700 px-5 py-4 font-sans text-sm font-medium text-gray-50"
					href={`${process.env.VERCEL_URL}/${withLang('/verify-email')}`}
					hrefLang={lang}
				>
					🎟️&emsp;{m.survey_invitation_email_button()}&emsp;🎟️
				</Button>
			</Section>
		</Template>
	);
}
