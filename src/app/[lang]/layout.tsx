import { validate } from '@lib/auth/authorization';
import UserProvider from '@lib/auth/user-provider-client';
import LanguageProvider from '@lib/i18n/language-provider';
import ThemeProvider from '@lib/theme/theme-provider';
import * as m from '@translations/messages';
import { languageTag } from '@translations/runtime';
import { fontMono, fontSans } from './fonts';
import './globals.css';
import Navbar from './navbar';

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
	const lang = languageTag();
	const { user } = await validate();
	return (
		<LanguageProvider>
			<UserProvider user={user}>
				<html
					lang={lang}
					className={`${fontSans.variable} ${fontMono.variable} h-full`}
					suppressHydrationWarning
				>
					<body className="flex flex-col w-full h-full">
						<ThemeProvider
							attribute="data-theme"
							defaultTheme="system"
							enableSystem
							disableTransitionOnChange
						>
							<Navbar />
							{children}
						</ThemeProvider>
					</body>
				</html>
			</UserProvider>
		</LanguageProvider>
	);
}
