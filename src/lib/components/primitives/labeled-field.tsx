import type { ComponentProps, ForwardedRef } from 'react';
import { forwardRef } from 'react';
import { cn } from '../utilities';

const LabeledField = forwardRef(function LabeledFieldBase<T extends ComponentProps<'div'>>(
	{ children, className, ...restProps }: T,
	ref: ForwardedRef<T>
) {
	return (
		<div
			// eslint-disable-next-line @typescript-eslint/ban-ts-comment
			// @ts-ignore:next-line
			ref={ref}
			className={cn(
				'flex flex-col items-start gap-2 has-[:disabled]:opacity-50 cursor-default',
				className
			)}
			{...restProps}
		>
			{children}
		</div>
	);
});

export default LabeledField;
