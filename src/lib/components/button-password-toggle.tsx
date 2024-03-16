'use client';

import type { usePasswordReveal } from '@lib/hooks/password-reveal';
import { Eye, EyeOff } from 'lucide-react';
import type { ComponentProps, ReactNode } from 'react';
import { Button, ButtonIcon } from './primitives/button';
import { cn } from './utilities';

export default function ButtonPasswordToggle({
	children,
	reveal,
	toggle,
	className,
	...buttonProps
}: {
	children?: ReactNode;
} & ComponentProps<typeof Button> &
	Pick<ReturnType<typeof usePasswordReveal>, 'reveal' | 'toggle'>) {
	return (
		<Button
			type="button"
			{...buttonProps}
			className={cn('aspect-square', className)}
			onClick={toggle}
		>
			{children ? children : <ButtonIcon icon={reveal ? EyeOff : Eye} />}
		</Button>
	);
}
