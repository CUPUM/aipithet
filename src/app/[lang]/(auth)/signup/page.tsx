import { Input } from '@lib/components/primitives/input';

export default function Page() {
	return (
		<form>
			<h1>Signup</h1>
			<Input name="email" type="email" />
			<Input name="password" type="password" />
			<Input name="confirmPassword" type="password" />
		</form>
	);
}
