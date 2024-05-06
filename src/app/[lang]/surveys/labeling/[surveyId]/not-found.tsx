import { Button, ButtonIcon } from '@lib/components/primitives/button';
import Link from '@lib/i18n/Link';
import * as m from '@translations/messages';
import { Undo2 } from 'lucide-react';

export default function NotFound() {
	return (
		<article className="flex flex-1 flex-col items-center justify-center gap-4 p-8">
			<div className="flex max-w-md flex-col gap-4 rounded-lg bg-background p-8 text-center">
				<h1 className="text-2xl font-semibold">{m.surveys_none_found()}</h1>
				<p className="text-muted-foreground">{m.survey_not_found_instructions()}</p>
				<Button asChild className="mt-4 self-center">
					<Link href="/surveys">
						<ButtonIcon icon={Undo2} />
						{m.go_to_my_surveys()}
					</Link>
				</Button>
			</div>
		</article>
	);
}
