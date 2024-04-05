import { cn } from '@lib/components/utilities';
import { Slot } from '@radix-ui/react-slot';
import type { VariantProps } from 'class-variance-authority';
import { cva } from 'class-variance-authority';
import type { LucideIcon, LucideProps } from 'lucide-react';
import * as React from 'react';
import { Spinner } from './spinner';

const buttonVariants = cva(
	'group/button gap-[.75em] inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&.aspect-square]:px-0',
	{
		variants: {
			variant: {
				default: 'bg-primary text-primary-foreground hover:bg-primary/90',
				destructive:
					'text-destructive bg-destructive/5 border border-destructive/20 hover:bg-destructive/90 hover:text-destructive-foreground',
				outline: 'border border-input bg-transparent hover:bg-accent hover:text-accent-foreground',
				secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
				ghost: 'hover:bg-accent hover:text-accent-foreground',
				link: 'text-primary underline-offset-4 hover:underline',
			},
			size: {
				default: 'h-14 px-6 py-2',
				sm: 'h-10 rounded-full px-4',
				lg: 'h-16 rounded-md px-8 rounded-lg',
			},
		},
		defaultVariants: {
			variant: 'default',
			size: 'default',
		},
	}
);

export interface ButtonProps
	extends React.ButtonHTMLAttributes<HTMLButtonElement>,
		VariantProps<typeof buttonVariants> {
	asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
	({ className, variant, size, asChild = false, ...props }, ref) => {
		const Comp = asChild ? Slot : 'button';
		return (
			<Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />
		);
	}
);
Button.displayName = 'Button';

export { Button, buttonVariants };

export function ButtonIcon({
	icon: Icon,
	className,
	strokeWidth = 2.35,
	...restProps
}: { icon: LucideIcon } & LucideProps) {
	return (
		<Icon
			{...restProps}
			className={cn(
				'duration-350 h-[1.25em] w-[1.25em] opacity-30 transition-all ease-out group-hover/button:opacity-80 group-[.aspect-square]/button:opacity-75 group-aria-[current]/button:animate-pulse group-aria-[current]/button:text-current group-aria-[current]/button:opacity-100',
				className
			)}
			strokeWidth={strokeWidth}
		/>
	);
}

/**
 * A button icon replaced with loading spinner when parent button has loading state.
 */
export function ButtonIconLoading({
	className,
	icon,
	...iconProps
}: React.ComponentProps<typeof ButtonIcon>) {
	return (
		<>
			<Spinner
				{...iconProps}
				className={cn(
					'hidden h-[1.25em] w-[1.25em] group-data-[loading=true]/button:block',
					className
				)}
			/>
			<ButtonIcon
				{...iconProps}
				icon={icon}
				className={cn('animate-puff-grow group-data-[loading=true]/button:hidden', className)}
			/>
		</>
	);
}

export function ButtonIconSpace() {
	return <div className="invisible max-w-[1.25em] flex-1 select-none" />;
}
