import { useEffect, useRef } from 'react';

export default function useActionSuccess(
	success: boolean | undefined,
	{ reset = true }: { reset?: boolean } = {}
) {
	const ref = useRef<HTMLFormElement>(null);
	useEffect(() => {
		if (success && reset) {
			ref.current?.reset();
		}
	}, [success, reset]);
	return ref;
}
