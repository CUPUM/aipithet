import { ROLE_DEFAULT } from '@lib/auth/constants';
import { add } from 'drizzle-orm-helpers';
import { nanoid, now, interval as timeInterval } from 'drizzle-orm-helpers/pg';
import {
	boolean,
	foreignKey,
	integer,
	interval,
	pgTable,
	primaryKey,
	text,
	timestamp,
	unique,
} from 'drizzle-orm/pg-core';
import { lang, role } from '../custom-types';
import { roles, users } from './auth';
import { LANG_COLUMN } from './i18n';

/**
 * Images types for images uploaded by users.
 */
export const imageTypes = pgTable('image_types', {
	id: text('id').default(nanoid()).primaryKey(),
});

/**
 * Translation fields for image types.
 */
export const imageTypesT = pgTable(
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

/**
 * Translation fields for collections of images.
 */
export const imagesPoolsT = pgTable(
	'image_pools_t',
	{
		...LANG_COLUMN,
		id: text('id')
			.references(() => imagesPools.id, {
				onDelete: 'cascade',
				onUpdate: 'cascade',
			})
			.notNull(),
		name: text('name'),
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
		role: role('role')
			.references(() => roles.role, { onDelete: 'set default', onUpdate: 'cascade' })
			.notNull()
			.default(ROLE_DEFAULT),
	},
	(table) => {
		return {
			pk: primaryKey({ columns: [table.imagePoolId, table.userId] }),
		};
	}
);

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
 * Images uploaded by users. Each image can be used in multiple pools.
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
export const imagesT = pgTable(
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
	dueAt: timestamp('due_at', { withTimezone: true }),
	createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
	updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
});
export const labelingSurveysT = pgTable(
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

export const labelingSurveysUsers = pgTable(
	'labeling_surveys_users',
	{
		surveyId: text('survey_id').references(() => labelingSurveys.id, {
			onDelete: 'cascade',
			onUpdate: 'cascade',
		}),
		userId: text('user_id').references(() => users.id, {
			onDelete: 'cascade',
			onUpdate: 'cascade',
		}),
		role: role('role')
			.references(() => roles.role, { onDelete: 'set default', onUpdate: 'cascade' })
			.notNull()
			.default(ROLE_DEFAULT),
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
		pending: boolean('pending').default(false).notNull(),
	},
	(table) => {
		return {
			unq: unique('unique_surveys_invitation_email').on(table.surveyId, table.email),
		};
	}
);

export const labelingSurveyCriterias = pgTable('labeling_survey_criteria', {});

export const labelingSurveysChapters = pgTable('labeling_surveys_chapters', {
	id: text('id').default(nanoid()).primaryKey(),
	surveyId: text('survey_id').references(() => labelingSurveys.id, {
		onDelete: 'cascade',
		onUpdate: 'cascade',
	}),
});

export const labelingSurveysChaptersT = pgTable(
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

export const labelingSurveysAnswers = pgTable(
	'labeling_surveys_answers',
	{
		id: text('id').default(nanoid()).primaryKey(),
		surveyId: text('survey_id'),
		userId: text('participant_id'),
		/**
		 * Check time to answer using cookies().set() on page load and cookies().get() on form submit.
		 */
		timeToAnswerServer: interval('time_to_answer_server').notNull(),
		/**
		 * Check time to answer client-side using a timer and a hidden readonly field in the form.
		 */
		timeToAnswerClient: interval('time_to_answer_client').notNull(),
		// Add more fields
	},
	(table) => {
		return {
			fk: foreignKey({
				columns: [table.userId, table.surveyId],
				foreignColumns: [labelingSurveysUsers.userId, labelingSurveysUsers.surveyId],
				name: 'labeling_surveys_users_fk',
			})
				.onDelete('cascade')
				.onUpdate('cascade'),
		};
	}
);
