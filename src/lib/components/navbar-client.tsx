'use client';

import { Monitor, Moon, Sun, Translate } from '@phosphor-icons/react';
import * as m from '@translations/messages';
import { useTheme } from 'next-themes';
import Link from 'next/link';
import { LANG_NAMES } from '../i18n/constants';
import { availableLanguageTags } from '../i18n/generated/runtime';
import NavbarButton from './navbar-button';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from './primitives/dropdown-menu';

export function NavbarLangSwitch() {
	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<NavbarButton className="aspect-square px-0">
					<Translate className="h-[1.2rem] w-[1.2rem]" weight="bold" />
					<span className="sr-only">{m.navbar_change_language()}</span>
				</NavbarButton>
			</DropdownMenuTrigger>
			<DropdownMenuContent>
				{availableLanguageTags.map((tag) => (
					<DropdownMenuItem key={tag} asChild>
						<Link href={tag} hrefLang={tag}>
							{LANG_NAMES[tag]}
						</Link>
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
				<NavbarButton className="aspect-square px-0">
					<Sun
						className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0"
						weight="bold"
					/>
					<Moon
						className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100"
						weight="bold"
					/>
					<span className="sr-only">{m.navbar_toggle_theme()}</span>
				</NavbarButton>
			</DropdownMenuTrigger>
			<DropdownMenuContent>
				<DropdownMenuItem onClick={() => setTheme('light')}>
					<Sun className="h-[1em] w-[1em]" weight="bold" />
					{m.theme_light()}
				</DropdownMenuItem>
				<DropdownMenuItem onClick={() => setTheme('dark')}>
					<Moon className="h-[1em] w-[1em]" weight="bold" />
					{m.theme_dark()}
				</DropdownMenuItem>
				<DropdownMenuItem onClick={() => setTheme('system')}>
					<Monitor className="h-[1em] w-[1em]" weight="bold" />
					{m.theme_system()}
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
