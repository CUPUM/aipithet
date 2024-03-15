import { ScatteredNodes } from '@lib/components/scattered-nodes';
import { AsteriskSquare, Sliders, UserCog, Wrench } from 'lucide-react';
import { EmailUpdateForm, PasswordUpdateForm } from './client';

export default function Page() {
	return (
		<>
			<div className="absolute inset-0 -z-10 overflow-hidden rounded-[inherit]">
				<div className="fixed h-full w-full text-accent">
					<ScatteredNodes
						count={80}
						pool={[
							<AsteriskSquare
								className="aspect-square h-20 w-20 animate-puff-grow rounded-lg bg-background p-5 duration-1000 ease-out animate-in zoom-in-50 fill-mode-both"
								vectorEffect="non-scaling-stroke"
								strokeWidth={1.25}
								key="a"
							/>,
							<Wrench
								className="aspect-square h-20 w-20 animate-puff-grow rounded-lg bg-background p-5 duration-1000 ease-out animate-in zoom-in-50 fill-mode-both"
								vectorEffect="non-scaling-stroke"
								strokeWidth={1.25}
								key="a"
							/>,
							<UserCog
								className="aspect-square h-20 w-20 animate-puff-grow rounded-lg bg-background p-5 duration-1000 ease-out animate-in zoom-in-50 fill-mode-both"
								vectorEffect="non-scaling-stroke"
								strokeWidth={1.25}
								key="b"
							/>,
							<Sliders
								className="aspect-square h-20 w-20 animate-puff-grow rounded-lg bg-background p-5 duration-1000 ease-out animate-in zoom-in-50 fill-mode-both"
								vectorEffect="non-scaling-stroke"
								strokeWidth={1.25}
								key="b"
							/>,
						]}
						scale={() => 1}
						rotate={() => `${Number(Math.random().toFixed(2))}turn`}
					/>
				</div>
			</div>
			<div className="flex w-full max-w-screen-md flex-1 flex-col items-stretch justify-center gap-4 self-center">
				<PasswordUpdateForm />
				<EmailUpdateForm />
			</div>
		</>
	);
}
