'use client';

import { Button } from '@lib/components/primitives/button';

export default function ErrorPage(props: {
	error: Error & { digest?: string };
	reset: () => void;
}) {
	return (
		<article>
			<h2>Authentication error</h2>
			<p>{props.error.message}</p>
			<Button onClick={props.reset}>Try again</Button>
		</article>
	);
}
