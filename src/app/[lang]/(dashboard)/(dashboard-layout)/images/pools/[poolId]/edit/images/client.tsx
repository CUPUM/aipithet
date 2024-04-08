'use client';

import imagesMetadataUpload from '@lib/actions/images-metadata.upload';
import ButtonSubmit from '@lib/components/button-submit';
import { Button, ButtonIconLoading } from '@lib/components/primitives/button';
import { ErrorMessages } from '@lib/components/primitives/error-messages';
import * as m from '@translations/messages';
import { Upload } from 'lucide-react';
import { useState } from 'react';
import { useFormState } from 'react-dom';

export function ImagesMetadataUploadForm(props: { poolId: string }) {
	const [formState, formAction] = useFormState(imagesMetadataUpload, undefined);
	console.log(formState);
	const [value, setValue] = useState(false);
	return (
		<form action={formAction} className="flex flex-col items-start">
			<input type="hidden" value={props.poolId} name="poolId" readOnly />
			<fieldset className="flex flex-row gap-2">
				<Button
					asChild
					variant="secondary"
					className="cursor-pointer p-0 file:mr-4 file:h-full file:cursor-pointer file:border-none file:bg-input file:px-6"
				>
					<input
						type="file"
						required
						accept="application/json"
						name="file"
						onChange={(e) => setValue(!!e.target.value)}
					/>
				</Button>
				{value ? (
					<ButtonSubmit className="animate-puff-grow">
						{m.upload()}
						<ButtonIconLoading icon={Upload} />
					</ButtonSubmit>
				) : null}
				<ErrorMessages
					errors={formState && 'errors' in formState ? formState.errors.file?._errors : undefined}
				/>
			</fieldset>
		</form>
	);
}
