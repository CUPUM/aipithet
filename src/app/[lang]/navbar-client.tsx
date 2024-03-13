'use client';

import { useUser } from '@lib/auth/user-provider-client';
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
	UserCircle,
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
	DropdownMenuItemIcon,
	DropdownMenuItemIconLoading,
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
						<DropdownMenuGroup>
							<DropdownMenuItem asChild>
								<Link href="/i">
									<DropdownMenuItemIcon icon={UserCircle} />
									{m.my_account()}
								</Link>
							</DropdownMenuItem>
						</DropdownMenuGroup>
						<DropdownMenuSeparator />
						<DropdownMenuGroup>
							<DropdownMenuItem
								onClick={() => {
									startTransition(() => logout());
								}}
								disabled={isPending}
								data-loading={isPending}
							>
								<DropdownMenuItemIconLoading icon={LogOut} />
								{m.signout()}
							</DropdownMenuItem>
						</DropdownMenuGroup>
					</>
				) : (
					<>
						<DropdownMenuItem asChild>
							<Link href="/signup">
								<DropdownMenuItemIcon icon={UserPlus} />
								{m.signup()}
							</Link>
						</DropdownMenuItem>
						<DropdownMenuItem asChild>
							<Link href="/login">
								<DropdownMenuItemIcon icon={LogIn} />
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
						<DropdownMenuItemIcon
							icon={CircleDashed}
							className="opacity-20 group-data-[selected]:hidden"
						/>
						<DropdownMenuItemIcon
							icon={Languages}
							className="opacity-100 hidden group-data-[selected]:block"
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
				<DropdownMenuItemIcon icon={Sun} className="opacity-20 light:opacity-100" />
				{m.theme_light()}
			</DropdownMenuItem>
			<DropdownMenuItem
				onClick={() => setTheme('dark')}
				className="dark:font-semibold"
				onSelect={(e) => e.preventDefault()}
			>
				<DropdownMenuItemIcon icon={Moon} className="opacity-20 dark:opacity-100" />
				{m.theme_dark()}
			</DropdownMenuItem>
			<DropdownMenuItem
				onClick={() => setTheme(theme === 'system' ? resolvedTheme ?? 'system' : 'system')}
				className="group"
				data-selected={theme === 'system' || undefined}
				onSelect={(e) => e.preventDefault()}
			>
				<DropdownMenuItemIcon
					icon={Monitor}
					className="opacity-20 group-data-[selected]:opacity-100"
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
