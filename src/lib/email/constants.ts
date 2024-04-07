import * as m from '@translations/messages';

export const SENDERS = {
	DEFAULT: `Aipithet <${process.env.RESEND_DOMAIN}>`,
	AUTH: `Aipithet - ${m.account()} <${process.env.RESEND_DOMAIN}>`,
	SURVEY: `Aipithet - ${m.survey()} <${process.env.RESEND_DOMAIN}>`,
} as const;
