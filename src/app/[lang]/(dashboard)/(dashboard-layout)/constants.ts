import type { PermissionKey } from '@lib/auth/constants';
import * as m from '@translations/messages';
import type { LucideIcon } from 'lucide-react';
import { BookImage, FolderOpen, Wrench } from 'lucide-react';
import type { ValueOf } from 'type-fest';

export const USER_ROUTES = {
	SURVEYS: '/surveys',
	IMAGES: '/images',
	SETTINGS: '/settings',
} as const;

export const USER_ROUTES_ARR = Object.values(USER_ROUTES);

export const USER_ROUTES_DETAILS = {
	[USER_ROUTES.SURVEYS]: {
		icon: FolderOpen,
		t: m.user_surveys,
		permission: undefined,
	},
	[USER_ROUTES.SETTINGS]: {
		icon: Wrench,
		t: m.user_settings,
		permission: undefined,
	},
	[USER_ROUTES.IMAGES]: {
		icon: BookImage,
		t: m.images,
		permission: 'images.pools.update',
	},
} satisfies Record<
	ValueOf<typeof USER_ROUTES>,
	{
		icon?: LucideIcon;
		t: () => string;
		permission?: PermissionKey;
	}
>;
