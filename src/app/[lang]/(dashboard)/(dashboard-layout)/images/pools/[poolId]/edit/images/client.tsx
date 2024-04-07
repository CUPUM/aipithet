'use client';

import imagesMetadataUpload from '@lib/actions/images-metadata.upload';
import ButtonSubmit from '@lib/components/button-submit';
import { Button, ButtonIconLoading } from '@lib/components/primitives/button';
import * as m from '@translations/messages';
import { Upload } from 'lucide-react';
import { useFormState } from 'react-dom';

export function ImagesMetadataUploadForm(props: { poolId: string }) {
	const [_formState, formAction] = useFormState(imagesMetadataUpload, undefined);
	return (
		<form action={formAction} className="flex flex-col items-start">
			<input type="hidden" value={props.poolId} name="poolId" readOnly />
			<fieldset className="flex flex-row gap-2">
				<Button
					asChild
					variant="secondary"
					className="cursor-pointer p-0 file:mr-4 file:h-full file:cursor-pointer file:border-none file:bg-input file:px-6"
				>
					<input type="file" required accept="application/json" name="file" />
				</Button>
				<ButtonSubmit>
					{m.upload()}
					<ButtonIconLoading icon={Upload} />
				</ButtonSubmit>
			</fieldset>
		</form>
	);
}
