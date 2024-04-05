'use server';

import { authorize } from '@lib/auth/auth';
import { db } from '@lib/database/db';
import { imagesPools } from '@lib/database/schema/public';
import { languageTagServer, redirect } from '@lib/i18n/utilities-server';
import { canEditImagePool } from '@lib/queries/queries';
import { setLanguageTag } from '@translations/runtime';
import { and, eq } from 'drizzle-orm';

export default async function imagePoolDelete(poolId: string) {
	setLanguageTag(languageTagServer);
	const { user } = await authorize('images.pools.delete');
	await db
		.delete(imagesPools)
		.where(and(eq(imagesPools.id, poolId), canEditImagePool({ userId: user.id })));
	redirect('/images');
}
