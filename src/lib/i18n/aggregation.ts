import type { AnyTable, ColumnsSelection, SQL, Subquery, TableConfig } from 'drizzle-orm';
import { and, eq } from 'drizzle-orm';
import { tru } from 'drizzle-orm-helpers';
import { jsonBuildObject, jsonObjectAgg } from 'drizzle-orm-helpers/pg';
import type { PgSelect } from 'drizzle-orm/pg-core';
import { LANG_COLUMN_NAME } from '../database/constants';
import type { LangColumn } from '../database/schema/i18n';
import { languages } from '../database/schema/i18n';

/**
 * Join translations through the languages table.
 *
 * @example
 *
 * ```ts
 * const aggregated = await joinTranslations(
 * 	db
 * 		.select({
 * 			...getColumns(baseTable),
 * 			translations: aggTranslations(getColumns(translationsTable)),
 * 		})
 * 		.from(baseTable)
 * 		.$dynamic(),
 * 	translationsTable,
 * 	eq(baseTable.id, translationsTable.id)
 * ).groupBy(baseTable.id);
 * ```
 */
export function joinTranslations<
	TSelect extends PgSelect,
	TTranslations extends
		| (AnyTable<TableConfig> & LangColumn)
		| (Subquery<string, Record<string, unknown>> & LangColumn),
>(select: TSelect, translations: TTranslations, on: SQL) {
	return select
		.leftJoin(languages, tru)
		.leftJoin(
			translations,
			and(on, eq(languages[LANG_COLUMN_NAME], translations[LANG_COLUMN_NAME]))
		);
}

/**
 * Build a json object aggregating joined translations.
 */
export function aggTranslations<TSelection extends ColumnsSelection>(selection: TSelection) {
	return jsonObjectAgg(languages.lang, jsonBuildObject(selection));
}
