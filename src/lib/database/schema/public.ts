import { add } from 'drizzle-orm-helpers';
import { nanoid, now, toInterval } from 'drizzle-orm-helpers/pg';
import {
	boolean,
	decimal,
	foreignKey,
	integer,
	interval,
	pgTable,
	primaryKey,
	text,
	timestamp,
	unique,
} from 'drizzle-orm/pg-core';
import { users } from './auth';
import { LANG_COLUMN } from './i18n';

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
		body: text('body').notNull(),
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
		scenarioId: text('scenario_id').references(() => workshopScenarios.id, {
			onDelete: 'set null',
			onUpdate: 'cascade',
		}),
		poolId: text('pool_id')
			.references(() => imagesPools.id, { onDelete: 'cascade', onUpdate: 'cascade' })
			.notNull(),
		prompt: text('prompt').notNull(),
		createdAt: timestamp('created_at').notNull().defaultNow(),
	},
	(table) => {
		return {
			unq: unique().on(table.prompt, table.poolId),
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
		createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
		createdById: text('created_by_id').references(() => users.id, {
			onDelete: 'set null',
			onUpdate: 'cascade',
		}),
		storageName: text('storage_name').notNull(),
		poolId: text('pool_id')
			.references(() => imagesPools.id, {
				onDelete: 'cascade',
				onUpdate: 'cascade',
			})
			.notNull(),
		width: integer('width').notNull(),
		height: integer('height').notNull(),
		promptId: text('prompt_id').references(() => imagesPrompts.id, {
			onDelete: 'set null',
			onUpdate: 'cascade',
		}),
	},
	(table) => {
		return {
			unq: unique().on(table.storageName, table.poolId),
		};
	}
);

export const labels = pgTable('labels', {
	id: text('id').default(nanoid()).primaryKey(),
	surveyId: text('survey_id')
		.references(() => labelingSurveys.id, {
			onDelete: 'cascade',
			onUpdate: 'cascade',
		})
		.notNull(),
	createdById: text('created_by_id')
		.references(() => users.id, {
			onDelete: 'cascade',
			onUpdate: 'cascade',
		})
		.notNull(),
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

export const labelingSurveysLeafs = pgTable(
	'labeling_surveys_leafs',
	{
		id: text('id').default(nanoid()).primaryKey(),
		chapterId: text('chapter_id').references(() => labelingSurveysChapters.id, {
			onDelete: 'cascade',
			onUpdate: 'cascade',
		}),
		index: integer('index'),
		createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
		image1Id: text('image_1_id')
			.references(() => images.id, {
				onDelete: 'restrict',
				onUpdate: 'cascade',
			})
			.notNull(),
		image2Id: text('image_2_id')
			.references(() => images.id, {
				onDelete: 'restrict',
				onUpdate: 'cascade',
			})
			.notNull(),
	},
	(table) => {
		return {
			unq: unique().on(table.chapterId, table.index),
		};
	}
);

export const labelingSurveysAnswers = pgTable(
	'labeling_surveys_answers',
	{
		id: text('id').default(nanoid()).primaryKey(),
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
		leafId: text('leaf_id')
			.references(() => labelingSurveysLeafs.id, {
				onDelete: 'cascade',
				onUpdate: 'cascade',
			})
			.notNull(),
		score: decimal('score'),
		timeToAnswerServer: interval('time_to_answer_server').notNull(),
		timeToAnswerClient: interval('time_to_answer_client').notNull(),
		createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
	},
	(table) => ({
		cfk: foreignKey({
			columns: [table.userId, table.chapterId],
			foreignColumns: [labelingSurveysParticipants.userId, labelingSurveysParticipants.surveyId],
		})
			.onDelete('cascade')
			.onUpdate('cascade'),
	})
);
