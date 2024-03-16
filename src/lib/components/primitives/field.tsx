import type { ComponentProps, ForwardedRef } from 'react';
import { forwardRef } from 'react';
import { cn } from '../utilities';

const Field = forwardRef(function LabeledFieldBase<T extends ComponentProps<'div'>>(
	{ children, className, ...restProps }: T,
	ref: ForwardedRef<T>
) {
	return (
		<div
			// eslint-disable-next-line @typescript-eslint/ban-ts-comment
			// @ts-ignore:next-line
			ref={ref}
			className={cn(
				'flex cursor-default flex-col items-stretch gap-2 has-[:disabled]:opacity-50',
				className
			)}
			{...restProps}
		>
			{children}
		</div>
	);
});

export default Field;
