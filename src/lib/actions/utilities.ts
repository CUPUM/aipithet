import { parseFormData } from 'parse-nested-form-data';
import type { SafeParseError, UnknownKeysParam, ZodObject, ZodRawShape, ZodTypeAny } from 'zod';

function formatParsedError<T>(parsed: SafeParseError<T>) {
	return {
		...parsed,
		fail: {
			errors: parsed.error.format(),
		},
	};
}

/**
 * A small helper to streamline form data validation and error response formatting. It also uses
 * [parse-nested-form-data](https://github.com/milamer/parse-nested-form-data) to enable mapping of
 * FormData entries to complex shapes based on a custom field naming syntax.
 *
 * @see https://github.com/milamer/parse-nested-form-data
 *
 * @see processFormData
 */
export function validateFormData<
	T extends ZodRawShape = ZodRawShape,
	UnknownKeys extends UnknownKeysParam = UnknownKeysParam,
	Catchall extends ZodTypeAny = ZodTypeAny,
>(formData: FormData, schema: ZodObject<T, UnknownKeys, Catchall>) {
	const parsed = schema.safeParse(parseFormData(formData));
	if (!parsed.success) {
		return formatParsedError(parsed);
	}
	return parsed;
}

/**
 * Async equivalent of **{@link validateFormData}**.
 *
 * A small helper to streamline form data validation and error response formatting. It also uses
 * [parse-nested-form-data](https://github.com/milamer/parse-nested-form-data) to enable mapping of
 * FormData entries to complex shapes based on a custom field naming syntax.
 *
 * Async parsing allows for running database queries through your schema `transform`'s or
 * `superRefine`'s methods where you can use `ctx.addIssue` to specify additionnal field-level or
 * form-level errors.
 *
 * @see processFormData
 */
export async function validateFormDataAsync<
	T extends ZodRawShape = ZodRawShape,
	UnknownKeys extends UnknownKeysParam = UnknownKeysParam,
	Catchall extends ZodTypeAny = ZodTypeAny,
>(formData: FormData, schema: ZodObject<T, UnknownKeys, Catchall>) {
	const parsed = await schema.safeParseAsync(parseFormData(formData));
	if (!parsed.success) {
		return formatParsedError(parsed);
	}
	return parsed;
}
