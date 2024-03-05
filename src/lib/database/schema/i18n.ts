import type { AnyColumn } from 'drizzle-orm';
import { regconfig } from 'drizzle-orm-helpers/pg';
import { pgSchema, text } from 'drizzle-orm/pg-core';
import { LANG_COLUMN_NAME } from '../constants';
import { lang } from '../custom-types';

export const i18nSchema = pgSchema('i18n');

export const languages = i18nSchema.table('languages', {
	[LANG_COLUMN_NAME]: lang(LANG_COLUMN_NAME).primaryKey(),
	name: text('name').notNull().unique(),
	regconfig: regconfig('regconfig').notNull(),
});

export const LANG_COLUMN = {
	[LANG_COLUMN_NAME]: lang(LANG_COLUMN_NAME)
		.references(() => languages[LANG_COLUMN_NAME], {
			onDelete: 'cascade',
			onUpdate: 'cascade',
		})
		.notNull(),
};
export type LangColumn = {
	[K in keyof typeof LANG_COLUMN]: AnyColumn<
		Pick<(typeof LANG_COLUMN)[K]['_'], 'data' | 'dataType'>
	>;
};
