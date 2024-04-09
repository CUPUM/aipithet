import type { ValueOf } from 'type-fest';

export const HEADERS_NAMES = {
	SURVEY_ID: 'x-survey-id',
	SURVEY_CHAPTER_ID: 'x-survey-chapter-id',
	SURVEY_ANSWER_ID: 'x-survey-answer-id',
	IMAGE_POOL_ID: 'x-image-pool-id',
} as const;

export type HeaderName = ValueOf<typeof HEADERS_NAMES>;
