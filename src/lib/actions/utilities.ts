import { parseFormData } from 'parse-nested-form-data';
import type {
	AnyZodObject,
	SafeParseError,
	SafeParseSuccess,
	UnknownKeysParam,
	ZodDefault,
	ZodEffects,
	ZodObject,
	ZodRawShape,
	ZodType,
	ZodTypeAny,
	ZodTypeDef,
	ZodUnion,
} from 'zod';

function formatParseError<T>(parsed: SafeParseError<T>) {
	return {
		...parsed,
		fail: {
			success: false as const,
			errors: parsed.error.format(),
		},
	};
}

function formatParseSuccess<T>(parsed: SafeParseSuccess<T>) {
	return {
		...parsed,
		succeed: {
			success: true as const,
			errors: undefined,
		},
	};
}

type ZodObjectUnion<T extends AnyZodObject> = ZodUnion<
	[ZodValidation<T>, ZodValidation<T>, ...ZodValidation<T>[]]
>;

type ZodObjectType = ZodType<Record<string, unknown>, ZodTypeDef, Record<string, unknown>>;

type ZodObjectTypes = AnyZodObject | ZodObjectUnion<AnyZodObject> | ZodObjectType;

/**
 * Credits to ciscoheat's type strategy, as taken from sveltekit-superforms. Generic schema inside
 * of ZodEffects or ZodDefault recursion must be handled manually, due to typescript limitations.
 * This enables passing schemas with stacked refinements / transformations.
 *
 * @see https://github.com/ciscoheat/sveltekit-superforms/blob/bd80e5d57abfe78c195794f39ad235b3d2bfdd4e/src/lib/adapters/zod.ts#L42.
 */
type ZodValidation<T extends ZodObjectTypes> =
	| T
	| ZodEffects<T>
	| ZodEffects<ZodEffects<T>>
	| ZodEffects<ZodEffects<ZodEffects<T>>>
	| ZodEffects<ZodEffects<ZodEffects<ZodEffects<T>>>>
	| ZodEffects<ZodEffects<ZodEffects<ZodEffects<ZodEffects<T>>>>>
	| ZodEffects<ZodEffects<ZodEffects<ZodEffects<ZodEffects<ZodEffects<T>>>>>>
	| ZodEffects<ZodEffects<ZodEffects<ZodEffects<ZodEffects<ZodEffects<ZodEffects<T>>>>>>>
	| ZodDefault<T>
	| ZodDefault<ZodEffects<T>>
	| ZodDefault<ZodEffects<ZodEffects<T>>>
	| ZodDefault<ZodEffects<ZodEffects<ZodEffects<T>>>>
	| ZodDefault<ZodEffects<ZodEffects<ZodEffects<ZodEffects<T>>>>>
	| ZodDefault<ZodEffects<ZodEffects<ZodEffects<ZodEffects<ZodEffects<T>>>>>>
	| ZodDefault<ZodEffects<ZodEffects<ZodEffects<ZodEffects<ZodEffects<ZodEffects<T>>>>>>>
	| ZodDefault<
			ZodEffects<ZodEffects<ZodEffects<ZodEffects<ZodEffects<ZodEffects<ZodEffects<T>>>>>>>
	  >;

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
>(formData: FormData, schema: ZodValidation<ZodObject<T, UnknownKeys, Catchall>>) {
	const parsed = schema.safeParse(parseFormData(formData));
	if (!parsed.success) {
		return formatParseError(parsed);
	}
	return formatParseSuccess(parsed);
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
>(formData: FormData, schema: ZodValidation<ZodObject<T, UnknownKeys, Catchall>>) {
	const parsed = await schema.safeParseAsync(parseFormData(formData));
	if (!parsed.success) {
		return formatParseError(parsed);
	}
	return formatParseSuccess(parsed);
}
