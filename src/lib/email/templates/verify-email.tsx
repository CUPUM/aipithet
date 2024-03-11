import { withLang } from '@lib/i18n/utilities';
import { Button, Heading, Section, Text } from '@react-email/components';
import * as m from '@translations/messages';
import { languageTag } from '@translations/runtime';
import { Template } from '../template';

export default function VerifyEmailTemplate(props: { code: string; expiresAt: Date }) {
	const lang = languageTag();

	return (
		<Template>
			<Heading as="h1" className="font-sans text-base text-center">
				{m.email_verification_code_email_title()}
			</Heading>
			<Text className="font-sans text-sm text-center max-w-[60ch] mx-auto">
				{m.email_verification_code_email_body({
					time: (props.expiresAt ?? new Date()).toLocaleTimeString(`${lang}-CA`, {
						timeStyle: 'long',
					}),
				})}
			</Text>
			<Section className="text-center">
				<code className="font-mono inline-block tracking-[0.5em] indent-[0.5em] text-lg p-4 rounded-[1em] border border-solid border-slate-200 font-normal">
					{props.code ?? 'CODE NOT FOUND'}
				</code>
			</Section>
			<Section className="text-center mt-4">
				<Button
					className="text-sm font-sans font-medium text-slate-100 bg-slate-900 rounded-[1em] px-5 py-4"
					href={`${process.env.DOMAIN_NAME}/${withLang('/verify-email')}`}
					hrefLang={lang}
				>
					{m.email_verification_code_email_button()}
				</Button>
			</Section>
		</Template>
	);
}
