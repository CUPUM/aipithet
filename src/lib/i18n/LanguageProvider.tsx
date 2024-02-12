import { AvailableLanguageTag, languageTag, setLanguageTag } from '@/lib/i18n/generated/runtime';
import { headers } from 'next/headers';
import { ClientLanguageProvider } from './ClientLanguageProvider';
import { LANG_HEADER_NAME } from './constants';

setLanguageTag(() => {
	return headers().get(LANG_HEADER_NAME) as AvailableLanguageTag;
});

export default function LanguageProvider(props: { children: React.ReactNode }) {
	return (
		<>
			<ClientLanguageProvider language={languageTag()} />
			{props.children}
		</>
	);
}
