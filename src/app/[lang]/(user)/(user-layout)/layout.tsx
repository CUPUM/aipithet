import { validate } from '@lib/auth/auth';
import { ButtonIcon } from '@lib/components/primitives/button';
import ScrollOnNavigation from '@lib/components/scroll-on-navigation';
import { redirect } from '@lib/i18n/utilities-server';
import type { ReactNode } from 'react';
import { DashboardNavbarButton } from './client';
import { USER_ROUTES_ARR, USER_ROUTES_DETAILS } from './constants';

export default async function Layout(props: { children: ReactNode }) {
	const { user } = await validate();
	if (!user) {
		redirect('/login');
	}
	return (
		<>
			<nav className="-mt-2 flex flex-row items-start gap-1 overflow-x-auto px-2 py-2 text-sm md:px-3">
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
			<article
				id="user-layout-scroll"
				className="relative flex flex-1 flex-col justify-items-center overflow-y-auto overflow-x-hidden rounded-t-2xl border-t border-t-accent md:p-8"
			>
				<ScrollOnNavigation />
				{props.children}
			</article>
		</>
	);
}
