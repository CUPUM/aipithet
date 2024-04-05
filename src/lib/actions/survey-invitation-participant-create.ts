'use server';

import { authorize } from '@lib/auth/auth';
import { CACHE_TAGS } from '@lib/constants';
import { db } from '@lib/database/db';
import {
	labelingSurveysInvitations,
	labelingSurveysTranslations,
} from '@lib/database/schema/public';
import { labelingSurveysInvitationsSchema } from '@lib/database/validation';
import { SENDERS } from '@lib/email/constants';
import { transporter } from '@lib/email/email';
import SurveyInvitationTemplate from '@lib/email/templates/survey-invitation';
import { languageTagServer } from '@lib/i18n/utilities-server';
import { langSchema } from '@lib/i18n/validation';
import { render } from '@react-email/render';
import * as m from '@translations/messages';
import { setLanguageTag } from '@translations/runtime';
import { and, eq } from 'drizzle-orm';
import { revalidateTag } from 'next/cache';
import { validateFormData } from './validation';

export default async function surveyInvitationParticipantCreate(
	state: unknown,
	formData: FormData
) {
	setLanguageTag(languageTagServer);
	const { user } = await authorize('surveys.invitations.create');
	const parsed = validateFormData(
		formData,
		labelingSurveysInvitationsSchema.extend({ preferredLang: langSchema })
	);
	if (!parsed.success) {
		return parsed.fail;
	}
	const [inserted] = await db.insert(labelingSurveysInvitations).values(parsed.data).returning();
	if (!inserted) {
		throw new Error('Insert may have failed. No invitation code was returned.');
	}
	const [surveyText] = await db
		.select({ title: labelingSurveysTranslations.title })
		.from(labelingSurveysTranslations)
		.where(
			and(
				eq(labelingSurveysTranslations.id, inserted.surveyId),
				eq(labelingSurveysTranslations.lang, parsed.data.preferredLang)
			)
		)
		.limit(1);
	await transporter.sendMail({
		from: SENDERS.DEFAULT,
		to: [user.email],
		subject: 'Verify your email',
		html: render(
			SurveyInvitationTemplate({
				...inserted,
				lang: parsed.data.preferredLang,
				surveyTitle: surveyText?.title ?? m.untitled(),
			})
		),
	});
	revalidateTag(CACHE_TAGS.EDITOR_SURVEY_INVITATIONS);
}
