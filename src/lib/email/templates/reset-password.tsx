import { withLang } from '@lib/i18n/utilities';
import { Button, Heading, Section, Text } from '@react-email/components';
import * as m from '@translations/messages';
import { languageTag } from '@translations/runtime';
import { Template } from '../template';

export default function ResetPasswordTemplate(props: { token: string; expiresAt: Date }) {
	const lang = languageTag();

	return (
		<Template>
			<Section className="text-center w-full max-w-[60ch]">
				<Heading as="h1" className="font-sans text-2xl">
					{m.reset_password_email_title()}
				</Heading>
			</Section>
			<Section className="text-center w-full max-w-[60ch]">
				<Text className="font-sans text-sm text-left whitespace-pre-line">
					{m.reset_password_email_body({
						time: (props.expiresAt ?? new Date()).toLocaleTimeString(`${lang}-CA`, {
							timeStyle: 'long',
						}),
					})}
				</Text>
				<Button
					className="text-sm font-sans font-medium text-gray-50 bg-violet-700 rounded-[1em] px-5 py-4 mt-4"
					href={`${process.env.VERCEL_URL}/${withLang(`/reset-password/${encodeURIComponent(props.token)}`)}`}
					hrefLang={lang}
				>
					🔑&emsp;{m.reset_password_email_button()}
				</Button>
			</Section>
			<Section className="text-center mt-4 w-full max-w-[60ch]">
				<Text className="font-sans text-sm text-left opacity-40 whitespace-pre-line">
					{m.reset_password_email_outdated()}
				</Text>
				<Button
					className="text-sm font-sans text-gray-600 border border-solid border-gray-200 rounded-[1em] px-5 py-4 mt-4"
					href={`${process.env.VERCEL_URL}/${withLang('/reset-password')}`}
					hrefLang={lang}
				>
					✉️&emsp;{m.reset_password()}
				</Button>
			</Section>
		</Template>
	);
}
