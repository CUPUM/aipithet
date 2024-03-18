import { Button, ButtonIcon } from '@lib/components/primitives/button';
import ScatteredNodes from '@lib/components/scattered-nodes';
import * as m from '@translations/messages';
import { AsteriskSquare, Cog, Mail, Sliders, UserCog, Wrench } from 'lucide-react';
import { EmailUpdateForm, PasswordUpdateForm } from './client';

export default function Page() {
	return (
		<>
			<div className="absolute inset-0 -z-10 overflow-hidden rounded-[inherit]">
				<div className="fixed h-full w-full text-accent">
					<ScatteredNodes
						count={80}
						pool={[AsteriskSquare, Wrench, UserCog, Sliders, Cog].map((Node) => (
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
			<div className="flex w-full max-w-screen-md flex-1 flex-col items-stretch justify-center gap-4 self-center p-2">
				<PasswordUpdateForm />
				<EmailUpdateForm />
				<section
					className="flex animate-fly-up flex-col gap-4 rounded-lg border border-border bg-background p-8 delay-500 fill-mode-both"
					style={{ animationDelay: '200ms' }}
				>
					<h1 className="mb-2 text-lg font-semibold">{m.help_needed()}?</h1>
					<p className="text-muted-foreground">{m.help_needed_body()}</p>
					<Button asChild className="self-end">
						<a
							href={`mailto:emmanuel.beaudry.marchand@umontreal.ca;hugo.berard@umontreal.ca?subject=${encodeURIComponent('Support Aipithet: ' + m.help_needed())}`}
						>
							<ButtonIcon icon={Mail} />
							{m.write_us()}
						</a>
					</Button>
				</section>
			</div>
		</>
	);
}
