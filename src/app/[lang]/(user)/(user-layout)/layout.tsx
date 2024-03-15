import { validate } from '@lib/auth/auth';
import { ButtonIcon } from '@lib/components/primitives/button';
import { redirect } from '@lib/i18n/utilities';
import type { ReactNode } from 'react';
import { USER_ROUTES_ARR, USER_ROUTES_DETAILS } from './constants';
import { DashboardNavbarButton } from './i/client';

export default async function Layout(props: { children: ReactNode }) {
	const { user } = await validate();
	if (!user) {
		redirect('/login');
	}
	return (
		<div className="flex flex-1 flex-col overflow-hidden">
			<nav className="flex flex-row items-start gap-1 overflow-x-auto px-2 pb-2 text-sm md:px-3">
				{USER_ROUTES_ARR.map((userRoute, i) => {
					const details = USER_ROUTES_DETAILS[userRoute];
					return (
						<DashboardNavbarButton
							href={userRoute}
							key={i}
							style={{ animationDelay: `${75 * i}ms` }}
						>
							{'icon' in details ? <ButtonIcon icon={details.icon} /> : undefined}
							{details.t()}
						</DashboardNavbarButton>
					);
				})}
			</nav>
			<article className="relative flex flex-1 flex-col justify-items-center overflow-y-auto overflow-x-hidden rounded-t-sm border-t border-accent p-2 md:p-8">
				{props.children}
			</article>
		</div>
	);
}
