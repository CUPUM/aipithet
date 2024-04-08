'use server';

import { authorize } from '@lib/auth/auth';
import { CACHE_TAGS } from '@lib/constants';
import { db } from '@lib/database/db';
import { users } from '@lib/database/schema/auth';
import {
	labelingSurveysEditors,
	labelingSurveysInvitations,
	labelingSurveysParticipants,
	labelingSurveysTranslations,
} from '@lib/database/schema/public';
import { labelingSurveysInvitationsSchema } from '@lib/database/validation';
import { SENDERS } from '@lib/email/constants';
import { transporter } from '@lib/email/email';
import SurveyInvitationTemplate from '@lib/email/templates/survey-invitation';
import SurveyJoinedTemplate from '@lib/email/templates/survey-joined';
import { languageTagServer } from '@lib/i18n/utilities-server';
import { langSchema } from '@lib/i18n/validation';
import { render } from '@react-email/render';
import * as m from '@translations/messages';
import { setLanguageTag } from '@translations/runtime';
import { and, eq } from 'drizzle-orm';
import { revalidateTag } from 'next/cache';
import { validateFormData } from './validation';

export default async function surveyInvite(state: unknown, formData: FormData) {
	setLanguageTag(languageTagServer);
	const { user } = await authorize('surveys.invitations.create');
	const parsed = validateFormData(
		formData,
		labelingSurveysInvitationsSchema.extend({ preferredLang: langSchema })
	);
	if (!parsed.success) {
		return parsed.fail;
	}
	const surveysUsers = parsed.data.editor ? labelingSurveysEditors : labelingSurveysParticipants;
	const [surveyText] = await db
		.select({ title: labelingSurveysTranslations.title })
		.from(labelingSurveysTranslations)
		.where(
			and(
				eq(labelingSurveysTranslations.id, parsed.data.surveyId),
				eq(labelingSurveysTranslations.lang, parsed.data.preferredLang)
			)
		)
		.limit(1);
	const [existingUser] = await db
		.select({ id: users.id })
		.from(users)
		.where(eq(users.email, parsed.data.email))
		.limit(1);
	if (existingUser) {
		const [added] = await db
			.insert(surveysUsers)
			.values({ userId: existingUser.id, surveyId: parsed.data.surveyId })
			.onConflictDoNothing({ target: [surveysUsers.surveyId, surveysUsers.userId] })
			.returning();
		if (added) {
			await transporter.sendMail({
				from: SENDERS.SURVEY,
				to: parsed.data.email,
				subject: parsed.data.editor
					? m.survey_joined_editor_email_title()
					: m.survey_joined_pariticpant_email_title(),
				html: render(
					SurveyJoinedTemplate({
						editor: parsed.data.editor,
						lang: parsed.data.preferredLang,
						surveyTitle: surveyText?.title ?? m.untitled(),
					})
				),
			});
			revalidateTag(CACHE_TAGS.SURVEY_USERS);
		}
		return;
	}
	const [invited] = await db.insert(labelingSurveysInvitations).values(parsed.data).returning();
	if (!invited) {
		throw new Error('Invitation may have failed. No invitation code was returned.');
	}
	revalidateTag(CACHE_TAGS.SURVEY_INVITATIONS);
	await transporter.sendMail({
		from: SENDERS.SURVEY,
		to: [user.email],
		subject: m.survey_invitation_email_title(),
		html: render(
			SurveyInvitationTemplate({
				...invited,
				lang: parsed.data.preferredLang,
				surveyTitle: surveyText?.title ?? m.untitled(),
			})
		),
	});
}
