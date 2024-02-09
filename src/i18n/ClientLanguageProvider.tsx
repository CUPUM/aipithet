'use client';
import { AvailableLanguageTag, setLanguageTag } from '@translations/runtime';

export function ClientLanguageProvider(props: { language: AvailableLanguageTag }) {
	setLanguageTag(props.language);
	return null;
}
