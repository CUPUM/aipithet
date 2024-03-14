'use server';

import { authorize } from '@lib/auth/auth';
import { labelingSurveysInvitationsSchema } from '@lib/database/validation';
import { validateFormData } from './utilities';

export default async function surveyInvitationClaim(state: unknown, formData: FormData) {
	const { user } = await authorize();
	const parsed = validateFormData(
		formData,
		labelingSurveysInvitationsSchema.pick({ code: true }).strict()
	);
	if (!parsed.success) {
		return parsed.fail;
	}
	const surveyId = await z.preprocess(preprocessFormData, schema);
}
