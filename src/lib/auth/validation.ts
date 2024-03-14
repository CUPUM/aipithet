import * as m from '@translations/messages';
import type { User } from 'lucia';
import { ZodIssueCode, z } from 'zod';
import type { PermissionKey, Role } from './constants';
import { PERMISSIONS, ROLES_ARR, USER_PASSWORD_MIN } from './constants';

export function isRole(maybeRole: unknown): maybeRole is Role {
	return ROLES_ARR.includes(maybeRole as Role);
}

export function safeCheckUserPermissions(user: User, key?: PermissionKey) {
	return !key || (PERMISSIONS[key] as Role[]).includes(user.role);
}

export const emailSchema = z.string().trim().email(m.email_invalid());
export const hintlessPasswordSchema = z.string().trim().min(1, m.password_missing());
export const passwordSchema = z.string().trim().min(USER_PASSWORD_MIN, m.password_too_short());
export const passwordConfirmSchema = z.string().trim().min(1, m.password_confirmation_missing());

export const emailPasswordSignupSchema = z
	.object({
		email: emailSchema,
		password: passwordSchema,
		passwordConfirm: passwordConfirmSchema,
	})
	.superRefine(({ password, passwordConfirm }, ctx) => {
		if (passwordConfirm !== password) {
			ctx.addIssue({
				code: ZodIssueCode.custom,
				path: ['passwordConfirm'],
				message: m.password_confirm_not_matching(),
			});
		}
	});

export const emailPasswordLoginSchema = z.object({
	email: emailSchema,
	password: hintlessPasswordSchema,
});

export const passwordResetSchema = z.object({
	email: emailSchema,
});

export const finalizePasswordResetSchema = z
	.object({
		token: z.string().trim().min(1, m.password_reset_token_invalid()),
		newPassword: passwordSchema,
		newPasswordConfirm: passwordConfirmSchema,
	})
	.superRefine(({ newPassword, newPasswordConfirm }, ctx) => {
		if (newPasswordConfirm !== newPassword) {
			ctx.addIssue({
				code: ZodIssueCode.custom,
				path: ['newPasswordConfirm'],
				message: m.password_confirm_not_matching(),
			});
		}
	});

export const passwordUpdateSchema = z
	.object({
		password: hintlessPasswordSchema,
		newPassword: passwordSchema,
		newPasswordConfirm: passwordConfirmSchema,
	})
	.superRefine(({ newPassword, newPasswordConfirm }, ctx) => {
		if (newPasswordConfirm !== newPassword) {
			ctx.addIssue({
				code: ZodIssueCode.custom,
				path: ['newPasswordConfirm'],
				message: m.password_confirm_not_matching(),
			});
		}
	});

export const emailVerificationSchema = z.object({
	code: z.string().toUpperCase().trim().min(1),
});
