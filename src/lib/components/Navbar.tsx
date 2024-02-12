import { NavbarLangSwitch, NavbarThemeToggle } from './NavbarClient';

export default function Navbar() {
	return (
		<header>
			<NavbarLangSwitch />
			<NavbarThemeToggle />
		</header>
	);
}
