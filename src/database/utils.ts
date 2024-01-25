import { langSchema } from '@/i18n/validation';
import { AnyColumn, Column, ColumnBuilderBase, SQL, sql } from 'drizzle-orm';
import { lang } from './custom-types';
import { langs } from './schema/i18n';

export type InferColumnDataType<T extends Column> = T['_']['notNull'] extends true
	? T['_']['data']
	: T['_']['data'] | null;

export type InferSQLDataType<T extends SQL | SQL.Aliased> =
	T extends SQL<infer U> ? U : T extends SQL.Aliased<infer U> ? U : never;

export type InferColumnType<T extends (...config: never[]) => ColumnBuilderBase> = AnyColumn<
	Pick<ReturnType<T>['_'], 'data' | 'dataType'>
>;

export function generateNanoid({
	optimized = false,
	length = 8,
	alphabet,
}: {
	optimized?: boolean;
	length?: number;
	/**
	 * PG extension defaults set to '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'
	 */
	alphabet?: string;
} = {}) {
	const opts: (string | number)[] = [length];
	if (alphabet) {
		opts.push(alphabet);
	}
	return sql.raw(`"extensions"."nanoid${optimized ? '_optimized' : ''}"(${opts.join(',')})`);
	// return sql`extensions.nanoid${optimized ? '_optimized' : ''}(${opts.join(',')})`;
}

export const langColumn = {
	lang: lang('lang')
		.references(() => langs.lang, {
			onDelete: 'cascade',
			onUpdate: 'cascade',
		})
		.notNull(),
};

export type LangColumn = typeof langColumn;

export const langColumnSchema = {
	lang: langSchema,
} satisfies Record<keyof typeof langColumn, unknown>;
