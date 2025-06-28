import * as React from "react";

import {cn} from "@/lib/utils";
import {Eye, EyeOff, Lock, LucideIcon} from 'lucide-react';


type InputWithIconProps = {
    icon: LucideIcon;
    iconPosition?: 'left' | 'right';
    className?: string;
} & React.InputHTMLAttributes<HTMLInputElement>;


function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      className={cn(
        "file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input flex h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
        "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
        "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
        className,
      )}
      data-slot="input"
      type={type}
      {...props}
    />
  );
}

const PasswordInput = ({ className = '', ...props }) => {
    const [showPassword, setShowPassword] = React.useState(false);

    return (
        <div className="relative">
            <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
                type={showPassword ? 'text' : 'password'}
                className={`pl-10 pr-10 ${className}`}
                {...props}
            />
            <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
        </div>
    );
};
const InputWithIcon = ({
                           icon: Icon,
                           iconPosition = 'left',
                           className,
                           ...props
                       }: InputWithIconProps) => {
    return (
        <div className="relative w-full">
            {iconPosition === 'left' && (
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-muted-foreground">
          <Icon className="h-4 w-4" />
        </span>
            )}

            <Input {...props} className={cn(iconPosition === 'left' ? 'pl-9' : 'pr-9', className)} />

            {iconPosition === 'right' && (
                <span className="absolute inset-y-0 right-0 flex items-center pr-3 text-muted-foreground">
          <Icon className="h-4 w-4" />
        </span>
            )}
        </div>
    );
};

export { Input ,PasswordInput, InputWithIcon};
