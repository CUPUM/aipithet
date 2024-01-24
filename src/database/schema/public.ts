import { pgTable } from 'drizzle-orm/pg-core';

export const imagePools = pgTable('image_pools', {})

export const labelingSurveys = pgTable('labeling_surveys', {

})

export const labelingSurveysT = pgTable('labeling_surveys_t', {
})

export const labelingSurveysChapters = pgTable('labeling_surveys_chapters', {})

export const labelingSurveysChaptersT = pgTable('labeling_surveys_chapters_t', {})