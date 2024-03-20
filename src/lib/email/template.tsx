/* eslint-disable @next/next/no-page-custom-font */
import { withLang } from '@lib/i18n/utilities';
import { Container, Head, Hr, Html, Link, Section, Tailwind } from '@react-email/components';
import { languageTag } from '@translations/runtime';
import type { ReactNode } from 'react';
import { fontFamily } from 'tailwindcss/defaultTheme';
import tailwindConfig from '../../../tailwind.config';

/**
 * Unfortunately react-email currently lacks seamless integration of css variables.
 *
 * @see https://github.com/resend/react-email/issues/729
 */
export function Template(props: { children: ReactNode }) {
	const lang = languageTag();
	return (
		<Tailwind
			config={{
				...tailwindConfig,
				theme: {
					...tailwindConfig.theme,
					extend: {
						...tailwindConfig.theme.extend,
						fontFamily: {
							sans: ['Figtree', 'Trebuchet MS', ...fontFamily.sans],
							mono: ['Spline Sans Mono', ...fontFamily.mono],
						},
					},
				},
			}}
		>
			<Html lang={lang}>
				<Head>
					{/* <link rel="preconnect" href="https://fonts.googleapis.com" />
					<link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
					<link
						href="https://fonts.googleapis.com/css2?family=Figtree:ital,wght@0,300..900;1,300..900&family=Spline+Sans+Mono:ital,wght@0,300..700;1,300..700&display=swap"
						rel="stylesheet"
					/> */}
					<meta httpEquiv="Content-Type" content="text/html; charact=UTF-8" />
					<meta
						name="viewport"
						content="width=device-width; initial scale=1.0; maximum scale=1.0;"
					/>
					<style
						type="text/css"
						dangerouslySetInnerHTML={{
							__html:
								'@import url("https://fonts.googleapis.com/css2?family=Figtree:ital,wght@0,300..900;1,300..900&family=Spline+Sans+Mono:ital,wght@0,300..700;1,300..700&display=swap")',
						}}
					></style>
				</Head>
				<Container>
					{props.children}
					<Hr className="mt-8" />
					<Section className="text-center">
						<Link
							hrefLang={lang}
							href={`${process.env.VERCEL_URL}/${withLang('/verify-email')}`}
							className="font-sans text-xs text-slate-500"
						>
							Aipithet
						</Link>
					</Section>
				</Container>
			</Html>
		</Tailwind>
	);
}
