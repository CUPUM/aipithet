import type { ReactNode } from 'react';

export default function Layout(props: { children: ReactNode }) {
	return (
		<div className="flex flex-column flex-1 items-center justify-center p-4 pb-20">
			<div className="w-full max-w-sm">{props.children}</div>
		</div>
	);
}
