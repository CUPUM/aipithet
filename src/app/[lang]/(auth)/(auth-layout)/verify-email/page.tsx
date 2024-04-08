import { validate } from '@lib/auth/auth';
import ButtonBack from '@lib/components/button-back';
import { ButtonIcon, ButtonIconSpace } from '@lib/components/primitives/button';
import { redirect } from '@lib/i18n/utilities-server';
import * as m from '@translations/messages';
import { Undo } from 'lucide-react';
import { EmailVerifyForm } from './client';

export default async function Page() {
	const { user } = await validate();
	if (!user) {
		throw redirect('/login');
	}
	if (user.emailVerified) {
		return (
			<article className="flex flex-col items-center gap-8">
				<div className="absolute -z-10 -translate-y-1/2 text-9xl opacity-10">🎉</div>
				<p className="text-center">{m.email_already_verified()}</p>
				<ButtonBack>
					<ButtonIcon icon={Undo} />
					{m.go_back()}
					<ButtonIconSpace />
				</ButtonBack>
			</article>
		);
	}
	return <EmailVerifyForm />;
}
