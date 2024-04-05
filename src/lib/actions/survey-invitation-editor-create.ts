'use server';

import surveyInvitationParticipantCreate from './survey-invitation-participant-create';

export default async function surveyInvitationEditorCreate(state: unknown, formData: FormData) {
	formData.set('&editor', 'true');
	return surveyInvitationParticipantCreate(state, formData);
}
