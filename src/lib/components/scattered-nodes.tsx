import type { ComponentProps, ReactNode } from 'react';
import { cn } from './utilities';

type AngleUnit = 'deg' | 'turn' | 'rad';

export function ScatteredNodes<const TRender extends ReactNode | ReactNode[]>({
	className,
	style,
	pool,
	count = 20,
	stagger = (i) => i * 10,
	fontSize = () => `${Number((Math.random() * 10 + 0.5).toFixed(2))}rem`,
	scale,
	rotate = () => `${Math.random() - 0.5} ${Math.random() - 0.5} ${Math.random() - 0.5} ${0.1}turn`,
	zIndex = () => Math.round(Math.random() * 100) - 50,
	opacity,
	...divProps
}: {
	pool: TRender;
	count?: number;
	fontSize?: (index: number) => `${number}${'%' | 'rem' | 'px' | 'em' | 'ch'}`;
	stagger?: (index: number) => number;
	scale?: (index: number) => number;
	opacity?: (index: number) => number;
	rotate?: (
		index: number
	) =>
		| `${number}${AngleUnit}`
		| `${'x ' | 'y ' | 'z ' | ''}${number}${AngleUnit}`
		| `${number} ${number} ${number} ${number}${AngleUnit}`;
	zIndex?: (index: number) => number;
} & ComponentProps<'div'>) {
	const arr: ReactNode[] = Array.isArray(pool) ? pool : [pool];
	const scattered = new Array(count).fill(null).map(() => {
		const node = arr[Math.floor(Math.random() * arr.length)];
		return {
			node,
			top: `${(Math.random() * 100).toFixed(2)}%`,
			left: `${(Math.random() * 100).toFixed(2)}%`,
		};
	});
	const sharedClassName = cn('absolute', className);
	return (
		<>
			{scattered.map((item, i) => (
				<div
					suppressHydrationWarning
					key={i}
					className={sharedClassName}
					style={{
						...style,
						top: item.top,
						left: item.left,
						animationDelay: style?.animationDelay ?? `${stagger(i)}ms`,
						fontSize: style?.fontSize ?? fontSize(i),
						scale: style?.scale ?? (scale && scale(i)),
						rotate: style?.rotate ?? (rotate && rotate(i)),
						zIndex: style?.zIndex ?? zIndex(i),
						opacity: style?.opacity ?? (opacity && opacity(i)),
						...style,
					}}
					{...divProps}
				>
					{item.node}
				</div>
			))}
		</>
	);
}
