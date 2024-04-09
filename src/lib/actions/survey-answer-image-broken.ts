'use server';

import { authorize } from '@lib/auth/auth';
import { db } from '@lib/database/db';
import { images, labelingSurveysAnswers } from '@lib/database/schema/public';
import { revalidatePath } from '@lib/i18n/utilities-server';
import { eq } from 'drizzle-orm';
import { add } from 'drizzle-orm-helpers';
import type { ImageIndex } from '../../app/[lang]/surveys/labeling/[surveyId]/[chapterId]/[answerId]/page';

export default async function surveyAnswerImageBroken(options: {
	chapterId: string;
	answerId: string;
	imageId: string;
	imageIndex: ImageIndex;
}) {
	const { user } = await authorize();
	await db.transaction(async (tx) => {
		await tx
			.update(images)
			.set({ declaredNotFoundCount: add(images.declaredNotFoundCount, 1) })
			.where(eq(images.id, options.imageId));
		await tx.update(labelingSurveysAnswers).set({});
	});
	revalidatePath(`/surveys/labeling/[surveyId]/${options.chapterId}/${options.answerId}`);
}
