import { headers } from 'next/headers';
import { HEADERS_NAMES, type HeaderName } from './constants';

function expectHeader(key: HeaderName) {
	const header = headers().get(key);
	if (!header) {
		throw new Error(`Missing header "${key}"`);
	}
	return header;
}

export const surveyId = expectHeader(HEADERS_NAMES.SURVEY_ID);

export const surveyChapterId = expectHeader(HEADERS_NAMES.SURVEY_CHAPTER_ID);

export const surveyAnswerId = expectHeader(HEADERS_NAMES.SURVEY_ANSWER_ID);

export const imagePoolId = expectHeader(HEADERS_NAMES.IMAGE_POOL_ID);
