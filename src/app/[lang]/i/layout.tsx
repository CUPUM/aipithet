import { validate } from '@lib/auth/authorization';
import { ButtonIcon } from '@lib/components/primitives/button';
import { redirect } from '@lib/i18n/utilities';
import { FolderOpen, LayoutDashboard, UserCog } from 'lucide-react';
import type { ReactNode } from 'react';
import { DashboardNavbarButton } from './client';

export default async function Layout(props: { children: ReactNode }) {
	const { user } = await validate();
	if (!user) {
		redirect('/login');
	}
	return (
		<div className="flex flex-col">
			<nav className="flex flex-row px-3 pb-3 border-b border-solid border-border items-start text-sm gap-1">
				<DashboardNavbarButton href="/i" style={{ animationDelay: '50ms' }}>
					<ButtonIcon icon={LayoutDashboard} />
					Dashboard
				</DashboardNavbarButton>
				<DashboardNavbarButton href="/i/surveys" style={{ animationDelay: '100ms' }}>
					<ButtonIcon icon={FolderOpen} />
					Surveys
				</DashboardNavbarButton>
				<DashboardNavbarButton href="/i/settings" style={{ animationDelay: '150ms' }}>
					<ButtonIcon icon={UserCog} />
					Settings
				</DashboardNavbarButton>
			</nav>
			<article>{props.children}</article>
		</div>
	);
}
