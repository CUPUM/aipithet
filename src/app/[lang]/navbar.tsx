import { Tag } from 'lucide-react';
import NavbarButton from './navbar-button';
import { NavbarSettingsMenu, NavbarUserMenu } from './navbar-client';

export default function Navbar() {
	return (
		<header className="flex flex-row justify-between gap-2 self-stretch p-0">
			<nav className="flex flex-row gap-2">
				<NavbarButton href="/" className="px-5 font-bold text-primary">
					<Tag className="h-[1.25em] w-[1.25em]" strokeWidth={3} />
					Aipithet
				</NavbarButton>
			</nav>
			<nav className="flex flex-row gap-2">
				<NavbarSettingsMenu />
				<NavbarUserMenu />
			</nav>
		</header>
	);
}
