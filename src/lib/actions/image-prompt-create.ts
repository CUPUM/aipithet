'use server';

import { languageTagServer } from '@lib/i18n/utilities-server';
import { setLanguageTag } from '@translations/runtime';

/**
 * Create an image prompt and upload associated images.
 */
export default async function imagePromptCreate(state: unknown, formData: FormData) {
	setLanguageTag(languageTagServer);
	// const parsed = validateFormData(formData, imagesProm);
}
