import { authorize } from '@lib/auth/auth';
import { imagesPools, imagesPoolsTranslations } from '@lib/database/schema/public';
import { withTranslations } from '@lib/i18n/aggregation';
import { canEditImagePool } from '@lib/queries/queries';
import { and, eq } from 'drizzle-orm';
import { notFound } from 'next/navigation';

async function getEditorImagePool(poolId: string) {
	const { user } = await authorize('images.pools.update');
	const agg = await withTranslations(imagesPools, imagesPoolsTranslations, (t, tt) => ({
		field: t.id,
		reference: tt.id,
	}))
		.where(and(eq(imagesPools.id, poolId), canEditImagePool({ userId: user.id })))
		.limit(1);
	if (!agg[0]) {
		return notFound();
	}
	return agg[0];
}

export type EditorImagePool = Awaited<ReturnType<typeof getEditorImagePool>>;

export default async function Page(props: { params: { poolId: string } }) {
	const pool = await getEditorImagePool(props.params.poolId);
	return (
		<article>
			<section>
				<h3>API</h3>
				<section>
					<h4></h4>
					<code>some code</code>
					<button>Copy API URL</button>
				</section>
			</section>
		</article>
	);
}
