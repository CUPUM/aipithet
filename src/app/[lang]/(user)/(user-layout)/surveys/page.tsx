import { authorize } from '@lib/auth/auth';
import { isAllowed } from '@lib/auth/validation';
import { Skeleton } from '@lib/components/primitives/skeleton';
import ScatteredNodes from '@lib/components/scattered-nodes';
import { db } from '@lib/database/db';
import { labelingSurveys, labelingSurveysParticipants } from '@lib/database/schema/public';
import Link from '@lib/i18n/Link';
import * as m from '@translations/messages';
import { and, eq, exists, or } from 'drizzle-orm';
import { File, FolderPen, Tag, Ticket } from 'lucide-react';
import { Suspense } from 'react';
import { SurveyCreateForm, SurveyInvitationClaimForm } from './client';

async function ParticipatingSurveys() {
	const { user } = await authorize();
	const surveys = await db
		.select()
		.from(labelingSurveys)
		.where(
			exists(
				db
					.select()
					.from(labelingSurveysParticipants)
					.where(
						and(
							eq(labelingSurveysParticipants.surveyId, labelingSurveys.id),
							eq(labelingSurveysParticipants.userId, user.id)
						)
					)
			)
		);
	return (
		<ul className="flex flex-col gap-2">
			{surveys.length ? (
				surveys.map((survey) => (
					<li key={survey.id}>
						<Link href={`/surveys/labeling/${survey.id}/edit`}>{survey.id}</Link>
					</li>
				))
			) : (
				<li className="text-muted-foreground">Aucun sondage trouvé</li>
			)}
		</ul>
	);
}

async function EditingSurveys() {
	const { user } = await authorize();
	const surveys = await db
		.select()
		.from(labelingSurveys)
		.where(
			or(
				eq(labelingSurveys.createdById, user.id),
				exists(
					db
						.select()
						.from(labelingSurveysParticipants)
						.where(
							and(
								eq(labelingSurveysParticipants.surveyId, labelingSurveys.id),
								eq(labelingSurveysParticipants.userId, user.id)
							)
						)
				)
			)
		);
	return (
		<ul className="flex flex-col gap-2">
			{surveys.length ? (
				surveys.map((survey) => (
					<li key={survey.id}>
						<Link href={`/surveys/labeling/${survey.id}/edit`}>{survey.id}</Link>
					</li>
				))
			) : (
				<li className="text-muted-foreground">Aucun sondage trouvé</li>
			)}
		</ul>
	);
}

export default async function Page() {
	const { user } = await authorize();
	return (
		<>
			<div className="absolute inset-0 -z-10 overflow-hidden rounded-[inherit]">
				<div className="fixed h-full w-full text-accent">
					<ScatteredNodes
						count={80}
						pool={[File, FolderPen, Tag, Ticket].map((Node) => (
							<Node
								className="aspect-square h-20 w-20 animate-puff-grow rounded-lg bg-background p-5 duration-1000 ease-out animate-in zoom-in-50 fill-mode-both"
								vectorEffect="non-scaling-stroke"
								strokeWidth={1.25}
								key="a"
							/>
						))}
						scale={() => 1}
						rotate={() => `${Number(Math.random().toFixed(2))}turn`}
					/>
				</div>
			</div>
			<div className="flex w-full max-w-screen-lg flex-1 flex-col items-stretch justify-center gap-5 self-center p-2">
				<section className="">
					<h2>{m.my_surveys()}</h2>
					<section>
						<h3>Participating</h3>
						<Suspense fallback={<Skeleton className="rounded-md">Loading</Skeleton>}>
							<ParticipatingSurveys />
						</Suspense>
					</section>
					<section>
						<h3>Editor</h3>
						<Suspense fallback={<Skeleton className="rounded-md">Loading</Skeleton>}>
							<EditingSurveys />
						</Suspense>
					</section>
				</section>
				<section className="flex flex-row flex-wrap gap-4">
					{isAllowed(user, 'surveys.create') && <SurveyCreateForm />}
					<SurveyInvitationClaimForm />
				</section>
			</div>
		</>
	);
}
