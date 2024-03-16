import * as m from '@translations/messages';

export default function Page() {
	return (
		<div className="flex w-full max-w-screen-lg flex-1 flex-col items-stretch justify-center gap-5 self-center p-2">
			<h2 className="self-center text-lg italic text-muted-foreground">{m.coming_soon()}</h2>
		</div>
	);
}
