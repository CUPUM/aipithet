import { add } from 'drizzle-orm-helpers';
import { nanoid, now, toInterval } from 'drizzle-orm-helpers/pg';
import {
	boolean,
	integer,
	interval,
	pgTable,
	primaryKey,
	real,
	text,
	timestamp,
	unique,
	type AnyPgColumn,
} from 'drizzle-orm/pg-core';
import { lang } from '../custom-types';
import { users } from './auth';
import { LANG_COLUMN, languages } from './i18n';

/**
 * Collections of images created by users.
 */
export const imagesPools = pgTable('image_pools', {
	id: text('id')
		.default(nanoid({ size: 15 }))
		.primaryKey(),
	createdById: text('created_by_id')
		.notNull()
		.references(() => users.id, {
			onDelete: 'cascade',
			onUpdate: 'cascade',
		}),
	createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
});
export const imagesPoolsTranslations = pgTable(
	'image_pools_t',
	{
		...LANG_COLUMN,
		id: text('id')
			.references(() => imagesPools.id, {
				onDelete: 'cascade',
				onUpdate: 'cascade',
			})
			.notNull(),
		title: text('name'),
		description: text('description'),
	},
	(table) => {
		return {
			pk: primaryKey({ columns: [table.lang, table.id] }),
		};
	}
);

export const imagesPoolsInvitations = pgTable(
	'images_pools_invitations',
	{
		imagePoolId: text('image_pool_id')
			.references(() => imagesPools.id, {
				onDelete: 'cascade',
				onUpdate: 'cascade',
			})
			.notNull(),
		code: text('code')
			.default(nanoid({ size: 8 }))
			.notNull(),
		expiresAt: timestamp('expires_at')
			.default(add(now(), toInterval({ months: 1 })).inlineParams())
			.notNull(),
		email: text('email').notNull(),
		pending: boolean('pending').default(true).notNull(),
	},
	(table) => {
		return {
			pk: primaryKey({ columns: [table.imagePoolId, table.email] }),
		};
	}
);

/**
 * Collaborators who gain editing rights on image pools even if they are not their creators.
 */
export const imagesPoolsEditors = pgTable(
	'image_pools_editors',
	{
		imagePoolId: text('image_pool_id')
			.references(() => imagesPools.id, {
				onDelete: 'cascade',
				onUpdate: 'cascade',
			})
			.notNull(),
		userId: text('user_id')
			.references(() => users.id, {
				onDelete: 'cascade',
				onUpdate: 'cascade',
			})
			.notNull(),
	},
	(table) => {
		return {
			pk: primaryKey({ columns: [table.imagePoolId, table.userId] }),
		};
	}
);

export const workshopScenarios = pgTable(
	'workshop_scenarios',
	{
		id: text('id')
			.default(nanoid({ size: 12 }))
			.primaryKey(),
		poolId: text('pool_id')
			.references(() => imagesPools.id, { onDelete: 'cascade', onUpdate: 'cascade' })
			.notNull(),
		externalId: text('external_id'),
		name: text('name').notNull(),
		description: text('description').notNull(),
		createdAt: timestamp('created_at').defaultNow().notNull(),
		createdById: text('created_by_id').references(() => users.id, {
			onDelete: 'set null',
			onUpdate: 'cascade',
		}),
		updatedById: text('updated_by_id').references(() => users.id, {
			onDelete: 'set null',
			onUpdate: 'cascade',
		}),
	},
	(table) => {
		return {
			unq: unique().on(table.poolId, table.name),
		};
	}
);

/**
 * Reusable image-prompts associated with generated images uploaded by users.
 */
export const imagesPrompts = pgTable(
	'images_prompts',
	{
		id: text('id').default(nanoid()).primaryKey(),
		externalId: text('external_id'),
		scenarioId: text('scenario_id').references(() => workshopScenarios.id, {
			onDelete: 'set null',
			onUpdate: 'cascade',
		}),
		poolId: text('pool_id')
			.references(() => imagesPools.id, { onDelete: 'cascade', onUpdate: 'cascade' })
			.notNull(),
		prompt: text('prompt').notNull(),
		method: text('method'),
		createdAt: timestamp('created_at').notNull().defaultNow(),
		createdById: text('created_by_id').references(() => users.id, {
			onDelete: 'set null',
			onUpdate: 'cascade',
		}),
		updatedById: text('updated_by_id').references(() => users.id, {
			onDelete: 'set null',
			onUpdate: 'cascade',
		}),
	},
	(table) => {
		return {
			unq: unique().on(table.poolId, table.prompt, table.method).nullsNotDistinct(),
		};
	}
);

export const imagesPromptsRelation = pgTable(
	'images_prompts_relation',
	{
		parentPromptId: text('parent_prompt_id').references(() => imagesPrompts.id, {
			onDelete: 'cascade',
			onUpdate: 'cascade',
		}),
		childPromptId: text('child_prompt_id').references(() => imagesPrompts.id, {
			onDelete: 'cascade',
			onUpdate: 'cascade',
		}),
		modification: text('modification'),
	},
	(table) => {
		return {
			pk: primaryKey({ columns: [table.parentPromptId, table.childPromptId] }),
		};
	}
);

/**
 * Images uploaded by users (can be used across multiple pools).
 */
export const images = pgTable(
	'images',
	{
		id: text('id').default(nanoid()).primaryKey(),
		externalId: text('external_id'),
		createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
		createdById: text('created_by_id').references(() => users.id, {
			onDelete: 'set null',
			onUpdate: 'cascade',
		}),
		updatedById: text('updated_by_id').references(() => users.id, {
			onDelete: 'set null',
			onUpdate: 'cascade',
		}),
		poolId: text('pool_id')
			.references(() => imagesPools.id, {
				onDelete: 'cascade',
				onUpdate: 'cascade',
			})
			.notNull(),
		path: text('path').notNull(),
		bucket: text('bucket').notNull(),
		width: integer('width').notNull(),
		height: integer('height').notNull(),
		promptId: text('prompt_id').references(() => imagesPrompts.id, {
			onDelete: 'set null',
			onUpdate: 'cascade',
		}),
		declaredNotFoundCount: integer('declared_not_found_count').notNull().default(0),
		method: text('method'),
	},
	(table) => {
		return {
			unq: unique().on(table.poolId, table.path, table.bucket),
		};
	}
);

export const labels = pgTable('labels', {
	id: text('id').default(nanoid()).primaryKey(),
	externalId: text('external_id'),
	surveyId: text('survey_id')
		.references(() => labelingSurveys.id, {
			onDelete: 'cascade',
			onUpdate: 'cascade',
		})
		.notNull(),
	createdById: text('created_by_id').references(() => users.id, {
		onDelete: 'set null',
		onUpdate: 'cascade',
	}),
	updatedById: text('updated_by_id').references(() => users.id, {
		onDelete: 'set null',
		onUpdate: 'cascade',
	}),
	createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
});
export const labelsTranslations = pgTable(
	'labels_t',
	{
		...LANG_COLUMN,
		id: text('id')
			.references(() => labels.id, {
				onDelete: 'cascade',
				onUpdate: 'cascade',
			})
			.notNull(),
		text: text('text'),
		description: text('description'),
	},
	(table) => {
		return {
			pk: primaryKey({ columns: [table.lang, table.id] }),
		};
	}
);

export const labelingSurveys = pgTable('labeling_surveys', {
	id: text('id').default(nanoid()).primaryKey(),
	createdById: text('created_by_id').references(() => users.id, {
		onDelete: 'set null',
		onUpdate: 'cascade',
	}),
	sliderStepCount: integer('slider_step_count').notNull().default(0),
	imagePoolId: text('image_pool_id').references(() => imagesPools.id, {
		onDelete: 'set null',
		onUpdate: 'cascade',
	}),
	createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
	updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
	updatedById: text('updated_by_id').references(() => users.id, {
		onDelete: 'set null',
		onUpdate: 'cascade',
	}),
	breakDuration: integer('break_duration').notNull().default(15),
	allowBreaks: boolean('allow_breaks').notNull().default(true),
	breakFrequency: integer('break_frequency').notNull().default(150),
	sessionDuration: integer('session_duration').notNull().default(45),
	breakMessage: text('break_message'), // TODO: Support translations
});
export const labelingSurveysTranslations = pgTable(
	'labeling_surveys_t',
	{
		...LANG_COLUMN,
		id: text('id')
			.references(() => labelingSurveys.id, {
				onDelete: 'cascade',
				onUpdate: 'cascade',
			})
			.notNull(),
		title: text('title'),
		summary: text('summary'),
		description: text('description'),
		help: text('help'),
	},
	(table) => {
		return {
			pk: primaryKey({ columns: [table.lang, table.id] }),
		};
	}
);

export const labelingSurveysEditors = pgTable(
	'labeling_surveys_editors',
	{
		surveyId: text('survey_id').references(() => labelingSurveys.id, {
			onDelete: 'cascade',
			onUpdate: 'cascade',
		}),
		userId: text('user_id').references(() => users.id, {
			onDelete: 'cascade',
			onUpdate: 'cascade',
		}),
		createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
	},
	(table) => {
		return {
			pk: primaryKey({ columns: [table.surveyId, table.userId] }),
		};
	}
);

export const labelingSurveysParticipants = pgTable(
	'labeling_surveys_participants',
	{
		surveyId: text('survey_id').references(() => labelingSurveys.id, {
			onDelete: 'cascade',
			onUpdate: 'cascade',
		}),
		userId: text('user_id').references(() => users.id, {
			onDelete: 'cascade',
			onUpdate: 'cascade',
		}),
		createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
	},
	(table) => {
		return {
			pk: primaryKey({ columns: [table.surveyId, table.userId] }),
		};
	}
);

export const labelingSurveysInvitations = pgTable(
	'labeling_surveys_invitations',
	{
		surveyId: text('survey_id')
			.references(() => labelingSurveys.id, {
				onDelete: 'cascade',
				onUpdate: 'cascade',
			})
			.notNull(),
		code: text('code')
			.default(nanoid({ size: 8 }))
			.notNull(),
		expiresAt: timestamp('expires_at')
			.default(add(now(), toInterval({ months: 1 })).inlineParams())
			.notNull(),
		email: text('email').notNull(),
		editor: boolean('editor').default(false).notNull(),
		pending: boolean('pending').default(true).notNull(),
		createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
		preferredLang: lang('preferred_lang').references(() => languages.lang, {
			onDelete: 'cascade',
			onUpdate: 'cascade',
		}),
	},
	(table) => {
		return {
			pk: primaryKey({ columns: [table.surveyId, table.email, table.editor] }),
		};
	}
);

export const labelingSurveysChapters = pgTable('labeling_surveys_chapters', {
	id: text('id').default(nanoid()).primaryKey(),
	createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
	createdById: text('created_by_id').references(() => users.id, {
		onDelete: 'set null',
		onUpdate: 'cascade',
	}),
	imagePoolId: text('image_pool_id').references(() => imagesPools.id, {
		onDelete: 'set null',
		onUpdate: 'cascade',
	}),
	surveyId: text('survey_id')
		.references(() => labelingSurveys.id, {
			onDelete: 'cascade',
			onUpdate: 'cascade',
		})
		.notNull(),
	start: timestamp('start', { withTimezone: true }),
	end: timestamp('end', { withTimezone: true }),
	maxAnswersCount: integer('max_answers_count'),
	allowLateness: boolean('allow_lateness').notNull().default(false),
	mode: text('mode', { enum: ['fixed', 'random'] })
		.default('random')
		.notNull(),
});
export const labelingSurveysChaptersTranslations = pgTable(
	'labeling_surveys_chapters_t',
	{
		...LANG_COLUMN,
		id: text('id')
			.references(() => labelingSurveysChapters.id, {
				onDelete: 'cascade',
				onUpdate: 'cascade',
			})
			.notNull(),
		title: text('title'),
		summary: text('summary'),
		description: text('description'),
	},
	(table) => {
		return {
			pk: primaryKey({ columns: [table.lang, table.id] }),
		};
	}
);

export const labelingSurveysBreaks = pgTable('labeling_surveys_breaks', {
	id: text('id').default(nanoid()).primaryKey(),
	createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
	userId: text('user_id')
		.references(() => users.id, {
			onDelete: 'cascade',
			onUpdate: 'cascade',
		})
		.notNull(),
	chapterId: text('chapter_id')
		.references(() => labelingSurveysChapters.id, {
			onDelete: 'cascade',
			onUpdate: 'cascade',
		})
		.notNull(),
	startAt: timestamp('start', { withTimezone: true }).notNull(),
	endAt: timestamp('end', { withTimezone: true }).notNull(),
});

export const labelingSurveysPairs = pgTable(
	'labeling_surveys_pairs',
	{
		id: text('id').default(nanoid()).primaryKey(),
		chapterId: text('chapter_id')
			.references(() => labelingSurveysChapters.id, {
				onDelete: 'cascade',
				onUpdate: 'cascade',
			})
			.notNull(),
		index: integer('index'),
		createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
		image1Id: text('image_1_id')
			.references(() => images.id, {
				onDelete: 'cascade',
				onUpdate: 'cascade',
			})
			.notNull(),
		image2Id: text('image_2_id')
			.references(() => images.id, {
				onDelete: 'cascade',
				onUpdate: 'cascade',
			})
			.notNull(),
		label1Id: text('label_1_id')
			.references(() => labels.id, {
				onDelete: 'set null',
				onUpdate: 'cascade',
			})
			.notNull(),
		label2Id: text('label_2_id')
			.references(() => labels.id, {
				onDelete: 'set null',
				onUpdate: 'cascade',
			})
			.notNull(),
		label3Id: text('label_3_id')
			.references(() => labels.id, {
				onDelete: 'set null',
				onUpdate: 'cascade',
			})
			.notNull(),
		maxAnswersCount: integer('max_answers_count').default(1).notNull(),
		generationMethod: text('generation_method').notNull(),
		type: text('type'),
	}
	// (table) => {
	// 	return {
	// 		unq: unique().on(table.chapterId, table.index), // Ask Emmanuel about this
	// 	};
	// }
);

export const labelingSurveysAnswers = pgTable('labeling_surveys_answers', {
	id: text('id').default(nanoid()).primaryKey(),
	pairId: text('pair_id')
		.references(() => labelingSurveysPairs.id, {
			onDelete: 'cascade',
			onUpdate: 'cascade',
		})
		.notNull(),
	surveyId: text('survey_id')
		.references(() => labelingSurveys.id, {
			onDelete: 'cascade',
			onUpdate: 'cascade',
		})
		.notNull(),
	chapterId: text('chapter_id')
		.references(() => labelingSurveysChapters.id, {
			// Should the chapterId be defined in labelingSurveysPairs or in labelingSurveysAnswers?
			onDelete: 'cascade',
			onUpdate: 'cascade',
		})
		.notNull(),
	userId: text('user_id')
		.references(() => users.id, {
			onDelete: 'cascade',
			onUpdate: 'cascade',
		})
		.notNull(),
	score1: real('score_1'),
	score2: real('score_2'),
	score3: real('score_3'),
	scoreAnswered1: boolean('score_1_answered'),
	scoreAnswered2: boolean('score_2_answered'),
	scoreAnswered3: boolean('score_3_answered'),
	comment: text('comment'),
	timeToAnswerServer: interval('time_to_answer_server'),
	timeToAnswerClient: interval('time_to_answer_client'),
	answeredAt: timestamp('answered_at', { withTimezone: true }),
	createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
	nextAnswerId: text('next_answer_id').references((): AnyPgColumn => labelingSurveysAnswers.id, {
		onDelete: 'cascade',
		onUpdate: 'cascade',
	}),
	prevAnswerId: text('prev_answer_id').references((): AnyPgColumn => labelingSurveysAnswers.id, {
		onDelete: 'cascade',
		onUpdate: 'cascade',
	}),
});
