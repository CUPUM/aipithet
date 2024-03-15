'use server';

import { LANG_HEADER_NAME } from '@lib/i18n/constants';
import { languageTag } from '@translations/runtime';
import { headers } from 'next/headers';

export default async function surveyInvitationClaim(state: unknown, formData: FormData) {
	console.log(headers().get(LANG_HEADER_NAME));
	console.log(headers().get('Accept-Language'));
	console.log(languageTag());
	// const { user } = await authorize();
	// const parsed = validateFormData(
	// 	formData,
	// 	labelingSurveysInvitationsSchema.pick({ code: true }).strict()
	// );
	// if (!parsed.success) {
	// 	return parsed.fail;
	// }
	// const surveyId = await z.preprocess(preprocessFormData, schema);
}
