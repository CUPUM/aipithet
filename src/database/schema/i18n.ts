import { pgSchema, text } from 'drizzle-orm/pg-core';
import { lang } from '../custom-types';

export const i18nSchema = pgSchema('i18n');

export const langs = i18nSchema.table('langs', {
	lang: lang('lang').primaryKey(),
	name: text('name').notNull().unique(),
});
