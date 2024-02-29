'use client';

import { useUser } from '@lib/auth/user-provider-client';
import Link from '@lib/i18n/Link';
import * as m from '@translations/messages';
import {
	Languages,
	LogIn,
	LogOut,
	Monitor,
	Moon,
	Settings,
	Sun,
	User,
	UserPlus,
} from 'lucide-react';
import { useTheme } from 'next-themes';
import { usePathname, useSearchParams } from 'next/navigation';
import { useMemo } from 'react';
import { LANG_NAMES } from '../i18n/constants';
import { availableLanguageTags } from '../i18n/generated/runtime';
import NavbarButton from './navbar-button';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
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

function NavbarLangSwitch() {
	const pathname = usePathname();
	const searchParams = useSearchParams();
	const currentUrl = useMemo(
		() => `${pathname}${searchParams.size ? `?${searchParams.toString()}` : ''}`,
		[pathname, searchParams]
	);
	return (
		<DropdownMenuGroup>
			<DropdownMenuLabel>{m.navbar_choose_language()}</DropdownMenuLabel>
			{availableLanguageTags.map((lang) => (
				<DropdownMenuItem key={lang} asChild data-current>
					<Link href={currentUrl} hrefLang={lang} className="justify-between">
						{LANG_NAMES[lang]}
						<Languages
							className={`h-[1.25em] w-[1.25em] opacity-0 ${lang}:opacity-100`}
							strokeWidth={2.5}
						/>
					</Link>
				</DropdownMenuItem>
			))}
		</DropdownMenuGroup>
	);
}

function NavbarThemeToggle() {
	const { theme, setTheme } = useTheme();
	console.log(theme);

	return (
		<DropdownMenuGroup>
			<DropdownMenuLabel>{m.navbar_choose_theme()}</DropdownMenuLabel>
			<DropdownMenuItem onClick={() => setTheme('light')}>
				<Sun
					className="h-[1.25em] w-[1.25em] mr-2 opacity-25 light:opacity-100"
					strokeWidth={2.75}
				/>
				{m.theme_light()}
			</DropdownMenuItem>
			<DropdownMenuItem onClick={() => setTheme('dark')}>
				<Moon
					className="h-[1.25em] w-[1.25em] mr-2 opacity-25 dark:opacity-100"
					strokeWidth={2.5}
				/>
				{m.theme_dark()}
			</DropdownMenuItem>
			<DropdownMenuItem
				onClick={() => setTheme('system')}
				className="group"
				data-selected={theme === 'system' || undefined}
			>
				<Monitor
					className="h-[1.25em] w-[1.25em] mr-2 opacity-25 group-data-[selected]:opacity-100"
					strokeWidth={2.5}
				/>
				{m.theme_system()}
			</DropdownMenuItem>
		</DropdownMenuGroup>
	);
}

export function NavbarSettingsMenu() {
	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<NavbarButton className="aspect-square px-0">
					<Settings className="h-[1.25em] w-[1.25em]" strokeWidth={2.5} />
					<span className="sr-only">{m.settings()}</span>
				</NavbarButton>
			</DropdownMenuTrigger>
			<DropdownMenuContent collisionPadding={12}>
				<NavbarLangSwitch />
				<DropdownMenuSeparator />
				<NavbarThemeToggle />
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
