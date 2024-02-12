import LanguageProvider from '@/lib/i18n/LanguageProvider';
import { availableLanguageTags, languageTag } from '@/lib/i18n/generated/runtime';
import ThemeProvider from '@/lib/theme/ThemeProvider';
import type { Metadata } from 'next';
import { Figtree, Spline_Sans_Mono } from 'next/font/google';
import './globals.css';

const fontMain = Figtree({
	display: 'swap', // For some reason setting 'swap' here breaks the font.
	weight: 'variable',
	subsets: ['latin-ext'],
	variable: '--font-main', // Keep in sync with tailwind.config.js
});

const fontMono = Spline_Sans_Mono({
	display: 'swap',
	weight: 'variable',
	subsets: ['latin-ext'],
	variable: '--font-mono', // Keep in sync with tailwind.config.js
});

export const metadata: Metadata = {
	title: 'Aipithet',
	description: 'The EDI oriented labeling platform',
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<LanguageProvider>
			<html
				lang={languageTag()}
				className={`${fontMain.variable} ${fontMono.variable}`}
				suppressHydrationWarning
			>
				<body>
					<ThemeProvider
						attribute="data-theme"
						defaultTheme="system"
						enableSystem
						disableTransitionOnChange
					>
						<nav>
							{availableLanguageTags.map((tag) => (
								<a href={tag} key={tag} className="p-5">
									{tag}
								</a>
							))}
						</nav>
						{children}
					</ThemeProvider>
				</body>
			</html>
		</LanguageProvider>
	);
}
