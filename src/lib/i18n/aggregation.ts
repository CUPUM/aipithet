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
 *
 * @deprecated
 */
export function withTranslations<
	T extends AnyTable<TableConfig> | Subquery<string, Record<string, unknown>>,
	TK extends ValueOf<InferColumns<T>>,
	TS extends Record<string, unknown>,
	TT extends
		| (AnyTable<TableConfig> & LangColumn)
		| (Subquery<string, Record<string, unknown>> & LangColumn),
	TTK extends ValueOf<InferColumns<TT>>,
	TTS extends Record<string, unknown>,
>(
	base: T,
	translations: TT,
	config:
		| {
				field: TK;
				reference: TTK;
				selection?: TS;
				translationsSelection?: TTS;
		  }
		| ((
				base: T,
				translations: TT
		  ) => {
				field: TK;
				reference: TTK;
				selection?: TS;
				translationsSelection?: TTS;
		  })
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

/**
 * Build a json object aggregating joined translations.
 *
 * ```
 * db.select({
 * 	...getColumns(base),
 * 	translations: translationsAgg(getColumns(translations)),
 * })
 * 	.from(base)
 * 	.leftJoin(...languagesJoin)
 * 	.leftJoin(...translationsJoin(translations, base.id, translations.id))
 * 	.groupBy(base.id);
 * ```
 */
export function translationsAgg<TSelection extends ColumnsSelection>(selection: TSelection) {
	return jsonObjectAgg(languages.lang, jsonBuildObject(selection));
}

/**
 * Replacing unsupported lateral cross join.
 *
 * @example
 *
 * ```
 * db.select({
 * 	...getColumns(base),
 * 	translations: translationsAgg(getColumns(translations)),
 * })
 * 	.from(base)
 * 	.leftJoin(...languagesJoin)
 * 	.leftJoin(...translationsJoin(translations, base.id, translations.id))
 * 	.groupBy(base.id);
 * ```
 */
export const languagesJoin = [languages, tru] as const;

/**
 * @example
 *
 * ```
 * db.select({
 * 	...getColumns(base),
 * 	translations: translationsAgg(getColumns(translations)),
 * })
 * 	.from(base)
 * 	.leftJoin(...languagesJoin)
 * 	.leftJoin(...translationsJoin(translations, base.id, translations.id))
 * 	.groupBy(base.id);
 * ```
 */
export function translationsJoin<
	Translations extends
		| (AnyTable<TableConfig> & LangColumn)
		| (Subquery<string, Record<string, unknown>> & LangColumn),
>(translations: Translations, field: SQLWrapper, reference: SQLWrapper) {
	return [
		translations,
		and(eq(field, reference), eq(translations[LANG_COLUMN_NAME], languages[LANG_COLUMN_NAME])),
	] as const;
}
