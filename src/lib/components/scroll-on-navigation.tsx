'use client';

import { usePathname } from 'next/navigation';
import { useEffect, useRef } from 'react';

/**
 * Next/navigation's link scroll option only enables auto scroll-to-top on body after navigations,
 * but in some cases with nested layouts, we might wish to scroll a nested container back to its top
 * after navigation. Add this component inside a container to replicate the behavior.
 */
export default function ScrollOnNavigation({ top = 0, left }: ScrollToOptions = {}) {
	const ref = useRef<HTMLDivElement>(null);
	const pathname = usePathname();

	useEffect(() => ref.current?.parentElement?.scrollTo({ top, left }), [pathname, ref]);

	return <div ref={ref} className="hidden" />;
}
