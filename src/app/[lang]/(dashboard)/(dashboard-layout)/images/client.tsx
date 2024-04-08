'use client';

import imagePoolCreate from '@lib/actions/image-pool-create';
import ButtonSubmit from '@lib/components/button-submit';
import { ButtonIconLoading } from '@lib/components/primitives/button';
import { Input } from '@lib/components/primitives/input';
import * as m from '@translations/messages';
import { Plus, Ticket } from 'lucide-react';
import { useFormState } from 'react-dom';

export function ImagePoolCreateForm() {
	const [_formState, formAction] = useFormState(imagePoolCreate, undefined);
	return (
		<form action={formAction} className="list-item aspect-[5/3]">
			<ButtonSubmit
				variant="outline"
				className="text-md flex h-full w-full flex-1 animate-puff-grow items-center justify-center gap-4 rounded-lg border-dashed p-8 fill-mode-both"
			>
				<span className="rounded-sm bg-primary p-2 text-primary-foreground">
					<ButtonIconLoading icon={Plus} />
				</span>
				{m.image_pool_create()}
			</ButtonSubmit>
		</form>
	);
}

export function ImagePoolJoinForm() {
	const [_formState, formAction] = useFormState(imagePoolCreate, undefined);
	return (
		<form
			action={formAction}
			className="flex flex-row gap-2 rounded-md border border-dashed border-input p-2"
		>
			<Input
				className="rounded-sm border-none bg-transparent font-mono text-lg tracking-wide placeholder:font-sans placeholder:text-sm placeholder:tracking-normal"
				placeholder={m.invitation_code()}
				required
			/>
			<ButtonSubmit>
				{m.code_claim()}
				<ButtonIconLoading icon={Ticket} />
			</ButtonSubmit>
		</form>
	);
}
