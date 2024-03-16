import ScatteredNodes from '@lib/components/scattered-nodes';
import { ClipboardList, LayoutDashboard, Star } from 'lucide-react';

export default async function Page() {
	return (
		<>
			<div className="absolute inset-0 -z-10 overflow-hidden rounded-[inherit]">
				<div className="fixed h-full w-full text-accent">
					<ScatteredNodes
						count={50}
						pool={[Star, ClipboardList, LayoutDashboard].map((Node) => (
							<Node
								className="aspect-square h-20 w-20 animate-puff-grow rounded-lg bg-background p-5 duration-1000 ease-out animate-in zoom-in-50 fill-mode-both"
								vectorEffect="non-scaling-stroke"
								strokeWidth={1.25}
								key="a"
							/>
						))}
						scale={() => 1}
						rotate={() => `${Number(Math.random().toFixed(2))}turn`}
					/>
				</div>
				<div className="fixed h-full w-full">
					<ScatteredNodes
						count={20}
						pool={['👋', '🌟', '⭐'].map((emoji) => (
							<div
								className="aspect-square rounded-full bg-background p-2 text-6xl duration-500 animate-in zoom-in-50 spin-in-45 fill-mode-both"
								key="emoji"
							>
								<span className="opacity-20">{emoji}</span>
							</div>
						))}
						scale={() => Math.random() * 2 + 0.25}
						rotate={() => `${Number(Math.random().toFixed(2))}turn`}
					/>
				</div>
			</div>
		</>
	);
}
