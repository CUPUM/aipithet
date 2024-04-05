import Field from '@lib/components/primitives/field';
import * as m from '@translations/messages';
import { ImagePoolDeleteForm, ImagePoolEditorInviteForm } from './client';

export default function Page(props: { params: { poolId: string } }) {
	return (
		<>
			<section className="rounded-lg border border-border bg-background p-8">
				<h2 className="text-2xl font-semibold">{m.editors()}</h2>
				<ul className="flex flex-col gap-2">Editors...</ul>
				<ImagePoolEditorInviteForm poolId={props.params.poolId} />
			</section>
			<section className="flex flex-col gap-6 rounded-lg border border-border bg-background p-8">
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
