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
	const hrefString = useMemo(() => (typeof href === 'string' ? href : href.pathname ?? ''), [href]);
	const noLang = useMemo(() => removeLang(pathname), [pathname]);
	const current = useMemo(
		() => (noLang === hrefString || noLang.startsWith(hrefString + '/') ? 'page' : undefined),
		[noLang, hrefString]
	);
	return (
		<Link
			{...restProps}
			href={href}
			className={cn(
				'group/button duration-250 flex h-12 flex-row items-center gap-2 text-nowrap rounded-md border border-transparent px-5 font-semibold text-foreground/80 ring-offset-background transition-all ease-out animate-in fade-in-0 slide-in-from-bottom-1 fill-mode-both hover:bg-primary/5 hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 aria-[current]:pointer-events-none aria-[current]:sticky aria-[current]:left-0 aria-[current]:right-0 aria-[current]:z-10 aria-[current]:border-accent aria-[current]:bg-background aria-[current]:text-primary aria-[current]:shadow-[0_0_30px_15px] aria-[current]:shadow-background md:aria-[current]:shadow-none',
				className
			)}
			aria-current={current}
		>
			{children}
		</Link>
	);
}
