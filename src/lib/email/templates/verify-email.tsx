import { withLang } from '@lib/i18n/utilities';
import { languageTagServer } from '@lib/i18n/utilities-server';
import { Button, Heading, Section, Text } from '@react-email/components';
import * as m from '@translations/messages';
import { Template } from '../template';

export default function VerifyEmailTemplate(props: { code: string; expiresAt: Date }) {
	const lang = languageTagServer();

	return (
		<Template>
			<Section className="w-full max-w-[60ch] text-center">
				<Heading as="h1" className="font-sans text-2xl">
					{m.email_verification_code_email_title()}
				</Heading>
			</Section>
			<Section className="w-full max-w-[60ch] text-center">
				<Text className="whitespace-pre-line text-left font-sans text-sm">
					{m.email_verification_code_email_body({
						time: (props.expiresAt ?? new Date()).toLocaleTimeString(`${lang}-CA`, {
							timeStyle: 'long',
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
					🔐&emsp;{m.email_verification_code_email_button()}
				</Button>
			</Section>
		</Template>
	);
}
