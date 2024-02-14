import NavbarButton from './navbar-button';
import { NavbarLangSwitch, NavbarThemeToggle } from './navbar-client';

export default function Navbar() {
	return (
		<header className="flex flex-row gap-2 p-2 justify-between self-stretch">
			<nav className="flex flex-row gap-2">
				<NavbarButton>
					<span className="font-extrabold">Ai</span>pithet
				</NavbarButton>
			</nav>
			<nav className="flex flex-row gap-2">
				<NavbarButton>Test</NavbarButton>
				<NavbarLangSwitch />
				<NavbarThemeToggle />
			</nav>
		</header>
	);
}
