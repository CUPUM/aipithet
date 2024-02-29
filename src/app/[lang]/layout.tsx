import UserProvider from '@lib/auth/user-provider-client';
import Navbar from '@lib/components/navbar';
import LanguageProvider from '@lib/i18n/language-provider';
import ThemeProvider from '@lib/theme/theme-provider';
import * as m from '@translations/messages';
import { languageTag } from '@translations/runtime';
import { Figtree, Spline_Sans_Mono } from 'next/font/google';
import './globals.css';

const fontSans = Figtree({
	display: 'swap', // For some reason setting 'swap' here breaks the font.
	weight: 'variable',
	subsets: ['latin-ext'],
	variable: '--font-sans', // Keep in sync with tailwind.config.js
});

const fontMono = Spline_Sans_Mono({
	display: 'swap',
	weight: 'variable',
	subsets: ['latin-ext'],
	variable: '--font-mono', // Keep in sync with tailwind.config.js
});

export async function generateMetadata() {
	return {
		title: 'Aipithet',
		description: m.app_description(),
	};
}

export default async function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	// const { user } = await validate();
	return (
		<LanguageProvider>
			<html
				lang={languageTag()}
				className={`${fontSans.variable} ${fontMono.variable}`}
				suppressHydrationWarning
			>
				<body className="flex flex-col w-full">
					<UserProvider user={null}>
						<ThemeProvider attribute="data-theme" defaultTheme="system" enableSystem>
							<Navbar />
							{children}
						</ThemeProvider>
					</UserProvider>
				</body>
			</html>
		</LanguageProvider>
	);
}
