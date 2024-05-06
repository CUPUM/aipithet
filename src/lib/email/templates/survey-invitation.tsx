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
	surveyId: string;
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
					{m.survey_invitation_email_p0()}
				</Text>
				<Text className="whitespace-pre-line text-left font-sans text-sm">
					{m.survey_invitation_email_p1()}
				</Text>
				<a
					href="https://www.loom.com/share/5e3b4574e06847149a9882b349e78768?sid=61d36f78-81d7-4123-a491-e8d55b1103b2"
					className="text-primary"
				>
					Tutoriel
				</a>
				<Text className="whitespace-pre-line text-left font-sans text-sm">
					{m.survey_invitation_email_p2()}
				</Text>
				<Button
					className="rounded-[1em] bg-violet-700 px-5 py-4 font-sans text-sm font-medium text-gray-50"
					href={`${process.env.VERCEL_PROJECT_PRODUCTION_URL}/${withLang('/signup', props.lang)}`}
					hrefLang={props.lang}
				>
					{m.signup(undefined, { languageTag: props.lang })}
				</Button>
				<Text className="whitespace-pre-line text-left font-sans text-sm">
					{m.survey_invitation_email_p3(
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
					href={`${process.env.VERCEL_PROJECT_PRODUCTION_URL}/${withLang(`/surveys/labeling/${props.surveyId}`, props.lang)}`}
					hrefLang={props.lang}
				>
					🎟️&emsp;{m.survey_invitation_email_button(undefined, { languageTag: props.lang })}&emsp;🎟️
				</Button>
			</Section>
		</Template>
	);
}
