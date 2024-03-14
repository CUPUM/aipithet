import { Spinner } from '@lib/components/primitives/spinner';

export default function Loading() {
	return (
		<div className="flex items-center justify-center flex-1">
			<Spinner />
		</div>
	);
}
