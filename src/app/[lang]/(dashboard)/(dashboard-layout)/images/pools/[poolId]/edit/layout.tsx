import { ButtonIcon } from '@lib/components/primitives/button';
import { db } from '@lib/database/db';
import { imagesPools, imagesPoolsTranslations } from '@lib/database/schema/public';
import * as m from '@translations/messages';
import { languageTag } from '@translations/runtime';
import { and, eq } from 'drizzle-orm';
import { notFound } from 'next/navigation';
import type { ReactNode } from 'react';
import { DashboardNavbarButton } from '../../../../client';
import { IMAGE_POOL_EDITOR_ROUTES_ARR, IMAGE_POOL_EDITOR_ROUTES_DETAILS } from './constants';

async function getImagePoolLayoutData(poolId: string) {
	const lang = languageTag();
	return (
		(
			await db
				.select({ title: imagesPoolsTranslations.title })
				.from(imagesPools)
				.leftJoin(
					imagesPoolsTranslations,
					and(
						eq(imagesPools.id, imagesPoolsTranslations.id),
						eq(imagesPoolsTranslations.lang, lang)
					)
				)
				.where(eq(imagesPools.id, poolId))
				.limit(1)
		)[0] || null
	);
}

export default async function Layout(props: { params: { poolId: string }; children: ReactNode }) {
	const pool = await getImagePoolLayoutData(props.params.poolId);
	if (!pool) {
		notFound();
	}
	return (
		<div className="flex w-full max-w-screen-lg flex-1 flex-col items-stretch justify-start gap-6 self-center">
			<header className="flex flex-col gap-6">
				<h1 className="text-5xl font-semibold">
					{pool.title || <span className="italic text-muted-foreground">{m.untitled()}</span>}
				</h1>
				<nav className="-mx-2 -mb-2 flex flex-row gap-1 self-start overflow-x-auto rounded-md p-2 text-sm">
					{IMAGE_POOL_EDITOR_ROUTES_ARR.map((poolRoute, i) => {
						const details = IMAGE_POOL_EDITOR_ROUTES_DETAILS[poolRoute];
						return (
							<DashboardNavbarButton
								layoutRoot={!poolRoute}
								className="rounded-md"
								data-danger={'danger' in details ? details.danger : undefined}
								href={`/images/pools/${props.params.poolId}/edit${poolRoute}`}
								key={`survey-route-${i}`}
								style={{ animationDelay: `${75 * i + 250}ms` }}
							>
								{'icon' in details ? <ButtonIcon icon={details.icon} /> : undefined}
								{details.t()}
							</DashboardNavbarButton>
						);
					})}
				</nav>
			</header>
			{props.children}
		</div>
	);
}
