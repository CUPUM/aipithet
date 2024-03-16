import { languageTagServer } from '@lib/i18n/utilities-server';
import { setLanguageTag } from '@translations/runtime';
import { Resend } from 'resend';

setLanguageTag(languageTagServer);

export const resend = new Resend(process.env.RESEND_API_KEY);
