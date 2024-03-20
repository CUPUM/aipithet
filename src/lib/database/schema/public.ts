import { add } from 'drizzle-orm-helpers';
import { nanoid, now, interval as timeInterval } from 'drizzle-orm-helpers/pg';
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
import { lang } from '../custom-types';
import { users } from './auth';
import { LANG_COLUMN } from './i18n';

/**
 * Images types for images uploaded by users.
 */
export const imageTypes = pgTable('image_types', {
	id: text('id').default(nanoid()).primaryKey(),
});
export const imageTypesTranslations = pgTable(
	'image_types_t',
	{
		...LANG_COLUMN,
		id: text('id')
			.references(() => imageTypes.id, {
				onDelete: 'cascade',
				onUpdate: 'cascade',
			})
			.notNull(),
		title: text('title'),
		description: text('description'),
	},
	(table) => {
		return {
			pk: primaryKey({ columns: [table.lang, table.id] }),
		};
	}
);

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

/**
 * Collaborators who gain editing rights on image pools even if they are not their creators.
 */
export const imagesPoolsEditors = pgTable(
	'image_pools_users',
	{
		imagePoolId: text('image_pool_id').references(() => imagesPools.id, {
			onDelete: 'cascade',
			onUpdate: 'cascade',
		}),
		userId: text('user_id').references(() => users.id, {
			onDelete: 'cascade',
			onUpdate: 'cascade',
		}),
	},
	(table) => {
		return {
			pk: primaryKey({ columns: [table.imagePoolId, table.userId] }),
		};
	}
);

/**
 * Reusable image-prompts associated with generated images uploaded by users.
 */
export const imagesPrompts = pgTable('images_prompts', {
	id: text('id').default(nanoid()).primaryKey(),
	originalLang: lang('original_lang').notNull(),
});
export const imagesPromptsT = pgTable(
	'images_prompts_t',
	{
		...LANG_COLUMN,
		id: text('id')
			.references(() => imagesPrompts.id, {
				onDelete: 'cascade',
				onUpdate: 'cascade',
			})
			.notNull(),
		prompt: text('prompt').notNull(),
		title: text('title'),
		description: text('description'),
	},
	(table) => {
		return {
			pk: primaryKey({ columns: [table.lang, table.id] }),
		};
	}
);

/**
 * Images uploaded by users (can be used across multiple pools).
 */
export const images = pgTable('images', {
	id: text('id').default(nanoid()).primaryKey(),
	createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
	storageName: text('storage_name').notNull().unique(),
	width: integer('width').notNull(),
	height: integer('height').notNull(),
	promptId: text('prompt_id').references(() => imagesPrompts.id, {
		onDelete: 'set null',
		onUpdate: 'cascade',
	}),
});
export const imagesTranslations = pgTable(
	'images_t',
	{
		...LANG_COLUMN,
		id: text('id')
			.references(() => images.id, {
				onDelete: 'cascade',
				onUpdate: 'cascade',
			})
			.notNull(),
		description: text('description'),
	},
	(table) => {
		return {
			pk: primaryKey({ columns: [table.id, table.lang] }),
		};
	}
);

/**
 * Through this table, images can be used across multiple pools (many:many).
 */
export const imagesToPools = pgTable(
	'images_to_pools',
	{
		poolId: text('image_pool_id').references(() => imagesPools.id, {
			onDelete: 'cascade',
			onUpdate: 'cascade',
		}),
		imageId: text('image_id').references(() => images.id, {
			onDelete: 'cascade',
			onUpdate: 'cascade',
		}),
	},
	(table) => {
		return {
			pk: primaryKey({ columns: [table.imageId, table.poolId] }),
		};
	}
);

export const labelingSurveys = pgTable('labeling_surveys', {
	id: text('id').default(nanoid()).primaryKey(),
	createdById: text('created_by_id').references(() => users.id, {
		onDelete: 'set null',
		onUpdate: 'cascade',
	}),
	likertStepCount: integer('likert_step_count').notNull().default(0),
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
		surveyId: text('survey_id').references(() => labelingSurveys.id, {
			onDelete: 'cascade',
			onUpdate: 'cascade',
		}),
		code: text('code').default(nanoid()).notNull(),
		expiresAt: timestamp('expires_at')
			.default(add(now(), timeInterval({ months: 1 })).inlineParams())
			.notNull(),
		email: text('email').notNull(),
		editor: boolean('editor').default(false).notNull(),
		pending: boolean('pending').default(true).notNull(),
	},
	(table) => {
		return {
			unq: unique('unique_surveys_invitation_email').on(table.surveyId, table.email),
		};
	}
);

export const labelingSurveysChapters = pgTable('labeling_surveys_chapters', {
	id: text('id').default(nanoid()).primaryKey(),
	surveyId: text('survey_id').references(() => labelingSurveys.id, {
		onDelete: 'cascade',
		onUpdate: 'cascade',
	}),
	imagePoolId: text('image_pool_id').references(() => imagesPools.id, {
		onDelete: 'set null',
		onUpdate: 'cascade',
	}),
	duration: interval('duration'),
	start: timestamp('start', { withTimezone: true }),
	allowLateness: boolean('allow_lateness'),
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
		description: text('description'),
	},
	(table) => {
		return {
			pk: primaryKey({ columns: [table.lang, table.id] }),
		};
	}
);

export const labelingSurveysChaptersLeafs = pgTable(
	'labeling_surveys_chapters_leafs',
	{
		id: text('id').default(nanoid()).primaryKey(),
		chapterId: text('chapter_id').references(() => labelingSurveysChapters.id, {
			onDelete: 'cascade',
			onUpdate: 'cascade',
		}),
		index: integer('index'),
		createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
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

export const labelingSurveysChaptersAnswers = pgTable(
	'labeling_surveys_chapters_answers',
	{
		id: text('id').default(nanoid()).primaryKey(),
		leafId: text('leaf_id')
			.references(() => labelingSurveysChaptersLeafs.id, {
				onDelete: 'cascade',
				onUpdate: 'cascade',
			})
			.notNull(),
		userId: text('user_id').notNull(),
		surveyId: text('survey_id').notNull(),
		score: decimal('score'),
		timeToAnswerServer: interval('time_to_answer_server').notNull(),
		timeToAnswerClient: interval('time_to_answer_client').notNull(),
		createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
	},
	(table) => ({
		cfk: foreignKey({
			columns: [table.userId, table.surveyId],
			foreignColumns: [labelingSurveysParticipants.userId, labelingSurveysParticipants.surveyId],
		})
			.onDelete('cascade')
			.onUpdate('cascade'),
	})
);
