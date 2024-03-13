import { withLang } from '@lib/i18n/utilities';
import { Button, Heading, Section, Text } from '@react-email/components';
import * as m from '@translations/messages';
import { languageTag } from '@translations/runtime';
import { Template } from '../template';

export default function VerifyEmailTemplate(props: { code: string; expiresAt: Date }) {
	const lang = languageTag();

	return (
		<Template>
			<Section className="text-center w-full max-w-[60ch]">
				<Heading as="h1" className="font-sans text-2xl">
					{m.email_verification_code_email_title()}
				</Heading>
			</Section>
			<Section className="text-center w-full max-w-[60ch]">
				<Text className="font-sans text-sm text-left whitespace-pre-line">
					{m.email_verification_code_email_body({
						time: (props.expiresAt ?? new Date()).toLocaleTimeString(`${lang}-CA`, {
							timeStyle: 'long',
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
					🔐&emsp;{m.email_verification_code_email_button()}
				</Button>
			</Section>
		</Template>
	);
}
