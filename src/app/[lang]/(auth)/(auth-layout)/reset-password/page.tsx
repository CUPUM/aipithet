import { validate } from '@lib/auth/auth';
import { Button, ButtonIcon } from '@lib/components/primitives/button';
import Link from '@lib/i18n/Link';
import { redirect } from '@lib/i18n/utilities';
import * as m from '@translations/messages';
import { LogIn, UserPlus } from 'lucide-react';
import { PasswordResetForm } from './client';

export default async function Page() {
	const { user } = await validate();
	if (user) {
		redirect('/settings');
	}
	return (
		<>
			<PasswordResetForm />
			<section className="mt-4 flex animate-fly-down flex-row flex-wrap justify-between gap-2">
				<Button asChild variant="link" size="sm">
					<Link href="/signup">
						<ButtonIcon icon={UserPlus} />
						{m.signup()}
					</Link>
				</Button>
				<Button asChild variant="link" size="sm">
					<Link href="/login">
						{m.login()}
						<ButtonIcon icon={LogIn} />
					</Link>
				</Button>
			</section>
		</>
	);
}
