'use server';

import { CACHE_TAGS } from '@lib/constants';
import { db } from '@lib/database/db';
import { imagesPoolsEditors } from '@lib/database/schema/public';
import { and, eq } from 'drizzle-orm';
import { revalidateTag } from 'next/cache';

export default async function imagePoolEditorDelete(poolId: string, userId: string) {
	await db
		.delete(imagesPoolsEditors)
		.where(and(eq(imagesPoolsEditors.imagePoolId, poolId), eq(imagesPoolsEditors.userId, userId)));
	revalidateTag(CACHE_TAGS.IMAGE_POOL_EDITORS);
}
