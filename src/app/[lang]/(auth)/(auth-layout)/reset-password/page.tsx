import { validate } from '@lib/auth/auth';
import { Button, ButtonIcon } from '@lib/components/primitives/button';
import Link from '@lib/i18n/Link';
import { redirect } from '@lib/i18n/utilities';
import * as m from '@translations/messages';
import { LogIn, UserPlus } from 'lucide-react';
import { ResetPasswordForm } from './client';

export default async function Page() {
	const { user } = await validate();
	if (user) {
		redirect('/i/settings#password');
	}
	return (
		<>
			<ResetPasswordForm />
			<section className="mt-4 flex flex-row flex-wrap gap-2 justify-between animate-fly-down">
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
