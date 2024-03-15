'use client';

import { useRouter } from 'next/router';
import type { ComponentProps, ReactNode } from 'react';
import { Button } from './primitives/button';

export default function ButtonBack({
	children,
	...buttonProps
}: { children?: ReactNode } & ComponentProps<typeof Button>) {
	const router = useRouter();
	return (
		<Button onClick={() => router.back()} {...buttonProps}>
			{children}
		</Button>
	);
}
