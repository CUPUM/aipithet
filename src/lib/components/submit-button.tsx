'use client';

import type { ComponentProps, ReactNode } from 'react';
import { useFormStatus } from 'react-dom';
import { Button } from './primitives/button';

export function SubmitButton({
	children,
	...buttonProps
}: { children?: ReactNode } & ComponentProps<typeof Button>) {
	const { pending } = useFormStatus();
	return (
		<Button disabled={pending} data-loading={pending} type="submit" {...buttonProps}>
			{children}
		</Button>
	);
}
