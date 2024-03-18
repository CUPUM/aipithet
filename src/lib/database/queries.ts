import type { AnyTable, ColumnsSelection } from 'drizzle-orm';
import { and, eq, exists, or } from 'drizzle-orm';
import type { InferColumns, SubqueryWithSelection } from 'drizzle-orm-helpers';
import { getColumns, getNameOrAlias, tru } from 'drizzle-orm-helpers';
import { jsonBuildObject, jsonObjectAgg } from 'drizzle-orm-helpers/pg';
import type { TableConfig, WithSubqueryWithSelection } from 'drizzle-orm/pg-core';
import type { Entries, ValueOf } from 'type-fest';
import { LANG_COLUMN_NAME } from './constants';
import { db } from './db';
import type { LangColumn } from './schema/i18n';
import { languages } from './schema/i18n';
import { labelingSurveys, labelingSurveysEditors } from './schema/public';

// /**
//  * Query helper to get rows with translations corresponding to request event's locale.
//  */
// export function withTranslation<
// 	T extends AnyTable<TableConfig> | SubqueryWithSelection<ColumnsSelection, string>,
// 	TT extends
// 		| (AnyTable<TableConfig> & LangColumn)
// 		| SubqueryWithSelection<ColumnsSelection & LangColumn, string>,
// 	F extends ValueOf<InferColumns<T>>,
// 	R extends ValueOf<InferColumns<TT>>,
// >(
// 	event: ServerLoadEvent | RequestEvent,
// 	base: T,
// 	translations: TT,
// 	config: { field: F; reference: R } | ((base: T, translations: TT) => { field: F; reference: R })
// ) {
// 	// Attaching a load dependency to re-run when locale changes.
// 	if ('depends' in event) {
// 		event.depends(LOAD_DEPENDENCIES.Lang);
// 	}
// 	const { field, reference } = config instanceof Function ? config(base, translations) : config;
// 	const baseColumns = getColumns(base);
// 	const translationColumns = getColumns(translations);
// 	return db
// 		.select({ ...translationColumns, ...baseColumns })
// 		.from(base)
// 		.$dynamic()
// 		.leftJoin(
// 			translations,
// 			and(eq(translations[LANG_COLUMN_NAME], event.locals.lang), eq(field, reference))
// 		);
// }

/**
 * Aggregate an entity's translations into a `translations` record field. Also automatically
 * coalesces missing translation rows to records with pre-populated locale and foreign key columns.
 */
export function withTranslations<
	T extends
		| AnyTable<TableConfig>
		| SubqueryWithSelection<ColumnsSelection, string>
		| WithSubqueryWithSelection<ColumnsSelection, string>,
	TT extends
		| (AnyTable<TableConfig> & LangColumn)
		| SubqueryWithSelection<ColumnsSelection & LangColumn, string>
		| WithSubqueryWithSelection<ColumnsSelection & LangColumn, string>,
	F extends ValueOf<InferColumns<T>>,
	R extends ValueOf<InferColumns<TT>>,
>(
	base: T,
	translations: TT,
	config: { field: F; reference: R } | ((base: T, translations: TT) => { field: F; reference: R })
) {
	const { field, reference } = config instanceof Function ? config(base, translations) : config;
	const baseColumns = getColumns(base);
	const translationsColumns = getColumns(translations);
	const translationsName = getNameOrAlias(translations);
	const translationColumnsEntries = Object.entries(translationsColumns) as Entries<
		typeof translationsColumns
	>;
	const translationsKey = translationColumnsEntries.find(([_k, v]) => v === reference)![0];
	return db
		.select({
			...baseColumns,
			translations: jsonObjectAgg(
				languages.lang,
				jsonBuildObject({
					...translationsColumns,
					lang: languages.lang,
					[translationsKey]: field,
				})
			).as(`${translationsName}_alias`),
		})
		.from(base)
		.leftJoin(languages, tru)
		.leftJoin(
			translations,
			and(eq(field, reference), eq(languages.lang, translations[LANG_COLUMN_NAME]))
		)
		.groupBy(field)
		.$dynamic();
}

export function editableLabelingSurveys(userId: string) {
	return db.$with('editable_labeling_surveys').as(
		db
			.select()
			.from(labelingSurveys)
			.where(
				or(
					eq(labelingSurveys.createdById, userId),
					exists(
						db
							.select()
							.from(labelingSurveysEditors)
							.where(eq(labelingSurveysEditors.userId, userId))
					)
				)
			)
	);
}
