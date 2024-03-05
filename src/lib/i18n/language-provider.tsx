import type { AvailableLanguageTag } from '@lib/i18n/generated/runtime';
import { languageTag, setLanguageTag } from '@lib/i18n/generated/runtime';
import { headers } from 'next/headers';
import { LANG_HEADER_NAME } from './constants';
import { ClientLanguageProvider } from './language-provider-client';

export default async function LanguageProvider(props: { children: React.ReactNode }) {
	setLanguageTag(() => {
		return headers().get(LANG_HEADER_NAME) as AvailableLanguageTag;
	});
	return (
		<>
			<ClientLanguageProvider language={languageTag()} />
			{props.children}
		</>
	);
}
