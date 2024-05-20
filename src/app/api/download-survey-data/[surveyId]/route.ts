import { db } from '@lib/database/db';
import { labelingSurveysAnswers, labelingSurveysPairs } from '@lib/database/schema/public';
import { eq, inArray } from 'drizzle-orm';
import { parse } from 'json2csv';
import JSZip from 'jszip';
import { NextResponse } from 'next/server';

export async function GET(request: Request, route: { params: { surveyId: string } }) {
	try {
		const zip = new JSZip();
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
