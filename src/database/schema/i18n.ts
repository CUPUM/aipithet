import { langSchema } from '@/i18n/validation';
import type { ColumnBaseConfig } from 'drizzle-orm';
import { PgColumn, pgSchema, text } from 'drizzle-orm/pg-core';
import { lang } from '../custom-types';

export const i18nSchema = pgSchema('i18n');

export const langs = i18nSchema.table('langs', {
	lang: lang('lang').primaryKey(),
	name: text('name').notNull().unique(),
});

export const langColumn = {
	lang: lang('lang')
		.references(() => langs.lang, {
			onDelete: 'cascade',
			onUpdate: 'cascade',
		})
		.notNull(),
};

export const langColumnSchema = {
	lang: langSchema,
} satisfies Record<keyof typeof langColumn, unknown>;

export type LangColumn = typeof langColumn;

/**
 * Common translations reference column template.
 */
export function translationReference<
	T extends ColumnBaseConfig<'string', 'PgText'>,
	N extends string,
>(name: N, reference: PgColumn<T>) {
	return text(name)
		.references(() => reference, { onDelete: 'cascade', onUpdate: 'cascade' })
		.notNull();
}
