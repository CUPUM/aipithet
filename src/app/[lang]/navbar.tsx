import { Home } from 'lucide-react';
import NavbarButton from './navbar-button';
import { NavbarSettingsMenu, NavbarUserMenu } from './navbar-client';

export default function Navbar() {
	return (
		<header className="flex flex-row gap-2 p-3 justify-between self-stretch">
			<nav className="flex flex-row gap-2">
				<NavbarButton href="/" className="aspect-square px-0">
					<Home className="h-[1.25em] w-[1.25em]" strokeWidth={2.5} />
				</NavbarButton>
			</nav>
			<nav className="flex flex-row gap-2">
				<NavbarSettingsMenu />
				<NavbarUserMenu />
			</nav>
		</header>
	);
}
