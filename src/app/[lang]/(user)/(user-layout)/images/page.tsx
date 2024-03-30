import { authorize } from '@lib/auth/auth';
import { db } from '@lib/database/db';
import { images, imagesPools, imagesPoolsTranslations } from '@lib/database/schema/public';
import Link from '@lib/i18n/Link';
import * as m from '@translations/messages';
import { languageTag } from '@translations/runtime';
import { and, desc, eq } from 'drizzle-orm';
import { getColumns } from 'drizzle-orm-helpers';
import { Suspense } from 'react';
import { ImagePoolCreateForm } from './client';

async function ImagePools() {
	const lang = languageTag();
	const { user } = await authorize();
	const { id, createdAt } = getColumns(imagesPools);
	const { description, title } = getColumns(imagesPoolsTranslations);
	const pools = await db
		.select({ id, createdAt, title, description })
		.from(imagesPools)
		.leftJoin(
			imagesPoolsTranslations,
			and(eq(imagesPools.id, imagesPoolsTranslations.id), eq(imagesPoolsTranslations.lang, lang))
		);
	if (!pools.length) {
		return <li>{m.images_pools_none_found()}</li>;
	}
	return pools.map((pool, i) => (
		<li key={pool.id}>
			<Link
				href={`/images/pools/${pool.id}/edit`}
				className="group/link flex aspect-[5/3] animate-puff-grow flex-col items-start gap-4 rounded-lg border border-border bg-background px-7 py-6 transition-all duration-75 fill-mode-both after:absolute after:inset-0 after:-z-10 after:rounded-[inherit] hover:border-primary hover:after:bg-primary/20"
				style={{ animationDelay: `${i * 50}ms` }}
			>
				{pool.title || <span className="italic text-muted-foreground">{m.untitled()}</span>}
			</Link>
		</li>
	));
}

async function Images(props: { page?: number }) {
	const pageSize = 20;
	const { user } = await authorize();
	const { id, createdAt, storageName } = getColumns(images);
	const imgs = await db
		.select({ id, createdAt, storageName })
		.from(images)
		.orderBy(desc(createdAt))
		.limit(pageSize)
		.offset((props.page ?? 0) * pageSize);
	if (!imgs.length) {
		return (
			<li className="flex aspect-square items-center justify-center rounded-sm bg-accent/10 text-sm italic text-muted-foreground">
				{m.images_none_found()}
			</li>
		);
	}
	return imgs.map((image, i) => (
		<li key={image.id}>
			<Link
				href={`/images/pools/${image.id}/edit`}
				className="aspect-square"
				style={{ animationDelay: `${i * 50}ms` }}
			>
				{image.id}
			</Link>
		</li>
	));
}

export default async function Page() {
	return (
		<div className="flex w-full max-w-screen-lg flex-1 flex-col items-stretch gap-6 self-center">
			<section className="flex flex-col gap-6">
				<h2 className="text-4xl font-semibold">{m.image_pools()}</h2>
				<ul className="grid grid-cols-3 gap-4">
					<Suspense>
						<ImagePools />
					</Suspense>
					<ImagePoolCreateForm />
				</ul>
			</section>
			<section className="flex flex-col gap-6">
				<h2 className="text-4xl font-semibold">{m.images()}</h2>
				<ul className="grid grid-cols-5 gap-4 rounded-lg border border-border bg-background p-6">
					<Suspense>
						<Images />
					</Suspense>
				</ul>
			</section>
		</div>
	);
}
