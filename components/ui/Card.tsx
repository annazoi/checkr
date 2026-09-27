import { cn } from '@/lib/utils/cn';

type CardProps = React.HTMLAttributes<HTMLDivElement> & {
	as?: 'div' | 'section' | 'article';
};

export function Card({ className, as: As = 'div', ...props }: CardProps) {
	return (
		<As
			className={cn('rounded-card border border-border bg-surface p-5 transition-colors duration-200', className)}
			{...props}
		/>
	);
}
