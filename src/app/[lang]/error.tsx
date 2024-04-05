'use client';

import { Button } from '@lib/components/primitives/button';
import * as m from '@translations/messages';

export default function ErrorPage(props: {
	error: Error & { digest?: string };
	reset: () => void;
}) {
	return (
		<div>
			<Button onClick={props.reset}>{m.reset()}</Button>
		</div>
	);
}
