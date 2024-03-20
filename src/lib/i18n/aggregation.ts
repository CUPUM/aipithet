import type { AnyTable, ColumnsSelection, SQLWrapper, Subquery, TableConfig } from 'drizzle-orm';
import { and, eq } from 'drizzle-orm';
import type { InferColumns } from 'drizzle-orm-helpers';
import { getColumns, getNameOrAlias, tru } from 'drizzle-orm-helpers';
import { jsonBuildObject, jsonObjectAgg } from 'drizzle-orm-helpers/pg';
import type { ValueOf } from 'type-fest';
import { LANG_COLUMN_NAME } from '../database/constants';
import { db } from '../database/db';
import type { LangColumn } from '../database/schema/i18n';
import { languages } from '../database/schema/i18n';

/**
 * Aggregate an entity's translations into a `translations` record field. Also automatically
 * coalesces missing translation rows to records with pre-populated locale and foreign key columns.
 */
export function withTranslations<
	T extends AnyTable<TableConfig>,
	TT extends
		| (AnyTable<TableConfig> & LangColumn)
		| (Subquery<string, ColumnsSelection> & LangColumn),
	F extends ValueOf<InferColumns<T>> & SQLWrapper,
	R extends ValueOf<InferColumns<TT>> & SQLWrapper,
>(
	base: T,
	translations: TT,
	config: { field: F; reference: R } | ((base: T, translations: TT) => { field: F; reference: R })
) {
	const { field, reference } = config instanceof Function ? config(base, translations) : config;
	const baseColumns = getColumns(base);
	const translationsColumns = getColumns(translations);
	const translationsName = getNameOrAlias(translations);
	const translationsKey = Object.keys(translationsColumns).find(
		(k) => reference === (translations as never)[k]
	)!;
	const translationsSelection: InferColumns<TT> = {
		...translationsColumns,
		[translationsKey]: field,
		[LANG_COLUMN_NAME]: languages[LANG_COLUMN_NAME],
	};
	return db
		.select({
			...baseColumns,
			translations: jsonObjectAgg(languages.lang, jsonBuildObject(translationsSelection)).as(
				`${translationsName}_agg`
			),
		})
		.from(base)
		.leftJoin(languages, tru)
		.leftJoin(
			translations,
			and(eq(field, reference), eq(languages[LANG_COLUMN_NAME], translations[LANG_COLUMN_NAME]))
		)
		.groupBy(field);
}
