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
				'self-stretch text-left flex right flex-col gap-1 text-xs text-destructive italic opacity-75',
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
