import type { Config } from 'tailwindcss';
import { fontFamily } from 'tailwindcss/defaultTheme';
import plugin from 'tailwindcss/plugin';

const config = {
	darkMode: ['selector', '[data-theme="dark"]'],
	content: ['./src/**/*.{ts,tsx}'],
	prefix: '',
	theme: {
		container: {
			center: true,
			padding: '2rem',
			screens: {
				'2xl': '1400px',
			},
		},
		extend: {
			fontFamily: {
				sans: ['var(--font-sans)', ...fontFamily.sans],
				mono: ['var(--font-mono)', ...fontFamily.mono],
			},
			colors: {
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				primary: {
					DEFAULT: 'hsl(var(--primary))',
					foreground: 'hsl(var(--primary-foreground))',
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))',
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))',
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))',
				},
				accent: {
					DEFAULT: 'hsl(var(--accent))',
					foreground: 'hsl(var(--accent-foreground))',
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))',
				},
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))',
				},
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 6px)',
			},
			keyframes: {
				'accordion-down': {
					from: { height: '0' },
					to: { height: 'var(--radix-accordion-content-height)' },
				},
				'accordion-up': {
					from: { height: 'var(--radix-accordion-content-height)' },
					to: { height: '0' },
				},
				'fly-down': {
					from: {
						opacity: '0',
						translate: '0px -0.3em',
					},
					// to: {
					// 	translate: '0px 0em',
					// },
				},
				'fly-up': {
					from: {
						opacity: '0',
						translate: '0px 0.3em',
					},
					// to: {
					// 	translate: '0px 0em',
					// },
				},
				'puff-grow': {
					from: {
						opacity: '0',
						scale: '0.96',
					},
					// to: {
					// 	scale: '1',
					// },
				},
				'puff-shrink': {
					from: {
						opacity: '0',
						scale: '1.06',
					},
					// to: {
					// 	scale: '1',
					// },
				},
			},
			animation: {
				'accordion-down': 'accordion-down 0.25s ease-out',
				'accordion-up': 'accordion-up 0.25s ease-out',
				'fly-down': 'fly-down 0.35s ease-out',
				'fly-up': 'fly-up 0.35s ease-out',
				'puff-grow': 'puff-grow 0.2s ease-out',
				'puff-shrink': 'puff-shrink 0.2s ease-out',
			},
		},
	},
	plugins: [
		require('tailwindcss-animate'),
		plugin(({ addVariant, matchUtilities, theme }) => {
			addVariant('light', '[data-theme="light"] &');
			matchUtilities(
				{
					'animation-delay': (value) => {
						return {
							'animation-delay': value,
						};
					},
				},
				{
					values: theme('transitionDelay'),
				}
			);
			// availableLanguageTags.forEach((tag) => {
			// 	addVariant(tag, `[lang="${tag}"] &`);
			// });
		}),
	],
} satisfies Config;

export default config;
