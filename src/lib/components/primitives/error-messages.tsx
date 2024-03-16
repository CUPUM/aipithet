import { cn } from '../utilities';

export function ErrorMessages<
	T extends React.ComponentProps<'label'> & {
		errors: string[] | undefined;
	},
>({ errors, className, ...restProps }: T) {
	if (!errors || !errors.length) {
		return null;
	}
	return (
		<label
			className={cn(
				'right flex flex-col gap-1 self-stretch text-left text-xs italic text-destructive opacity-75',
				className
			)}
			{...restProps}
		>
			{errors.map((errorString, i) => (
				<span key={i} className="animate-fly-down" style={{ animationDelay: `${i * 50}ms` }}>
					{errorString}
				</span>
			))}
		</label>
	);
}
