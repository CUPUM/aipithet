import { regconfig } from 'drizzle-orm-helpers/pg';
import { pgSchema, text } from 'drizzle-orm/pg-core';
import { LANG_COLUMN_NAME } from '../constants';
import { lang } from '../custom-types';

export const i18nSchema = pgSchema('i18n');

export const languages = i18nSchema.table('languages', {
	[LANG_COLUMN_NAME]: lang('lang').primaryKey(),
	name: text('name').notNull().unique(),
	regconfig: regconfig('regconfig').notNull(),
});
