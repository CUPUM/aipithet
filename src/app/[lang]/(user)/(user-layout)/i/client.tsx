'use client';

import { cn } from '@lib/components/utilities';
import Link from '@lib/i18n/Link';
import { removeLang } from '@lib/i18n/utilities';
import { usePathname } from 'next/navigation';
import type { ComponentProps } from 'react';
import { useMemo } from 'react';

export function DashboardNavbarButton({
	className,
	href,
	children,
	...restProps
}: ComponentProps<typeof Link>) {
	const pathname = usePathname();
	const noLang = useMemo(() => removeLang(pathname), [pathname]);
	const current = useMemo(() => (noLang === href ? 'page' : undefined), [noLang, href]);
	return (
		<Link
			{...restProps}
			href={href}
			className={cn(
				'group/button font-medium text-foreground/85 px-4 py-3 flex flex-row gap-2 rounded-sm aria-[current=page]:bg-accent aria-[current=page]:text-accent-foreground hover:text-primary aria-[current=page]:pointer-events-none hover:bg-accent/35 animate-in duration-350 ease-out fade-in-0 slide-in-from-bottom-1 fill-mode-both',
				className
			)}
			aria-current={current}
		>
			{children}
		</Link>
	);
}
