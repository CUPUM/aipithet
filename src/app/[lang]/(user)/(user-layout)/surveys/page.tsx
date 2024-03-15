import { ScatteredNodes } from '@lib/components/scattered-nodes';
import { File, FolderPen, Tag, Ticket } from 'lucide-react';
import { SurveyCreateForm, SurveyInvitationClaimForm } from './client';

export default function Page() {
	return (
		<>
			<div className="absolute inset-0 -z-10 overflow-hidden rounded-[inherit]">
				<div className="fixed h-full w-full text-accent">
					<ScatteredNodes
						count={80}
						pool={[
							<File
								className="aspect-square h-20 w-20 animate-puff-grow rounded-lg bg-background p-5 duration-1000 ease-out animate-in zoom-in-50 fill-mode-both"
								vectorEffect="non-scaling-stroke"
								strokeWidth={1.25}
								key="a"
							/>,
							<FolderPen
								className="aspect-square h-20 w-20 animate-puff-grow rounded-lg bg-background p-5 duration-1000 ease-out animate-in zoom-in-50 fill-mode-both"
								vectorEffect="non-scaling-stroke"
								strokeWidth={1.25}
								key="a"
							/>,
							<Tag
								className="aspect-square h-20 w-20 animate-puff-grow rounded-lg bg-background p-5 duration-1000 ease-out animate-in zoom-in-50 fill-mode-both"
								vectorEffect="non-scaling-stroke"
								strokeWidth={1.25}
								key="b"
							/>,
							<Ticket
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
			<div className="flex w-full max-w-screen-md flex-1 flex-col items-stretch justify-center gap-5 self-center">
				<SurveyInvitationClaimForm />
				<SurveyCreateForm />
			</div>
		</>
	);
}
