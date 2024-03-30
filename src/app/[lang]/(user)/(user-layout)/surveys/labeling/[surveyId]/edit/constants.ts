import * as m from '@translations/messages';
import type { LucideIcon } from 'lucide-react';
import { FileText, SignpostBig, TriangleAlert, Users } from 'lucide-react';
import type { ValueOf } from 'type-fest';

export const LABELING_SURVEY_EDITOR_ROUTES = {
	GENERAL: '',
	CHAPTERS: '/chapters',
	SHARING: '/sharing',
	ADMIN: '/admin',
} as const;

export const LABELING_SURVEY_EDITOR_ROUTES_ARR = Object.values(LABELING_SURVEY_EDITOR_ROUTES);

export const LABELING_SURVEY_EDITOR_ROUTES_DETAILS = {
	[LABELING_SURVEY_EDITOR_ROUTES.GENERAL]: {
		icon: FileText,
		t: m.survey_general,
	},
	[LABELING_SURVEY_EDITOR_ROUTES.CHAPTERS]: {
		icon: SignpostBig,
		t: m.survey_chapters,
	},
	[LABELING_SURVEY_EDITOR_ROUTES.SHARING]: {
		icon: Users,
		t: m.sharing,
	},
	[LABELING_SURVEY_EDITOR_ROUTES.ADMIN]: {
		icon: TriangleAlert,
		t: m.administration,
		danger: true,
	},
} satisfies Record<
	ValueOf<typeof LABELING_SURVEY_EDITOR_ROUTES>,
	{
		icon?: LucideIcon;
		t: () => string;
		danger?: true;
	}
>;
