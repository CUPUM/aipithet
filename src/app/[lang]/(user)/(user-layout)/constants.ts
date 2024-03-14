import * as m from '@translations/messages';
import type { LucideIcon } from 'lucide-react';
import { FolderOpen, LayoutDashboard, Wrench } from 'lucide-react';
import type { ValueOf } from 'type-fest';

export const USER_ROUTES = {
	DASHBOARD: '/i',
	SURVEYS: '/surveys',
	SETTINGS: '/settings',
} as const;

export const USER_ROUTES_ARR = Object.values(USER_ROUTES);

export const USER_ROUTES_DETAILS = {
	[USER_ROUTES.DASHBOARD]: {
		icon: LayoutDashboard,
		t: m.user_dashboard,
	},
	[USER_ROUTES.SURVEYS]: {
		icon: FolderOpen,
		t: m.user_surveys,
	},
	[USER_ROUTES.SETTINGS]: {
		icon: Wrench,
		t: m.user_settings,
	},
} satisfies Record<
	ValueOf<typeof USER_ROUTES>,
	{
		icon?: LucideIcon;
		t: () => string;
	}
>;
