'use server';

import { languageTagServer } from '@lib/i18n/utilities-server';
import { setLanguageTag } from '@translations/runtime';

export default async function surveyInvite(state: unknown, formData: FormData) {
	setLanguageTag(languageTagServer);
}
