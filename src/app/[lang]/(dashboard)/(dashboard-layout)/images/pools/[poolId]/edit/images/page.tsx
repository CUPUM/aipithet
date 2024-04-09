import { Skeleton } from '@lib/components/primitives/skeleton';
import { db } from '@lib/database/db';
import { images, imagesPrompts } from '@lib/database/schema/public';
import * as m from '@translations/messages';
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
	return prompts.map((prompt) => <li className="rounded-sm bg-border p-2">{prompt.id}</li>);
}

export default async function Page(props: { params: { poolId: string } }) {
	return (
		<>
			<section className="border-boder flex animate-fly-up flex-col gap-6 rounded-lg border bg-background p-6 fill-mode-both">
				<menu className="flex flex-row">
					<button className="text-md flex flex-row px-6 font-semibold">{m.images()}</button>
					<button className="text-md flex flex-row px-6 font-semibold">{m.prompts()}</button>
					<button className="text-md flex flex-row px-6 font-semibold">{m.scenarios()}</button>
				</menu>
				<ul className="flex max-h-[70vh] flex-col gap-2 overflow-y-auto rounded-md bg-border/50 p-6">
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
					<code className="flex-1 whitespace-pre rounded-sm bg-border/50 p-6 font-mono text-sm leading-relaxed tracking-wide">
						{JSON.stringify(
							{
								'prefix?': 'string',
								'bucket': 'string',
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
