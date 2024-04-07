import * as m from '@lib/i18n/generated/messages';

export default function Home() {
	return (
		<>
			<hgroup className="flex h-full animate-fly-up flex-col items-center justify-center pb-28 pt-6">
				<h1 className="text-5xl font-semibold">{m.helloWorld()}</h1>
			</hgroup>
		</>
	);
}
