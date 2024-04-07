import Field from '@lib/components/primitives/field';
import { Skeleton } from '@lib/components/primitives/skeleton';
import { Spinner } from '@lib/components/primitives/spinner';
import { CACHE_TAGS } from '@lib/constants';
import { db } from '@lib/database/db';
import { users } from '@lib/database/schema/auth';
import { imagesPools } from '@lib/database/schema/public';
import { canEditImagePool } from '@lib/queries/queries';
import * as m from '@translations/messages';
import { and, eq, exists } from 'drizzle-orm';
import { unstable_cache } from 'next/cache';
import { Suspense } from 'react';
import { EditorForm, ImagePoolDeleteForm, ImagePoolEditorInviteForm } from './client';

const getEditors = unstable_cache(
	async function (poolId: string) {
		return await db
			.select({
				id: users.id,
				email: users.email,
				isCreator: exists(
					db
						.select()
						.from(imagesPools)
						.where(and(eq(imagesPools.id, poolId), eq(imagesPools.createdById, users.id)))
				),
			})
			.from(users)
			.where(canEditImagePool({ userId: users.id, poolId }));
	},
	[],
	{ tags: [CACHE_TAGS.IMAGE_POOL_EDITORS], revalidate: 60 }
);

export type Editors = Awaited<ReturnType<typeof getEditors>>;

async function Editors(props: { poolId: string }) {
	const editors = await getEditors(props.poolId);
	return editors.map((editor) => (
		<li>
			<EditorForm editor={editor} poolId={props.poolId} />
		</li>
	));
}

export default function Page(props: { params: { poolId: string } }) {
	return (
		<>
			<section className="flex animate-fly-up flex-col gap-6 rounded-lg border border-border bg-background p-8">
				<h2 className="text-2xl font-semibold">{m.editors()}</h2>
				<ul className="flex flex-col gap-2">
					<Suspense
						fallback={
							<Skeleton className="inset-0 flex h-[4.5rem] items-center justify-center bg-border/25">
								<Spinner />
							</Skeleton>
						}
					>
						<Editors poolId={props.params.poolId} />
					</Suspense>
				</ul>
				<ImagePoolEditorInviteForm poolId={props.params.poolId} />
			</section>
			<section className="flex animate-fly-up flex-col gap-6 rounded-lg border border-border bg-background p-8 delay-100 fill-mode-both">
				<h2 className="text-2xl font-semibold">Danger zone</h2>
				<Field>
					<p className="mb-4 text-sm leading-relaxed text-muted-foreground">
						Delete this image pool.
					</p>
					<ImagePoolDeleteForm poolId={props.params.poolId} />
				</Field>
			</section>
		</>
	);
}
