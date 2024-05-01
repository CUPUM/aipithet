import { Button } from '@lib/components/primitives/button';
import * as m from '@translations/messages';
import Link from 'next/link';

export default async function Page(props: {
	params: { surveyId: string; chapterId: string; answerId: string };
}) {
	return (
		<div className="flex w-full max-w-screen-lg flex-1 flex-col items-stretch justify-center gap-4 self-center">
			<h2 className="mb-4 animate-fly-up text-7xl font-semibold">{m.congratulations_title()}</h2>
			<p className="text-2xl font-light">{m.congratulations_body()}</p>
			<Link href="/surveys">
				<Button className="w-fit">{m.back_to_dashboard()}</Button>
			</Link>
		</div>
	);
}
