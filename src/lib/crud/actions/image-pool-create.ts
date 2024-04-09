'use server';

import { authorize } from '@lib/auth/auth';
import { db } from '@lib/database/db';
import { imagesPools } from '@lib/database/schema/public';
import { languageTagServer, redirect } from '@lib/i18n/utilities-server';
import { setLanguageTag } from '@translations/runtime';

export default async function imagePoolCreate() {
	setLanguageTag(languageTagServer);
	const { user } = await authorize('images.pools.create');
	const [inserted] = await db
		.insert(imagesPools)
		.values({ createdById: user.id })
		.returning({ id: imagesPools.id });
	if (!inserted) {
		throw new Error('Error when creating survey.');
	}
	redirect(`/images/pools/${inserted.id}/edit`);
}
