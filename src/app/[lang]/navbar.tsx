import { Tag } from 'lucide-react';
import NavbarButton from './navbar-button';
import { NavbarSettingsMenu, NavbarUserMenu } from './navbar-client';

export default function Navbar() {
	return (
		<header className="flex flex-row gap-2 p-3 justify-between self-stretch">
			<nav className="flex flex-row gap-2">
				<NavbarButton href="/" className="text-primary border border-accent px-5">
					<Tag className="h-[1.25em] w-[1.25em]" strokeWidth={3} />
					<span className="font-bold">Aipithet</span>
				</NavbarButton>
			</nav>
			<nav className="flex flex-row gap-2">
				<NavbarSettingsMenu />
				<NavbarUserMenu />
			</nav>
		</header>
	);
}
