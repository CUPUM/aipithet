import ButtonSubmit from '@lib/components/button-submit';
import { ButtonIconLoading } from '@lib/components/primitives/button';
import * as m from '@translations/messages';
import { Trash } from 'lucide-react';

export default async function Page() {
	return (
		<form className="rounded-lg border border-border bg-background">
			<section className="p-8">{m.coming_soon()}</section>
			<hr className="border-b border-l border-r-0 border-t-0 border-border" />
			<section className="p-8">
				<ButtonSubmit variant="destructive">
					{m.survey_delete()}
					<ButtonIconLoading icon={Trash} />
				</ButtonSubmit>
			</section>
		</form>
	);
}
