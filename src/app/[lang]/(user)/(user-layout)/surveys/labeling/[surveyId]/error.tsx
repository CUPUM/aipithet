'use client';

import { Button } from '@lib/components/primitives/button';

export default function ErrorPage(props: {
	error: Error & { digest?: string };
	reset: () => void;
}) {
	return (
		<article>
			{props.error.message}
			<Button onClick={props.reset}>Reset</Button>
		</article>
	);
}
