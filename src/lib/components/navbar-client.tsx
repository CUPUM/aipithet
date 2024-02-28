'use client';

import { useUser } from '@lib/auth/user-provider-client';
import Link from '@lib/i18n/Link';
import { removeLang } from '@lib/i18n/utils';
import * as m from '@translations/messages';
import { Languages, LogIn, LogOut, Monitor, Moon, Sun, User, UserPlus } from 'lucide-react';
import { useTheme } from 'next-themes';
import { usePathname, useSearchParams } from 'next/navigation';
import { useMemo } from 'react';
import { LANG_NAMES } from '../i18n/constants';
import { availableLanguageTags } from '../i18n/generated/runtime';
import NavbarButton from './navbar-button';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from './primitives/dropdown-menu';

export function NavbarUserMenu() {
	function signout() {
		console.log('Implement server action');
	}

	const user = useUser();
	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<NavbarButton className="aspect-square px-0">
					<User className="h-[1.25em] w-[1.25em]" strokeWidth={2.5} />
				</NavbarButton>
			</DropdownMenuTrigger>
			<DropdownMenuContent collisionPadding={12}>
				{user ? (
					<DropdownMenuItem onClick={signout}>
						<LogOut className="h-[1.25em] w-[1.25em] mr-2" strokeWidth={2.5} />
						{m.signout()}
					</DropdownMenuItem>
				) : (
					<>
						<DropdownMenuItem asChild>
							<Link href="/signup">
								<UserPlus className="h-[1.25em] w-[1.25em] mr-2" strokeWidth={2.5} />
								{m.signup()}
							</Link>
						</DropdownMenuItem>
						<DropdownMenuItem asChild>
							<Link href="/signin">
								<LogIn className="h-[1.25em] w-[1.25em] mr-2" strokeWidth={2.5} />
								{m.signin()}
							</Link>
						</DropdownMenuItem>
					</>
				)}
			</DropdownMenuContent>
		</DropdownMenu>
	);
}

export function NavbarLangSwitch() {
	const pathname = usePathname();
	const searchParams = useSearchParams();
	const noLang = useMemo(() => removeLang(`${pathname}`), [pathname, searchParams]);
	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<NavbarButton className="aspect-square px-0">
					<Languages className="h-[1.25em] w-[1.25em]" strokeWidth={2.5} />
					<span className="sr-only">{m.navbar_change_language()}</span>
				</NavbarButton>
			</DropdownMenuTrigger>
			<DropdownMenuContent collisionPadding={12}>
				{availableLanguageTags.map((tag) => (
					<DropdownMenuItem key={tag} asChild>
						<Link href={noLang} hrefLang={tag}>
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
						className="h-[1.35em] w-[1.35em] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0"
						strokeWidth={2.5}
					/>
					<Moon
						className="absolute h-[1.25em] w-[1.25em] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100"
						strokeWidth={2.5}
					/>
					<span className="sr-only">{m.navbar_toggle_theme()}</span>
				</NavbarButton>
			</DropdownMenuTrigger>
			<DropdownMenuContent collisionPadding={12}>
				<DropdownMenuItem onClick={() => setTheme('light')}>
					<Sun className="h-[1.25em] w-[1.25em] mr-2" strokeWidth={2.5} />
					{m.theme_light()}
				</DropdownMenuItem>
				<DropdownMenuItem onClick={() => setTheme('dark')}>
					<Moon className="h-[1.25em] w-[1.25em] mr-2" strokeWidth={2.5} />
					{m.theme_dark()}
				</DropdownMenuItem>
				<DropdownMenuItem onClick={() => setTheme('system')}>
					<Monitor className="h-[1.25em] w-[1.25em] mr-2" strokeWidth={2.5} />
					{m.theme_system()}
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
