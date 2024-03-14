import { validate } from '@lib/auth/auth';
import { Button, ButtonIcon } from '@lib/components/primitives/button';
import Link from '@lib/i18n/Link';
import { redirect } from '@lib/i18n/utilities';
import * as m from '@translations/messages';
import { LogIn, ShieldQuestion } from 'lucide-react';
import { SignupForm } from './client';

export default async function Page() {
	const { user } = await validate();
	if (user) {
		redirect('/i');
	}
	return (
		<>
			<SignupForm />
			<section className="mt-4 flex flex-row flex-wrap gap-2 justify-between animate-fly-down">
				<Button asChild size="sm" variant="link">
					<Link href="/login">
						<ButtonIcon icon={LogIn} />
						{m.login()}
					</Link>
				</Button>
				<Button asChild variant="link" size="sm">
					<Link href="/reset-password">
						{m.forgot_password()}
						<ButtonIcon icon={ShieldQuestion} />
					</Link>
				</Button>
			</section>
		</>
	);
}
