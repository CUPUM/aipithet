import { withLang } from '@lib/i18n/utilities';
import { Button, Heading, Section, Text } from '@react-email/components';
import * as m from '@translations/messages';
import { languageTag } from '@translations/runtime';
import { Template } from '../template';

export default function ResetPasswordTemplate(props: { token: string; expiresAt: Date }) {
	const lang = languageTag();

	return (
		<Template>
			<Heading as="h1" className="font-sans text-base text-center">
				{m.reset_password_email_title()}
			</Heading>
			<Section className="text-center">
				<Text className="font-sans text-sm max-w-[60ch] mx-auto whitespace-pre-line">
					{m.reset_password_email_body({
						time: (props.expiresAt ?? new Date()).toLocaleTimeString(`${lang}-CA`, {
							timeStyle: 'long',
						}),
					})}
				</Text>
				<Button
					className="text-sm font-sans font-medium text-slate-100 bg-violet-700 rounded-[1em] px-5 py-4"
					href={`${process.env.VERCEL_URL}/${withLang(`/reset-password/${encodeURIComponent(props.token)}`)}`}
					hrefLang={lang}
				>
					{m.reset_password_email_button()}
				</Button>
			</Section>
			<Section className="text-center mt-4">
				<Text className="font-sans text-sm max-w-[60ch] mx-auto opacity-40 whitespace-pre-line">
					{m.reset_password_email_outdated()}
				</Text>
				<Button
					className="text-sm font-sans font-medium text-slate-600 border border-solid border-slate-300 rounded-[1em] px-5 py-4"
					href={`${process.env.VERCEL_URL}/${withLang('/reset-password')}`}
					hrefLang={lang}
				>
					{m.reset_password()}
				</Button>
			</Section>
		</Template>
	);
}
