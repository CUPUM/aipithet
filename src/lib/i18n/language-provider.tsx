import { languageTag, setLanguageTag } from '@lib/i18n/generated/runtime';
import { Fragment } from 'react';
import { ClientLanguageProvider } from './language-provider-client';
import { languageTagServer } from './utilities-server';

setLanguageTag(languageTagServer);

export default function LanguageProvider(props: { children: React.ReactNode }) {
	setLanguageTag(languageTagServer);
	return (
		<>
			<ClientLanguageProvider language={languageTag()} />
			<Fragment key={languageTag()}>{props.children}</Fragment>
		</>
	);
}
