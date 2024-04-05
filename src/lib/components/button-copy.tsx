'use client';

import { Check, Copy } from 'lucide-react';
import type { ComponentProps, ReactNode } from 'react';
import { useEffect, useState } from 'react';
import { Button, ButtonIcon } from './primitives/button';
import { cn } from './utilities';

/**
 * @todo Add tooltip.
 */
export default function ButtonCopy({
	children,
	copyText,
	className,
	...buttonProps
}: {
	children?: ReactNode;
	copyText: string;
} & ComponentProps<typeof Button>) {
	const [copied, setCopied] = useState(0);
	useEffect(() => {
		if (copied) {
			const timer = setTimeout(() => setCopied(0), 2000);
			return () => {
				clearTimeout(timer);
			};
		}
	}, [copied]);
	function copy() {
		navigator.clipboard.writeText(copyText);
		setCopied((v) => ++v);
	}
	return (
		<Button
			type="button"
			size="sm"
			{...buttonProps}
			className={cn({ 'aspect-square': !children }, 'rounded-[.75rem]', className)}
			onClick={copy}
			variant="secondary"
			data-copied={copied || undefined}
		>
			{children ? (
				children
			) : (
				<>
					<ButtonIcon
						className="hidden size-4 animate-pulse stroke-green-500 duration-700 group-data-[copied]/button:block"
						icon={Check}
					/>
					<ButtonIcon
						className="size-4 animate-puff-grow duration-500 group-data-[copied]/button:hidden"
						icon={Copy}
					/>
				</>
			)}
		</Button>
	);
}
