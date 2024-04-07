import { authorize } from '@lib/auth/auth';
import { db } from '@lib/database/db';
import { imagesPools, imagesPoolsTranslations } from '@lib/database/schema/public';
import { aggTranslations, joinTranslations } from '@lib/i18n/aggregation';
import { canEditImagePool } from '@lib/queries/queries';
import { and, eq } from 'drizzle-orm';
import { getColumns } from 'drizzle-orm-helpers';
import { notFound } from 'next/navigation';
import { ImagePoolPresentationUpdateForm } from './client';

async function getEditorImagePool(poolId: string) {
	const { user } = await authorize('images.pools.update');
	const agg = await joinTranslations(
		db
			.select({
				...getColumns(imagesPools),
				translations: aggTranslations(getColumns(imagesPoolsTranslations)),
			})
			.from(imagesPools)
			.$dynamic(),
		imagesPoolsTranslations,
		eq(imagesPools.id, imagesPoolsTranslations.id)
	)
		.where(and(eq(imagesPools.id, poolId), canEditImagePool({ userId: user.id })))
		.groupBy(imagesPools.id)
		.limit(1);
	if (!agg[0]) {
		return notFound();
	}
	return agg[0];
}

export type EditorImagePool = Awaited<ReturnType<typeof getEditorImagePool>>;

export default async function Page(props: { params: { poolId: string } }) {
	await authorize('images.pools.update');
	const pool = await getEditorImagePool(props.params.poolId);
	// const endpointUrl = appUrl(`/api/images/pools/${props.params.poolId}/images`, { lang: false });
	// const { session } = await authorize();
	// const authHeader = {
	// 	headers: { Authorization: `Bearer ${session?.id ?? 'Error: No auth session found!'}` },
	// };

	return (
		<>
			<ImagePoolPresentationUpdateForm {...pool} />
			{/* <section className="flex flex-col gap-4 rounded-lg border border-border bg-background">
				<h3 className="p-8 pb-0 text-xl font-semibold">API details</h3>
				<section className="flex gap-4 p-8 md:flex-row md:gap-8">
					<div className="flex flex-1 basis-1/2 flex-col gap-4">
						<Label>Image pool identification</Label>
						<p className="text-sm leading-relaxed text-muted-foreground">
							Use this pool id to assign your requests to the current image pool.
						</p>
					</div>
					<div className="flex max-w-[50%] flex-1 flex-col gap-2 rounded-sm bg-border/50 p-2">
						<span className="self-start rounded-full border border-border px-3 py-1 text-sm text-muted-foreground">
							Pool id
						</span>
						<div className="flex flex-row gap-2">
							<code className="flex-1 overflow-x-auto p-3 text-sm tracking-wide text-foreground/90">
								{props.params.poolId}
							</code>
							<ButtonCopy copyText={props.params.poolId} />
						</div>
						<hr />
						<span className="mt-4 self-start rounded-full border border-border px-3 py-1 text-sm text-muted-foreground">
							Endpoint url
						</span>
						<div className="flex flex-row gap-2">
							<code className="flex-1 overflow-x-auto p-3 text-sm tracking-wide text-foreground/90">
								{endpointUrl}
							</code>
							<ButtonCopy copyText={endpointUrl} />
						</div>
					</div>
				</section>
				<section className="flex gap-4 p-8 md:flex-row md:gap-8">
					<div className="flex flex-1 flex-col gap-4">
						<Label>Authorization</Label>
						<p className="text-sm leading-relaxed text-muted-foreground">
							In order to authenticate your requests to the api, you must specify an authorization
							header specific to your account.
						</p>
					</div>
					<div className="flex max-w-[50%] flex-1 flex-row gap-2 rounded-sm bg-border/50 p-2">
						<code className="flex-1 overflow-x-auto whitespace-pre p-3 text-sm tracking-wide text-foreground/90">
							{JSON.stringify(authHeader, undefined, 2).replaceAll('"', '')}
						</code>
						<ButtonCopy copyText={JSON.stringify(authHeader).replaceAll('"', '')} />
					</div>
				</section>
				<section className="flex gap-4 p-8 md:flex-row md:gap-8">
					<div className="flex flex-1 flex-col gap-4">
						<Label>Upload images</Label>
						<p className="text-sm leading-relaxed text-muted-foreground">
							Images should be uploaded in groups alongside their prompt.
						</p>
					</div>
					<div className="flex flex-1 flex-row gap-2 rounded-sm bg-border/50 p-2">
						<code className="flex-1 overflow-x-auto whitespace-pre p-3 text-sm tracking-wide text-foreground/90">
							# to do
						</code>
						<ButtonCopy copyText={props.params.poolId} />
					</div>
				</section>
			</section> */}
		</>
	);
}
