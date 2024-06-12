import { db } from '@lib/database/db';
import {
	images,
	imagesPrompts,
	labelingSurveysAnswers,
	labelingSurveysChapters,
	labelingSurveysPairs,
	labelsTranslations,
} from '@lib/database/schema/public';
import { eq, inArray } from 'drizzle-orm';
import { parse } from 'json2csv';
import JSZip from 'jszip';
import { NextResponse } from 'next/server';

export async function GET(request: Request, route: { params: { surveyId: string } }) {
	try {
		const zip = new JSZip();

		const allChapters = await db
			.select()
			.from(labelingSurveysChapters)
			.where(eq(labelingSurveysChapters.surveyId, route.params.surveyId));

		const poolIds = [...new Set(allChapters.map((chapter) => chapter.imagePoolId as string))]; // TODO: Fix type

		const answers = await db
			.select()
			.from(labelingSurveysAnswers)
			.where(eq(labelingSurveysAnswers.surveyId, route.params.surveyId));
		const csv = parse(answers);
		zip.file('answers.csv', csv);

		const list_id = [...new Set(answers.map((answer) => answer.pairId))];
		const pairs = await db
			.select()
			.from(labelingSurveysPairs)
			.where(inArray(labelingSurveysPairs.id, list_id));
		const csv2 = parse(pairs);
		zip.file('pairs.csv', csv2);

		const list_images = [...new Set(pairs.map((pair) => [pair.image1Id, pair.image2Id]).flat())];
		const all_images = await db.select().from(images).where(inArray(images.id, list_images));
		const csv3 = parse(all_images);
		zip.file('images.csv', csv3);

		const all_prompts = await db
			.select()
			.from(imagesPrompts)
			.where(inArray(imagesPrompts.poolId, poolIds));
		const csv4 = parse(all_prompts);
		zip.file('prompts.csv', csv4);

		const list_criteria = [
			...new Set(pairs.map((pair) => [pair.label1Id, pair.label2Id, pair.label3Id]).flat()),
		];
		const all_criteria = await db
			.select()
			.from(labelsTranslations)
			.where(inArray(labelsTranslations.id, list_criteria));

		const csv5 = parse(all_criteria);
		zip.file('criteria.csv', csv5);

		const zipContent = await zip.generateAsync({ type: 'nodebuffer' });
		return new NextResponse(zipContent, {
			headers: {
				'Content-Type': 'application/zip',
				'Content-Disposition': 'attachment; filename=data.zip',
			},
		});
	} catch (error) {
		console.error(error);
		return new NextResponse(JSON.stringify({ error: 'Internal Server Error' }), {
			status: 500,
			headers: { 'Content-Type': 'application/json' },
		});
	}
}
