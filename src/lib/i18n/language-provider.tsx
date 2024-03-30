import { languageTag, setLanguageTag } from '@lib/i18n/generated/runtime';
import { Fragment } from 'react';
import { ClientLanguageProvider } from './language-provider-client';
import { languageTagServer } from './utilities-server';

setLanguageTag(languageTagServer);

export default function LanguageProvider(props: { children: React.ReactNode }) {
	setLanguageTag(languageTagServer);
	const lang = languageTag();
	return (
		<>
			<ClientLanguageProvider language={lang} />
			<Fragment key={lang}>{props.children}</Fragment>
		</>
	);
}
