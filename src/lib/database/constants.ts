import type { AnyColumn } from 'drizzle-orm';
import { lang } from './custom-types';
import { languages } from './schema/i18n';

export const LANG_COLUMN_NAME = 'lang';
export type LangColumnName = typeof LANG_COLUMN_NAME;

export const LANG_COLUMN = {
	[LANG_COLUMN_NAME]: lang('lang')
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

export const USER_ID_LENGTH = 15;
