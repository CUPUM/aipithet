import { Input } from '@lib/components/primitives/input';

export default function Page() {
	return (
		<form>
			<h1>Signin</h1>
			<Input name="email" type="email" />
			<Input name="password" type="password" />
		</form>
	);
}
