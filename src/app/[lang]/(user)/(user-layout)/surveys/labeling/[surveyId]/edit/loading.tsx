import { Spinner } from '@lib/components/primitives/spinner';

export default function Loading() {
	return (
		<div className="flex flex-1 items-center justify-center self-stretch">
			<Spinner />
		</div>
	);
}
