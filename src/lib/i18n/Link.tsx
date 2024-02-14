import type { AvailableLanguageTag } from '@translations/runtime';
import type { Url } from 'next/dist/shared/lib/router/router';
import NextLink from 'next/link';
import type { ComponentProps } from 'react';
import { forwardRef, useMemo } from 'react';
import type { OverrideProperties } from 'type-fest';
import { withLang } from './utils';

const Link = forwardRef(function LangLink<H extends Url, L extends AvailableLanguageTag>(
	{
		children,
		href,
		hrefLang,
		...restProps
	}: OverrideProperties<
		Omit<ComponentProps<typeof NextLink>, 'ref'>,
		{
			href: H;
			hrefLang?: L;
		}
	>,
	ref: ComponentProps<typeof NextLink>['ref']
) {
	const hrefWithLang = useMemo(() => withLang(href, hrefLang), [href, hrefLang]);
	return (
		<NextLink ref={ref} {...restProps} hrefLang={hrefLang} href={hrefWithLang}>
			{children}
		</NextLink>
	);
});

export default Link;
