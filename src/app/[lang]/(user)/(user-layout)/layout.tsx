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
		<div className="flex flex-col">
			<nav className="flex flex-row px-3 pb-3 items-start text-sm gap-1">
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
			<article>{props.children}</article>
		</div>
	);
}
