import * as m from '@translations/messages';
import { ZodIssueCode, z } from 'zod';
import type { Role } from './constants';
import { ROLES_ARR, USER_PASSWORD_MIN } from './constants';

export function isRole(maybeRole: unknown): maybeRole is Role {
	return ROLES_ARR.includes(maybeRole as Role);
}

export const emailPasswordSignupSchema = z
	.object({
		email: z.string().trim().email(m.email_invalid()),
		password: z.string().trim().min(USER_PASSWORD_MIN, m.password_too_short()),
		passwordConfirm: z.string().trim().min(1, m.password_confirmation_missing()),
	})
	.superRefine(({ passwordConfirm, password }, ctx) => {
		if (passwordConfirm !== password) {
			ctx.addIssue({
				code: ZodIssueCode.custom,
				path: ['passwordConfirm'],
				message: m.password_confirm_not_matching(),
			});
		}
	});

export const emailPasswordLoginSchema = z.object({
	email: z.string().trim().email(m.email_invalid()),
	password: z.string().trim().min(1, m.password_missing()),
});

export const passwordResetSchema = z.object({
	email: z.string().trim().email(m.email_invalid()),
});

export const passwordUpdateSchema = z
	.object({
		password: z.string().trim().min(1, m.password_missing()),
		newPassword: z.string().trim().min(USER_PASSWORD_MIN, m.password_too_short()),
		newPasswordConfirm: z.string().trim().min(1, m.password_confirmation_missing()),
	})
	.superRefine(({ newPasswordConfirm, newPassword }, ctx) => {
		if (newPasswordConfirm !== newPassword) {
			ctx.addIssue({
				code: ZodIssueCode.custom,
				message: m.password_confirm_not_matching(),
			});
		}
	});

export const emailVerificationSchema = z.object({
	code: z.string().toUpperCase().trim().min(1),
});
