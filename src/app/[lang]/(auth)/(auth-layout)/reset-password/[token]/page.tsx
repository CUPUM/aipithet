import { validate } from '@lib/auth/auth';
import ButtonBack from '@lib/components/button-back';
import { Button, ButtonIcon, ButtonIconSpace } from '@lib/components/primitives/button';
import Link from '@lib/i18n/Link';
import { redirect } from '@lib/i18n/utilities-server';
import * as m from '@translations/messages';
import { ArrowLeft, LogIn, UserPlus } from 'lucide-react';
import { PasswordResetFinalizeForm } from './client';

export default async function Page(props: { params: { token: string } }) {
	const { user } = await validate();
	if (user) {
		redirect('/settings#password');
	}
	return (
		<>
			<section className="mb-4 flex animate-fly-up flex-row flex-wrap justify-between gap-2">
				<ButtonBack size="sm" variant="link">
					<ButtonIcon icon={ArrowLeft} />
					{m.go_back()}
					<ButtonIconSpace />
				</ButtonBack>
			</section>
			<PasswordResetFinalizeForm token={props.params.token} />
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
