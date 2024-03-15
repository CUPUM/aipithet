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
				'group/button duration-250 flex flex-row gap-2 text-nowrap rounded-md border border-transparent px-5 py-4 font-semibold text-foreground/80 transition-all ease-out animate-in fade-in-0 slide-in-from-bottom-1 fill-mode-both hover:bg-primary/5 hover:text-primary aria-[current]:pointer-events-none aria-[current]:sticky aria-[current]:left-0 aria-[current]:right-0 aria-[current]:z-10 aria-[current]:border-accent aria-[current]:bg-background aria-[current]:text-primary aria-[current]:shadow-[0_0_30px_15px] aria-[current]:shadow-background md:aria-[current]:shadow-none',
				className
			)}
			aria-current={current}
		>
			{children}
		</Link>
	);
}
