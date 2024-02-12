'use client';
import { AvailableLanguageTag, setLanguageTag } from '@/lib/i18n/generated/runtime';

export function ClientLanguageProvider(props: { language: AvailableLanguageTag }) {
	setLanguageTag(props.language);
	return null;
}
