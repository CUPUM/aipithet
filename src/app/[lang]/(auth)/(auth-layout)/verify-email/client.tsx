'use client';

import { Input } from '@lib/components/primitives/input';
import { Label } from '@lib/components/primitives/label';

export function VerifyEmailForm() {
	return (
		<form>
			<h1>Verify email</h1>
			<Label>Confimation code</Label>
			<Input></Input>
		</form>
	);
}
