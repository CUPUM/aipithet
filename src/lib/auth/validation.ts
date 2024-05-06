import * as m from '@translations/messages';
import { ZodIssueCode, z } from 'zod';
import { USER_PASSWORD_MIN } from './constants';

export const emailSchema = z.string().trim().toLowerCase().email(m.email_invalid());
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

export const passwordResetFinalizeSchema = z
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
		currentPassword: hintlessPasswordSchema,
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
