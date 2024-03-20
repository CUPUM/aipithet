import { Button, ButtonIcon } from '@lib/components/primitives/button';
import * as m from '@translations/messages';
import { Mail } from 'lucide-react';
import { EmailUpdateForm, PasswordUpdateForm } from './client';

export default function Page() {
	return (
		<div className="flex w-full max-w-screen-md flex-1 flex-col items-stretch gap-4 self-center p-2">
			<h2 className="mb-4 text-4xl font-semibold">{m.user_settings()}</h2>
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
	);
}
