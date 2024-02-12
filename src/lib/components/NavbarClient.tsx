'use client';

import { Button } from '@components/ui/button';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from '@components/ui/dropdown-menu';
import { Moon, Sun, Translate } from '@phosphor-icons/react';
import * as m from '@translations/messages';
import { useTheme } from 'next-themes';
import { LANG_NAMES } from '../i18n/constants';
import { availableLanguageTags } from '../i18n/generated/runtime';

export function NavbarLangSwitch() {
	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button variant="outline" size="icon">
					<Translate className="h-[1.2rem] w-[1.2rem]" />
					<span className="sr-only">{m.navbar_change_language()}</span>
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent align="end">
				{availableLanguageTags.map((tag) => (
					<DropdownMenuItem asChild key={tag}>
						<a href={tag}>{LANG_NAMES[tag]}</a>
					</DropdownMenuItem>
				))}
			</DropdownMenuContent>
		</DropdownMenu>
	);
}

export function NavbarThemeToggle() {
	const { setTheme } = useTheme();

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button variant="outline" size="icon">
					<Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
					<Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
					<span className="sr-only">{m.navbar_toggle_theme()}</span>
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent align="end">
				<DropdownMenuItem onClick={() => setTheme('light')}>Light</DropdownMenuItem>
				<DropdownMenuItem onClick={() => setTheme('dark')}>Dark</DropdownMenuItem>
				<DropdownMenuItem onClick={() => setTheme('system')}>System</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
