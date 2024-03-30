'use client';

import imagePoolCreate from '@lib/actions/image-pool-create';
import ButtonSubmit from '@lib/components/button-submit';
import { ButtonIconLoading } from '@lib/components/primitives/button';
import * as m from '@translations/messages';
import { Plus } from 'lucide-react';
import { useFormState } from 'react-dom';

export function ImagePoolCreateForm() {
	const [_formState, formAction] = useFormState(imagePoolCreate, undefined);
	return (
		<form action={formAction} className="list-item">
			<ButtonSubmit
				variant="outline"
				className="flex aspect-[5/3] h-full flex-1 animate-puff-grow items-center justify-center rounded-lg border-dashed bg-background p-8 fill-mode-both"
			>
				<ButtonIconLoading icon={Plus} />
				{m.images_pools_create()}
			</ButtonSubmit>
		</form>
	);
}
