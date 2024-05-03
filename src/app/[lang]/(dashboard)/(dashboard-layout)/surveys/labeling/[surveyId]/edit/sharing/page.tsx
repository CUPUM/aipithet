import { authorize } from '@lib/auth/auth';
import { CACHE_TAGS } from '@lib/constants';
import { db } from '@lib/database/db';
import { users } from '@lib/database/schema/auth';
import {
	labelingSurveysEditors,
	labelingSurveysInvitations,
	labelingSurveysParticipants,
} from '@lib/database/schema/public';
import { canEditLabelingSurvey, canParticipateLabelingSurvey } from '@lib/queries/queries';
import * as m from '@translations/messages';
import { and, desc, eq, sql } from 'drizzle-orm';
import { union } from 'drizzle-orm/pg-core';
import { unstable_cache } from 'next/cache';
import { CreateEditorInvitationForm, CreateParticipantInvitationForm, SurveyUser } from './client';

const getSurveyParticipants = unstable_cache(
	async function (surveyId: string) {
		return await union(
			db
				.select({
					id: users.id,
					email: users.email,
					pending: sql<boolean>`false`,
					createdAt: labelingSurveysParticipants.createdAt,
				})
				.from(users)
				.leftJoin(labelingSurveysParticipants, eq(labelingSurveysParticipants.userId, users.id))
				.where(canParticipateLabelingSurvey({ userId: users.id, surveyId }))
				.groupBy(users.id, labelingSurveysParticipants.createdAt)
				.orderBy(desc(labelingSurveysParticipants.createdAt)),
			db
				.select({
					id: sql<''>`''`,
					email: labelingSurveysInvitations.email,
					pending: sql<boolean>`true`,
					createdAt: labelingSurveysInvitations.createdAt,
				})
				.from(labelingSurveysInvitations)
				.where(
					and(
						eq(labelingSurveysInvitations.surveyId, surveyId),
						eq(labelingSurveysInvitations.editor, false)
					)
				)
				.orderBy(desc(labelingSurveysInvitations.createdAt))
		);
	},
	undefined,
	{
		tags: [CACHE_TAGS.SURVEY_USERS, CACHE_TAGS.SURVEY_INVITATIONS],
		revalidate: 10,
	}
);

const getSurveyEditors = unstable_cache(
	async function (surveyId: string) {
		return await union(
			db
				.select({
					id: users.id,
					email: users.email,
					pending: sql<boolean>`false`,
					createdAt: labelingSurveysEditors.createdAt,
				})
				.from(users)
				.leftJoin(labelingSurveysEditors, eq(labelingSurveysEditors.userId, users.id))
				.where(canEditLabelingSurvey({ userId: users.id, surveyId }))
				.groupBy(users.id, labelingSurveysEditors.createdAt)
				.orderBy(desc(labelingSurveysEditors.createdAt)),
			db
				.select({
					id: sql<''>`''`,
					email: labelingSurveysInvitations.email,
					pending: sql<boolean>`true`,
					createdAt: labelingSurveysInvitations.createdAt,
				})
				.from(labelingSurveysInvitations)
				.where(
					and(
						eq(labelingSurveysInvitations.surveyId, surveyId),
						eq(labelingSurveysInvitations.editor, true)
					)
				)
				.orderBy(desc(labelingSurveysInvitations.createdAt))
		);
	},
	undefined,
	{
		tags: [CACHE_TAGS.SURVEY_USERS, CACHE_TAGS.SURVEY_INVITATIONS],
		revalidate: 10,
	}
);

export default async function Page(props: { params: { surveyId: string } }) {
	await authorize('surveys.update');
	const participants = await getSurveyParticipants(props.params.surveyId);
	const editors = await getSurveyEditors(props.params.surveyId);
	return (
		<>
			<section className="flex animate-fly-up flex-col gap-8 rounded-lg border border-border bg-background p-8 delay-300 fill-mode-both">
				<h2 className="text-xl font-semibold">{m.editors()}</h2>
				<ul className="flex flex-col gap-3">
					{editors.map((u) => (
						<SurveyUser {...u} key={u.id} surveyId={props.params.surveyId} />
					))}
				</ul>
				<CreateEditorInvitationForm surveyId={props.params.surveyId} />
			</section>
			<section className="flex animate-fly-up flex-col gap-8 rounded-lg border border-border bg-background p-8 delay-500 fill-mode-both">
				<h2 className="text-xl font-semibold">{m.participants()}</h2>
				<ul className="flex flex-col gap-3">
					{participants.map((u) => (
						<SurveyUser {...u} key={u.id} surveyId={props.params.surveyId} />
					))}
				</ul>
				<CreateParticipantInvitationForm surveyId={props.params.surveyId} />
			</section>
		</>
	);
}
