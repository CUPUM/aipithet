import { authorize } from '@lib/auth/auth';
import { CACHE_TAGS } from '@lib/constants';
import { db } from '@lib/database/db';
import { users } from '@lib/database/schema/auth';
import {
	labelingSurveysEditors,
	labelingSurveysInvitations,
	labelingSurveysParticipants,
} from '@lib/database/schema/public';
import * as m from '@translations/messages';
import { eq } from 'drizzle-orm';
import { unstable_cache } from 'next/cache';
import { CreateEditorInvitationForm, CreateParticipantInvitationForm } from './client';

const getSurveyInvitations = unstable_cache(
	async function (surveyId: string) {
		return await db
			.select()
			.from(labelingSurveysInvitations)
			.where(eq(labelingSurveysInvitations.surveyId, surveyId));
	},
	undefined,
	{
		tags: [CACHE_TAGS.EDITOR_SURVEY_INVITATIONS],
		revalidate: 10,
	}
);

export type SurveyInvitations = Awaited<ReturnType<typeof getSurveyInvitations>>;

const getSurveyParticipants = unstable_cache(
	async function (surveyId: string) {
		return await db
			.select({
				id: labelingSurveysParticipants.userId,
				email: users.email,
			})
			.from(labelingSurveysParticipants)
			.leftJoin(users, eq(users.id, labelingSurveysParticipants.userId))
			.where(eq(labelingSurveysParticipants.surveyId, surveyId));
	},
	undefined,
	{
		tags: [CACHE_TAGS.EDITOR_SURVEY_USERS],
		revalidate: 10,
	}
);

const getSurveyEditors = unstable_cache(
	async function (surveyId: string) {
		return await db
			.select({
				id: labelingSurveysEditors.userId,
				email: users.email,
			})
			.from(labelingSurveysEditors)
			.leftJoin(users, eq(users.id, labelingSurveysEditors.userId))
			.where(eq(labelingSurveysEditors.surveyId, surveyId));
	},
	undefined,
	{
		tags: [CACHE_TAGS.EDITOR_SURVEY_USERS],
		revalidate: 10,
	}
);

export default async function Page(props: { params: { surveyId: string } }) {
	await authorize('surveys.update');
	// const invitations = await getSurveyInvitations(props.params.surveyId);
	const participants = await getSurveyParticipants(props.params.surveyId);
	const editors = await getSurveyEditors(props.params.surveyId);
	return (
		<>
			<section className="flex animate-fly-up flex-col gap-8 rounded-lg border border-border bg-background p-8 delay-300 fill-mode-both">
				<h2 className="text-xl font-semibold">{m.editors()}</h2>
				<ul>
					{editors.map((u) => (
						<li key={u.id}>{u.email}</li>
					))}
				</ul>
				<CreateParticipantInvitationForm surveyId={props.params.surveyId} />
			</section>
			<section className="flex animate-fly-up flex-col gap-8 rounded-lg border border-border bg-background p-8 delay-500 fill-mode-both">
				<h2 className="text-xl font-semibold">{m.participants()}</h2>
				<ul>
					{participants.map((u) => (
						<li key={u.id}>{u.email}</li>
					))}
				</ul>
				<CreateEditorInvitationForm surveyId={props.params.surveyId} />
			</section>
		</>
	);
}
