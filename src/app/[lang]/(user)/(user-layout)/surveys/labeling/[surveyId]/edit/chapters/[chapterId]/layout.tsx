import { authorize } from '@lib/auth/auth';
import { db } from '@lib/database/db';
import {
	labelingSurveysChapters,
	labelingSurveysChaptersTranslations,
} from '@lib/database/schema/public';
import { canEditLabelingSurvey } from '@lib/queries/queries';
import * as m from '@translations/messages';
import { languageTag } from '@translations/runtime';
import { and, eq } from 'drizzle-orm';
import { getColumns } from 'drizzle-orm-helpers';
import { SignpostBig } from 'lucide-react';
import { notFound } from 'next/navigation';
import type { ReactNode } from 'react';

export default async function Layout(props: {
	children: ReactNode;
	params: { surveyId: string; chapterId: string };
}) {
	const lang = languageTag();
	const { user } = await authorize();
	const { title } = getColumns(labelingSurveysChaptersTranslations);
	const [chapter] = await db
		.select({ title })
		.from(labelingSurveysChapters)
		.leftJoin(
			labelingSurveysChaptersTranslations,
			and(
				eq(labelingSurveysChapters.id, labelingSurveysChaptersTranslations.id),
				eq(labelingSurveysChaptersTranslations.lang, lang)
			)
		)
		.where(
			and(
				eq(labelingSurveysChapters.id, props.params.chapterId),
				canEditLabelingSurvey({ userId: user.id, surveyId: props.params.surveyId })
			)
		)
		.limit(1);
	if (!chapter) {
		notFound();
	}
	return (
		<>
			<h2 className="flex flex-row gap-6 text-3xl font-semibold">
				<SignpostBig className="inline h-[1.15em] opacity-50" />
				{chapter.title ?? <span className="italic text-muted-foreground">{m.untitled()}</span>}
			</h2>
			{props.children}
		</>
	);
}
