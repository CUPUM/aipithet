import { LANG_NAMES } from '@lib/i18n/constants';
import type { AvailableLanguageTag } from '@translations/runtime';
import { availableLanguageTags, languageTag } from '@translations/runtime';
import type { ComponentProps, ReactNode } from 'react';
import { useMemo, useState } from 'react';
import { cn } from './utilities';

export default function LanguagesFieldsets<L extends AvailableLanguageTag[]>({
	className,
	children,
	languages = availableLanguageTags as unknown as [...L],
}: Omit<ComponentProps<'fieldset'>, 'children'> & {
	languages?: [...L];
	children: (fieldsetLang: L[number], index: number) => ReactNode;
}) {
	const larr = useMemo(() => languages ?? availableLanguageTags, [languages]);
	const lang = languageTag();
	const [currentLang, setCurrentLang] = useState<L[number]>(larr.includes(lang) ? lang : larr[0]);
	return (
		<fieldset className={cn('relative flex flex-col gap-6', className)}>
			<legend className="sticky top-0 z-10 float-left flex flex-row gap-1 self-start rounded-full border border-accent/50 bg-background p-1 shadow-[0_0.5em_1em_0.25em] shadow-background">
				{larr.map((l) => {
					const current = l === currentLang;

					return (
						<button
							key={l}
							type="button"
							aria-hidden={!current || undefined}
							aria-current={current ? 'step' : undefined}
							onClick={() => setCurrentLang(l)}
							className="flex h-8 flex-row items-center rounded-full px-3 text-sm font-medium text-foreground/80 transition-all hover:bg-primary/10 hover:text-primary aria-[current]:bg-accent aria-[current]:text-accent-foreground"
						>
							{LANG_NAMES[l]}
						</button>
					);
				})}
			</legend>
			{larr.map((l, i) => {
				const current = l === currentLang;
				return (
					<fieldset
						key={l}
						aria-hidden={!current || undefined}
						aria-current={current ? 'step' : undefined}
						className="flex flex-col gap-6 duration-1000 animate-in fade-in-0 fill-mode-both aria-hidden:hidden"
					>
						{children(l, i)}
					</fieldset>
				);
			})}
		</fieldset>
	);
}
