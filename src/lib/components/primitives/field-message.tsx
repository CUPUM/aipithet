import { forwardRef } from 'react';
import { cn } from '../utilities';

export const FieldMessage = forwardRef(function InputMessageBase<
	T extends React.ComponentProps<'label'> & { type: 'error' | 'success' | 'notice' },
>({ children, className, ...restProps }: T, ref: React.ForwardedRef<T>) {
	return (
		<label
			// eslint-disable-next-line @typescript-eslint/ban-ts-comment
			// @ts-ignore:next-line
			ref={ref}
			className={cn(
				'inline-flex items-center justify-center whitespace-nowrap rounded-full text-sm font-semibold ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground h-11 px-4 data-[state=open]:text-accent-foreground data-[state=open]:bg-accent',
				className
			)}
			{...restProps}
		>
			{children}
		</label>
	);
});
