import { validate } from '@lib/auth/auth';
import { Button, ButtonIcon } from '@lib/components/primitives/button';
import Link from '@lib/i18n/Link';
import { redirect } from '@lib/i18n/utilities-server';
import * as m from '@translations/messages';
import { ShieldQuestion, UserPlus } from 'lucide-react';
import { LoginForm } from './client';

export default async function Page() {
	const { user } = await validate();
	if (user) {
		redirect('/settings');
	}
	return (
		<>
			<LoginForm />
			<section className="mt-4 flex animate-fly-down flex-row flex-wrap justify-between gap-2">
				<Button asChild variant="link" size="sm">
					<Link href="/signup">
						<ButtonIcon icon={UserPlus} />
						{m.signup()}
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
