import { Skeleton } from '@lib/components/primitives/skeleton';
import { db } from '@lib/database/db';
import { images, imagesPrompts } from '@lib/database/schema/public';
import { eq } from 'drizzle-orm';
import { getColumns } from 'drizzle-orm-helpers';
import { jsonAgg, jsonBuildObject } from 'drizzle-orm-helpers/pg';
import { Suspense } from 'react';
import { ImagesMetadataUploadForm } from './client';

async function Prompts(props: { poolId: string }) {
	const prompts = await db
		.select({ id: imagesPrompts.id, images: jsonAgg(jsonBuildObject(getColumns(images))) })
		.from(imagesPrompts)
		.where(eq(imagesPrompts.poolId, props.poolId))
		.leftJoin(images, eq(images.promptId, imagesPrompts.id))
		.groupBy(imagesPrompts.id);
	return prompts.map((prompt) => <li>{prompt.id}</li>);
}

export default async function Page(props: { params: { poolId: string } }) {
	return (
		<>
			<section className="border-boder flex animate-fly-up flex-col gap-6 rounded-lg border bg-background p-6 fill-mode-both">
				<h2 className="text-xl font-semibold">Prompts</h2>
				<ul className="flex flex-col gap-2 bg-border/50 p-2">
					<Suspense
						fallback={
							<li>
								<Skeleton />
							</li>
						}
					>
						<Prompts poolId={props.params.poolId} />
					</Suspense>
				</ul>
			</section>
			<section className="border-boder flex animate-fly-up flex-col gap-6 rounded-lg border bg-background p-6 delay-100 fill-mode-both">
				<h2 className="text-xl font-semibold">Images</h2>
			</section>
			<section className="border-boder flex animate-fly-up flex-col gap-6 rounded-lg border bg-background p-6 delay-200 fill-mode-both">
				<h2 className="text-xl font-semibold">Upload</h2>
				<p className="text-sm leading-relaxed text-muted-foreground">
					To add images to this pool follow these steps:
				</p>
				<section className="flex flex-col gap-4 md:flex-row md:gap-8">
					<ol className="flex flex-1 list-decimal flex-col gap-4 pl-8 text-sm italic text-muted-foreground">
						<li>Upload the images to storage</li>
						<li>
							Prepare a <code>json</code> containing the relevant metadata for the images, formatted
							as described herein.
						</li>
						<li>Upload the json file below.</li>
					</ol>
					<code className="flex-1 whitespace-pre rounded-sm bg-border p-4 font-mono text-sm leading-relaxed tracking-wide">
						{JSON.stringify(
							{
								'scenarios?': [{ id: 'string', name: 'string', description: 'string' }],
								'prompts': [
									{
										'text': 'string',
										'scenarioId?': 'string',
										'method': 'string',
										'images': [{ path: 'string', width: 'number', height: 'number' }],
									},
								],
							},
							null,
							2
						).replaceAll('?"', '"?')}
					</code>
				</section>
				<ImagesMetadataUploadForm poolId={props.params.poolId} />
			</section>
		</>
	);
}
