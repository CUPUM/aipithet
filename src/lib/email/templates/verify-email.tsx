import { withLang } from '@lib/i18n/utilities';
import { Button, Container, Heading, Html, Text } from '@react-email/components';
import * as m from '@translations/messages';
import { languageTag } from '@translations/runtime';
import { Styles } from '../styles';

export default function VerifyEmailTemplate(props: { code: string }) {
	const lang = languageTag();
	return (
		<Styles>
			<Html lang={lang}>
				<Container>
					<Heading as="h1">{m.email_verification_code_title()}</Heading>
					<Text>{m.email_verification_code_body()}:</Text>
					<Text className="font-mono p-2 rounded-md bg-slate-200 font-semibold">{props.code}</Text>
					<Button href={withLang('/verify-email')} hrefLang={lang}>
						{m.email_verification_code_button()}
					</Button>
				</Container>
			</Html>
		</Styles>
	);
}
