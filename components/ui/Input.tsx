import { forwardRef } from 'react';
import { cn } from '@/lib/utils/cn';

export const Input = forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
	({ className, ...props }, ref) => (
		<input
			ref={ref}
			className={cn(
				'h-12 w-full rounded-control border border-border bg-surface px-4 text-sm text-text-primary placeholder:text-text-secondary transition-all duration-200 focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent focus:shadow-[0_0_12px_-2px_rgba(108,92,231,0.5)]',
				className,
			)}
			{...props}
		/>
	),
);
Input.displayName = 'Input';

export const Textarea = forwardRef<HTMLTextAreaElement, React.TextareaHTMLAttributes<HTMLTextAreaElement>>(
	({ className, ...props }, ref) => (
		<textarea
			ref={ref}
			className={cn(
				'w-full rounded-control border border-border bg-surface px-4 py-3 text-sm text-text-primary placeholder:text-text-secondary transition-all duration-200 focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent focus:shadow-[0_0_12px_-2px_rgba(108,92,231,0.5)]',
				className,
			)}
			{...props}
		/>
	),
);
Textarea.displayName = 'Textarea';
