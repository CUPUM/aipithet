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
				'flex flex-row shrink-0 px-4 rounded-full bg-accent justify-center items-center ring-ring h-12 font-medium',
				className
			)}
			{...restProps}
		>
			{children}
		</Component>
	);
});

export default NavbarButton;
