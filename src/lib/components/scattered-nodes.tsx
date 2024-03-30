import type { ReactNode } from 'react';

type AngleUnit = 'deg' | 'turn' | 'rad';

export default function ScatteredNodes<const TRender extends ReactNode | ReactNode[]>({
	pool,
	count = 50,
	stagger = (i) => i * 25,
	fontSize = () => `${Number((Math.random() * 10 + 0.5).toFixed(2))}rem`,
	scale = () => 0.5 + Math.random(),
	rotate = () => `${Math.random() - 0.5} ${Math.random() - 0.5} ${Math.random() - 0.5} ${0.1}turn`,
	zIndex = () => Math.round(Math.random() * 100) - 50,
	opacity,
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
}) {
	// const scattered = useMemo(() => {
	// 	const arr: ReactNode[] = Array.isArray(pool) ? pool : [pool];
	// 	return new Array(count).fill(null).map((_, i) => {
	// 		const node = arr[Math.floor(Math.random() * arr.length)];
	// 		return {
	// 			node,
	// 			style: {
	// 				top: `${(Math.random() * 100).toFixed(2)}%`,
	// 				left: `${(Math.random() * 100).toFixed(2)}%`,
	// 				transitionDuration: '500ms',
	// 				animationDelay: `${stagger(i)}ms`,
	// 				fontSize: fontSize(i),
	// 				scale: scale && scale(i),
	// 				rotate: rotate && rotate(i),
	// 				zIndex: zIndex(i),
	// 				opacity: opacity && opacity(i),
	// 			},
	// 		};
	// 	});
	// }, [pool, count, stagger, fontSize, scale, rotate, zIndex, opacity]);
	const poolArr: ReactNode[] = Array.isArray(pool) ? pool : [pool];
	const scattered = new Array(count).fill(null).map((_, i) => {
		const node = poolArr[Math.floor(Math.random() * poolArr.length)];
		return {
			node,
			style: {
				top: `${(Math.random() * 100).toFixed(2)}%`,
				left: `${(Math.random() * 100).toFixed(2)}%`,
				transitionDuration: '500ms',
				animationDelay: `${stagger(i)}ms`,
				fontSize: fontSize(i),
				scale: scale && scale(i),
				rotate: rotate && rotate(i),
				zIndex: zIndex(i),
				opacity: opacity && opacity(i),
			},
		};
	});
	return (
		<>
			{scattered.map((item, i) => (
				<div key={i} className="absolute transition-all" style={item.style}>
					{item.node}
				</div>
			))}
		</>
	);
}
