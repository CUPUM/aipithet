import { withLang } from '@lib/i18n/utilities';
import { languageTagServer } from '@lib/i18n/utilities-server';
import { Button, Heading, Section, Text } from '@react-email/components';
import * as m from '@translations/messages';
import { Template } from '../template';

export default function ResetPasswordTemplate(props: { token: string; expiresAt: Date }) {
	const lang = languageTagServer();

	return (
		<Template>
			<Section className="w-full max-w-[60ch] text-center">
				<Heading as="h1" className="font-sans text-2xl">
					{m.reset_password_email_title()}
				</Heading>
			</Section>
			<Section className="w-full max-w-[60ch] text-center">
				<Text className="whitespace-pre-line text-left font-sans text-sm">
					{m.reset_password_email_body({
						time: (props.expiresAt ?? new Date()).toLocaleTimeString(`${lang}-CA`, {
							timeStyle: 'long',
						}),
					})}
				</Text>
				<Button
					className="mt-4 rounded-[1em] bg-violet-700 px-5 py-4 font-sans text-sm font-medium text-gray-50"
					href={`${process.env.VERCEL_PROJECT_PRODUCTION_URL}/${withLang(`/reset-password/${encodeURIComponent(props.token)}`)}`}
					hrefLang={lang}
				>
					🔑&emsp;{m.reset_password_email_button()}
				</Button>
			</Section>
			<Section className="mt-4 w-full max-w-[60ch] text-center">
				<Text className="whitespace-pre-line text-left font-sans text-sm opacity-40">
					{m.reset_password_email_outdated()}
				</Text>
				<Button
					className="mt-4 rounded-[1em] border border-solid border-gray-500/20 px-5 py-4 font-sans text-sm text-gray-600"
					href={`${process.env.VERCEL_PROJECT_PRODUCTION_URL}/${withLang('/reset-password')}`}
					hrefLang={lang}
				>
					✉️&emsp;{m.reset_password()}
				</Button>
			</Section>
		</Template>
	);
}
