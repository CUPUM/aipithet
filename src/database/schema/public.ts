import { integer, pgTable, primaryKey, text, timestamp } from 'drizzle-orm/pg-core';
import { ROLE_DEFAULT, role } from '../custom-types';
import { generateNanoid } from '../utils';
import { roles, users } from './auth';
import { langColumn, translationReference } from './i18n';

/**
 * Images types for images uploaded by users.
 */
export const imageTypes = pgTable('image_types', {
	id: text('id').default(generateNanoid()).primaryKey(),
});

/**
 * Translation fields for image types.
 */
export const imageTypesT = pgTable(
	'image_types_t',
	{
		...langColumn,
		id: translationReference('id', imageTypes.id),
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
export const imagePools = pgTable('image_pools', {
	id: text('id')
		.default(generateNanoid({ length: 12 }))
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
export const imagePoolsT = pgTable(
	'image_pools_t',
	{
		...langColumn,
		id: translationReference('id', imagePools.id),
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
export const imagePoolsUsers = pgTable(
	'image_pools_users',
	{
		imagePoolId: text('image_pool_id').references(() => imagePools.id, {
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

/**
 * Images uploaded by users. Each image can be used in multiple pools.
 */
export const images = pgTable('images', {
	id: text('id')
		.default(generateNanoid({ length: 12 }))
		.primaryKey(),
	createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
	imagePoolId: text('image_pool_id')
		.references(() => imagePools.id, {
			onDelete: 'cascade',
			onUpdate: 'cascade',
		})
		.notNull(),
	storageName: text('storage_name').notNull().unique(),
	width: integer('width').notNull(),
	height: integer('height').notNull(),
});

export const imagesT = pgTable(
	'images_t',
	{
		...langColumn,
		id: translationReference('id', images.id),
		description: text('description'),
	},
	(table) => {
		return {
			pk: primaryKey({ columns: [table.id, table.lang] }),
		};
	}
);

export const imagesPrompts = pgTable('images_prompts', {
	id: text('id').default(generateNanoid()).primaryKey(),
});

export const imagesPromptsT = pgTable('images_prompts_t', {});

export const labelingSurveys = pgTable('labeling_surveys', {});

export const labelingSurveysT = pgTable('labeling_surveys_t', {});

export const labelingSurveysChapters = pgTable('labeling_surveys_chapters', {});

export const labelingSurveysChaptersT = pgTable('labeling_surveys_chapters_t', {});
