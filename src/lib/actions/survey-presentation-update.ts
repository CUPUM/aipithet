'use server';

import { authorize } from '@lib/auth/auth';
import { labelingSurveysWithTranslationsSchema } from '@lib/database/validation';
import { validateFormData } from './utilities';

// export default function surveyPresentationUpdate(surveyId: string) {
// 	return async function(surveyId: string, formData: FormData) {
// 		const {user} = await authorize();
// 		const parsed = validateFormData(formData, labelingSurveysWithTranslationsSchema.pick({translations: true}))
// 	}
// }

export default async function surveyPresentationUpdate(state: unknown, formData: FormData) {
	const { user } = await authorize();
	const parsed = validateFormData(
		formData,
		labelingSurveysWithTranslationsSchema.shape.translations
	);
	if (!parsed.success) {
		return parsed.fail;
	}
	return parsed.succeed;
}
