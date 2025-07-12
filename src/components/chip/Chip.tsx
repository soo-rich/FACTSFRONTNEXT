import React from 'react';
import { X } from 'lucide-react';


type ChipVariant = 'default' | 'primary' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'success' | 'warning';
type ChipSize = 'sm' | 'md' | 'lg';


const chipVariants: Record<ChipVariant, string> = {
	default: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
	primary: "bg-primary text-primary-foreground hover:bg-primary/90",
	destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
	outline: "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
	secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
	ghost: "hover:bg-accent hover:text-accent-foreground",
	success: "bg-green-500 text-white hover:bg-green-600",
	warning: "bg-yellow-500 text-black hover:bg-yellow-600",
};

const chipSizes: Record<ChipSize, string> = {
	sm: "h-6 px-2 text-xs",
	md: "h-8 px-3 text-sm",
	lg: "h-10 px-4 text-base",
};


interface ChipProps extends React.HTMLAttributes<HTMLDivElement> {
	variant?: ChipVariant;
	size?: ChipSize;
	onRemove?: () => void;
	children: React.ReactNode;
	disabled?: boolean;
}


const Chip = React.forwardRef<HTMLDivElement, ChipProps>(({
	                                                          className = "",
	                                                          variant = "default",
	                                                          size = "md",
	                                                          onRemove,
	                                                          children,
	                                                          disabled = false,
	                                                          ...props
                                                          }, ref) => {
	const baseClasses = "inline-flex items-center justify-center rounded-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50";

	const variantClasses = chipVariants[variant] || chipVariants.default;
	const sizeClasses = chipSizes[size] || chipSizes.md;

	return (
		<div
			ref={ref}
			className={`${baseClasses} ${variantClasses} ${sizeClasses} ${className}`}
			{...props}
		>
			{children}
			{onRemove && (
				<button
					onClick={onRemove}
					disabled={disabled}
					className="ml-1 h-4 w-4 rounded-full hover:bg-black/10 focus:outline-none focus:ring-1 focus:ring-offset-1 flex items-center justify-center"
					aria-label="Supprimer"
				>
					<X className="h-3 w-3" />
				</button>
			)}
		</div>
	);
});

Chip.displayName = "Chip";

export {Chip}