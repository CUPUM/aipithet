// This should soon be a part of drizzle-kit
// i.e.: it will be deprecated when `drizzle-kit apply` becomes a thing.

import { ROLES_ARR } from '@lib/auth/constants';
import { roles } from '@lib/database/schema/auth';
import { languages } from '@lib/database/schema/i18n';
import { LANG_NAMES } from '@lib/i18n/constants';
import type { AvailableLanguageTag } from '@translations/runtime';
import { availableLanguageTags } from '@translations/runtime';
import type { Regconfig } from 'drizzle-orm-helpers/pg';
import { exit } from 'process';
import { scriptDb } from './common';

const LANG_REGCONFIGS = {
	fr: 'french',
	en: 'english',
} as const satisfies Record<AvailableLanguageTag, Regconfig>;

try {
	console.info('🥕 Seeding database...');
	await scriptDb.transaction(async (tx) => {
		// Languages
		// await tx.delete(languages).where(notInArray(languages.lang, [...availableLanguageTags]));
		await tx
			.insert(languages)
			.values(
				availableLanguageTags.map((lang) => ({
					lang,
					name: LANG_NAMES[lang],
					regconfig: LANG_REGCONFIGS[lang],
				}))
			)
			.onConflictDoNothing();

		// User roles
		// await tx.delete(roles).where(notInArray(roles.role, ROLES_ARR));
		await tx
			.insert(roles)
			.values(ROLES_ARR.map((role) => ({ role })))
			.onConflictDoNothing({ target: [roles.role] });
	});
	console.info('🚀 Database successfully seeded!');
} catch (error) {
	console.error('❌ Database seed failed (see error below).');
	console.error(error);
} finally {
	exit();
}
