import Link from '@lib/i18n/Link';
import * as m from '@translations/messages';

export default function NotFound() {
	return (
		<div>
			<h2>Not Found</h2>
			<p>Could not find requested resource</p>
			<Link href="/">{m.go_back()}</Link>
		</div>
	);
}
