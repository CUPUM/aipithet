import type { ReactNode } from 'react';

/**
 * @see https://github.com/vercel/next.js/issues/58263#issuecomment-1878046533
 */
export default async function RootLayout(props: { children: ReactNode }) {
	return <>{props.children}</>;
}
