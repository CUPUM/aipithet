'use client';

import type { ComponentProps, ReactNode } from 'react';
import { useMemo } from 'react';
import { useFormStatus } from 'react-dom';
import { Button } from './primitives/button';

export default function ButtonSubmit({
	children,
	...buttonProps
}: { children?: ReactNode } & ComponentProps<typeof Button>) {
	const { pending, action } = useFormStatus();
	const isCurrentAction = useMemo(
		() => (buttonProps.formAction ? pending && buttonProps.formAction === action : pending),
		[buttonProps.formAction, action, pending]
	);
	return (
		<Button disabled={pending} data-loading={isCurrentAction} type="submit" {...buttonProps}>
			{children}
		</Button>
	);
}
