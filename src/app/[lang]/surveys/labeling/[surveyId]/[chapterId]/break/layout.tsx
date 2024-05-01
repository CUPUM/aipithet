import ScatteredNodes from '@lib/components/scattered-nodes';
import { Accessibility, Activity, Coffee, GlassWater, Heart, Hourglass } from 'lucide-react';
import type { ReactNode } from 'react';

export default function Layout(props: { children: ReactNode }) {
	return (
		<>
			<div className="absolute inset-0 -z-10 overflow-hidden rounded-[inherit]">
				<div className="fixed h-full w-full text-border">
					<ScatteredNodes
						count={80}
						pool={[Hourglass, Activity, Heart, Accessibility, Coffee, GlassWater].map((Node) => (
							<Node
								className="aspect-square h-20 w-20 animate-puff-grow rounded-lg bg-background p-5 duration-1000 ease-out animate-in zoom-in-50 fill-mode-both"
								vectorEffect="non-scaling-stroke"
								strokeWidth={1.5}
								key="a"
							/>
						))}
						scale={() => 1}
						rotate={() => `${Number(Math.random().toFixed(2))}turn`}
					/>
				</div>
			</div>
			{props.children}
		</>
	);
}
