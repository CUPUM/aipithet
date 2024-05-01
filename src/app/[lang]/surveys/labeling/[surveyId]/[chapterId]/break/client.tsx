'use client';

import { Button } from '@lib/components/primitives/button';
import * as m from '@translations/messages';
import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
export function TimerButton(props: { deadline: Date; url: string }) {
	const [currentTime, setCurrentTime] = useState(new Date());

	useEffect(() => {
		const interval = setInterval(() => setCurrentTime(new Date()), 1000);

		return () => clearInterval(interval);
	}, []);

	const timeLeft = useMemo(
		() => props.deadline.getTime() - currentTime.getTime(),
		[props.deadline, currentTime]
	);
	const minutesLeft = useMemo(() => Math.floor(timeLeft / 1000 / 60), [timeLeft]);
	const secondsLeft = useMemo(() => Math.floor(timeLeft / 1000) % 60, [timeLeft]);

	if (timeLeft <= 0) {
		return (
			<Link href={props.url}>
				<Button className="w-fit self-center">{m.break_continue()}</Button>
			</Link>
		);
	}

	return (
		<Button className="w-fit self-center" disabled variant="secondary">
			{m.break_timer()} {minutesLeft}:{secondsLeft}
		</Button>
	);
}
