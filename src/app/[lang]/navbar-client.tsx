'use client';

import { useUser } from '@lib/auth/user-provider-client';
import { Spinner } from '@lib/components/primitives/spinner';
import Link from '@lib/i18n/Link';
import * as m from '@translations/messages';
import {
	CircleDashed,
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
import { useMemo, useTransition } from 'react';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from '../../lib/components/primitives/dropdown-menu';
import { LANG_NAMES } from '../../lib/i18n/constants';
import { availableLanguageTags, languageTag } from '../../lib/i18n/generated/runtime';
import { logout } from './(auth)/server';
import NavbarButton from './navbar-button';

export function NavbarUserMenu() {
	const user = useUser();
	const [isPending, startTransition] = useTransition();

	return (
		<DropdownMenu modal={false}>
			<DropdownMenuTrigger asChild>
				<NavbarButton className="aspect-square px-0">
					{user ? (
						<span className="uppercase">{user.email.charAt(0)}</span>
					) : (
						<User className="h-[1.25em] w-[1.25em]" strokeWidth={2.5} />
					)}
				</NavbarButton>
			</DropdownMenuTrigger>
			<DropdownMenuContent collisionPadding={12}>
				{user ? (
					<>
						<DropdownMenuItem
							onClick={() => {
								startTransition(() => logout());
							}}
							disabled={isPending}
						>
							{isPending ? (
								<Spinner className="h-[1.25em] w-[1.25em] mr-3" />
							) : (
								<LogOut className="h-[1.25em] w-[1.25em] opacity-50 mr-3" strokeWidth={2.5} />
							)}
							{m.signout()}
						</DropdownMenuItem>
					</>
				) : (
					<>
						<DropdownMenuItem asChild>
							<Link href="/signup">
								<UserPlus className="h-[1.25em] w-[1.25em] opacity-50 mr-3" strokeWidth={2.5} />
								{m.signup()}
							</Link>
						</DropdownMenuItem>
						<DropdownMenuItem asChild>
							<Link href="/login">
								<LogIn className="h-[1.25em] w-[1.25em] opacity-50 mr-3" strokeWidth={2.5} />
								{m.login()}
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
				<DropdownMenuItem
					key={lang}
					asChild
					data-selected={lang === languageTag() || undefined}
					className="group data-[selected]:font-semibold"
				>
					<Link href={currentUrl} hrefLang={lang}>
						<CircleDashed
							strokeWidth={2.5}
							className="h-[1.25em] w-[1.25em] mr-3 opacity-25 group-data-[selected]:hidden"
						/>
						<Languages
							className="h-[1.25em] w-[1.25em] mr-3 hidden group-data-[selected]:block"
							strokeWidth={2.5}
						/>
						{LANG_NAMES[lang]}
					</Link>
				</DropdownMenuItem>
			))}
		</DropdownMenuGroup>
	);
}

function NavbarThemeToggle() {
	const { theme, setTheme, resolvedTheme } = useTheme();

	return (
		<DropdownMenuGroup>
			<DropdownMenuLabel>{m.navbar_choose_theme()}</DropdownMenuLabel>
			<DropdownMenuItem
				onClick={() => setTheme('light')}
				className="light:font-semibold"
				onSelect={(e) => e.preventDefault()}
			>
				<Sun
					className="h-[1.25em] w-[1.25em] mr-3 opacity-25 light:opacity-100"
					strokeWidth={2.75}
				/>
				{m.theme_light()}
			</DropdownMenuItem>
			<DropdownMenuItem
				onClick={() => setTheme('dark')}
				className="dark:font-semibold"
				onSelect={(e) => e.preventDefault()}
			>
				<Moon
					className="h-[1.25em] w-[1.25em] mr-3 opacity-25 dark:opacity-100"
					strokeWidth={2.5}
				/>
				{m.theme_dark()}
			</DropdownMenuItem>
			<DropdownMenuItem
				onClick={() => setTheme(theme === 'system' ? resolvedTheme ?? 'system' : 'system')}
				className="group"
				data-selected={theme === 'system' || undefined}
				onSelect={(e) => e.preventDefault()}
			>
				<Monitor
					className="h-[1.25em] w-[1.25em] mr-3 opacity-25 group-data-[selected]:opacity-100"
					strokeWidth={2.5}
				/>
				{m.theme_system()}
			</DropdownMenuItem>
		</DropdownMenuGroup>
	);
}

export function NavbarSettingsMenu() {
	return (
		<DropdownMenu modal={false}>
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
