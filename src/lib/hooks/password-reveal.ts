import { useMemo, useState } from 'react';

export function usePasswordReveal(value: boolean) {
	const [reveal, setReveal] = useState(value);
	const type = useMemo(() => (reveal ? 'text' : 'password'), [reveal]);
	function toggle() {
		return setReveal((v) => !v);
	}
	return {
		reveal,
		setReveal,
		toggle,
		type,
	};
}
