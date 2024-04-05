'use server';

import { imagesPromptsWithTranslationsSchema } from '@lib/database/validation';
import { languageTagServer } from '@lib/i18n/utilities-server';
import { setLanguageTag } from '@translations/runtime';
import { validateFormData } from './validation';

/**
 * Post request handler for api route.
 */
// export function POST() {}

export default async function ImagesUpload(formState: unknown, formData: FormData) {
	setLanguageTag(languageTagServer);
	const parsed = validateFormData(formData, imagesPromptsWithTranslationsSchema);
}
