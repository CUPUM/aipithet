import Link from '@lib/i18n/Link';
import { forwardRef, type ComponentProps, type ForwardedRef } from 'react';
import { cn } from './utils';

const NavbarButton = forwardRef(function NavbarButtonBase<
	T extends ComponentProps<typeof Link> | ComponentProps<'button'>,
>({ children, className, ...restProps }: T, ref: ForwardedRef<T>) {
	const Component = 'href' in restProps ? Link : 'button';
	return (
		<Component
			// eslint-disable-next-line @typescript-eslint/ban-ts-comment
			// @ts-ignore:next-line
			ref={ref}
			className={cn(
				'inline-flex items-center justify-center whitespace-nowrap rounded-full text-sm font-semibold ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground h-11 px-4',
				className
			)}
			{...restProps}
		>
			{children}
		</Component>
	);
});

export default NavbarButton;
