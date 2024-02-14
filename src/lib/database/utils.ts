import { langSchema } from '@lib/i18n/validation';
import { createGenerateNanoid, createGetRegconfig, regconfig } from 'drizzle-orm-helpers';
import { LANG_COLUMN_NAME, LangColumnName, NANOID_DEFAULT_LENGTH, REGCONFIGS } from './constants';
import { extensionsSchema } from './schema/extensions';

export const generateNanoid = createGenerateNanoid({
	schemaName: extensionsSchema.schemaName,
	defaultLength: NANOID_DEFAULT_LENGTH,
});

export const getRegconfig = createGetRegconfig(REGCONFIGS);

export const langColumn = {
	[LANG_COLUMN_NAME]: regconfig('lang'),
};

export type LangColumn = Pick<typeof langColumn, LangColumnName>;

export const langColumnSchema = {
	[LANG_COLUMN_NAME]: langSchema,
};

export function withTranslationsSchema() {}

export function withTranslations() {}
