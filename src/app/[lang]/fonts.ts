import { Figtree, Spline_Sans_Mono } from 'next/font/google';

export const fontSans = Figtree({
	display: 'swap', // For some reason setting 'swap' here breaks the font.
	weight: 'variable',
	subsets: ['latin-ext'],
	variable: '--font-sans', // Keep in sync with tailwind.config.js
});

export const fontMono = Spline_Sans_Mono({
	display: 'swap',
	weight: 'variable',
	subsets: ['latin-ext'],
	variable: '--font-mono', // Keep in sync with tailwind.config.js
});
