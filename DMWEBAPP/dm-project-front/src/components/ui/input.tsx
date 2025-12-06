import * as React from "react";
import { cn } from "@/lib/utils";
import { Eye, EyeOff } from "lucide-react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  startIcon?: React.ReactNode;
  endIcon?: React.ReactNode;
  divClassName?: string;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, startIcon, endIcon, divClassName, ...props }, ref) => {
    return (
      <div className={cn("relative flex items-center", divClassName)}>
        {/* Start Icon */}
        {startIcon && (
          <div className="absolute start-3 text-muted-foreground flex items-center">
            {startIcon}
          </div>
        )}

        <input
          type={type}
          ref={ref}
          data-slot="input"
          className={cn(
            "file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none md:text-sm",
            "focus-visible:border-ring p-5 focus-visible:ring-ring/50 focus-visible:ring-[3px]",
            startIcon ? "!ps-10" : "",
            endIcon ? "!pe-10" : "",
            className
          )}
          {...props}
        />

        {/* End Icon */}
        {endIcon && (
          <div className="absolute end-3 text-muted-foreground flex items-center">
            {endIcon}
          </div>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";
export { Input };

interface PasswordInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  startIcon?: React.ReactNode;
}

const PasswordInput = React.forwardRef<HTMLInputElement, PasswordInputProps>(
  ({ className, startIcon, ...props }, ref) => {
    const [showPassword, setShowPassword] = React.useState(false);

    return (
      <Input
        ref={ref}
        startIcon={startIcon}
        type={showPassword ? "text" : "password"}
        className={cn(startIcon ? "!ps-10" : "", "!pe-10", className)}
        endIcon={
          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            className="absolute end-2 top-1/2 -translate-y-1/2 
                     text-muted-foreground hover:text-foreground"
            tabIndex={-1}>
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        }
        {...props}
      />
    );
  }
);

PasswordInput.displayName = "PasswordInput";
export { PasswordInput };
