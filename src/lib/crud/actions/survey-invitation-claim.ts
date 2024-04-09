'use server';

import { authorize } from '@lib/auth/auth';
import { db } from '@lib/database/db';
import {
	labelingSurveysEditors,
	labelingSurveysInvitations,
	labelingSurveysParticipants,
} from '@lib/database/schema/public';
import { labelingSurveysInvitationsSchema } from '@lib/database/validation';
import { languageTagServer } from '@lib/i18n/utilities-server';
import * as m from '@translations/messages';
import { setLanguageTag } from '@translations/runtime';
import { and, eq, gte, not } from 'drizzle-orm';
import { now } from 'drizzle-orm-helpers/pg';
import { NEVER } from 'zod';
import { validateFormDataAsync } from '../validation';

export default async function surveyInvitationClaim(state: unknown, formData: FormData) {
	setLanguageTag(languageTagServer);
	const { user } = await authorize();
	const parsed = await validateFormDataAsync(
		formData,
		labelingSurveysInvitationsSchema
			.pick({ code: true })
			.strip()
			.required({ code: true })
			.superRefine(async (data, ctx) => {
				return await db.transaction(async (tx) => {
					const [invitation] = await db
						.update(labelingSurveysInvitations)
						.set({ pending: false })
						.where(
							and(
								eq(labelingSurveysInvitations.code, data.code),
								gte(labelingSurveysInvitations.expiresAt, now()),
								not(eq(labelingSurveysInvitations.pending, false))
							)
						)
						.returning();
					if (!invitation) {
						ctx.addIssue({
							code: 'custom',
							path: ['code'],
							message: m.invitation_code_invalid(),
						});
						return NEVER;
					}
					const [participant] = await tx
						.insert(invitation.editor ? labelingSurveysEditors : labelingSurveysParticipants)
						.values({
							userId: user.id,
							surveyId: invitation.surveyId,
						})
						.onConflictDoNothing({
							target: [labelingSurveysParticipants.userId, labelingSurveysParticipants.surveyId],
						})
						.returning();
					if (!participant) {
						ctx.addIssue({
							code: 'custom',
							path: ['code'],
							message: m.invitation_code_error(),
						});
						return NEVER;
					}
				});
			})
	);
	if (!parsed.success) {
		return parsed.fail;
	}
	return parsed.succeed;
}
