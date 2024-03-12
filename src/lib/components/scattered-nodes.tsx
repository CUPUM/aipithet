import type { ReactNode } from 'react';

type AngleUnit = 'deg' | 'turn' | 'rad';

export function ScatteredNodes<const TRender extends ReactNode | ReactNode[]>({
	pool,
	count = 200,
	stagger = (i) => i * 20,
	fontSize = () => `${Number((Math.random() * 10 + 0.5).toFixed(2))}rem`,
	scale,
	rotate = () => `${Math.random() - 0.5} ${Math.random() - 0.5} ${Math.random() - 0.5} ${0.25}turn`,
}: {
	pool: TRender;
	count?: number;
	fontSize?: (index: number) => `${number}${'%' | 'rem' | 'px' | 'em' | 'ch'}`;
	stagger?: (index: number) => number;
	scale?: (index: number) => number;
	rotate?: (
		index: number
	) =>
		| `${number}${AngleUnit}`
		| `${'x ' | 'y ' | 'z ' | ''}${number}${AngleUnit}`
		| `${number} ${number} ${number} ${number}${AngleUnit}`;
}) {
	const arr: ReactNode[] = Array.isArray(pool) ? pool : [pool];
	const scattered = new Array(count).fill(null).map(() => {
		const node = arr[Math.floor(Math.random() * arr.length)];
		return {
			node,
			top: `${(Math.random() * 100).toFixed(2)}%`,
			left: `${(Math.random() * 100).toFixed(2)}%`,
		};
	});
	return (
		<>
			{scattered.map((item, i) => (
				<div
					key={i}
					className="absolute"
					style={{
						top: item.top,
						left: item.left,
						animationDelay: `${stagger(i)}ms`,
						fontSize: fontSize(i),
						scale: scale && scale(i),
						rotate: rotate && rotate(i),
					}}
				>
					{item.node}
				</div>
			))}
		</>
	);
}
