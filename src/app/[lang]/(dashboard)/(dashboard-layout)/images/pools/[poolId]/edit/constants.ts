import * as m from '@translations/messages';
import type { LucideIcon } from 'lucide-react';
import { FileText, Images, Shield } from 'lucide-react';
import type { ValueOf } from 'type-fest';

export const IMAGE_POOL_EDITOR_ROUTES = {
	GENERAL: '',
	IMAGES: '/images',
	ADMIN: '/admin',
} as const;

export const IMAGE_POOL_EDITOR_ROUTES_ARR = Object.values(IMAGE_POOL_EDITOR_ROUTES);

export const IMAGE_POOL_EDITOR_ROUTES_DETAILS = {
	[IMAGE_POOL_EDITOR_ROUTES.GENERAL]: {
		icon: FileText,
		t: m.survey_general,
	},
	[IMAGE_POOL_EDITOR_ROUTES.IMAGES]: {
		icon: Images,
		t: m.images_and_metadata,
	},
	[IMAGE_POOL_EDITOR_ROUTES.ADMIN]: {
		icon: Shield,
		t: m.administration,
		danger: true,
	},
} satisfies Record<
	ValueOf<typeof IMAGE_POOL_EDITOR_ROUTES>,
	{
		icon?: LucideIcon;
		t: () => string;
		danger?: true;
	}
>;
