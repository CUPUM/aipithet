import * as m from '@translations/messages';
import { z } from 'zod';
import type { Role } from './constants';
import { ROLES_ARR, USER_PASSWORD_MIN } from './constants';

export function isRole(maybeRole: unknown): maybeRole is Role {
	return ROLES_ARR.includes(maybeRole as Role);
}

export const emailPasswordSignupSchema = z
	.object({
		email: z.string().email(),
		password: z.string().min(USER_PASSWORD_MIN, m.password_too_short()),
		passwordConfirm: z.string(),
	})
	.superRefine(({ passwordConfirm, password }, ctx) => {
		if (passwordConfirm !== password) {
			ctx.addIssue({
				code: 'custom',
				message: m.password_confirm_not_matching(),
			});
		}
	});

export const emailPasswordLoginSchema = z.object({
	email: z.string().email(),
	password: z.string(),
});

export const emailConfirmationCodeSchema = z.object({
	code: z.string(),
});
