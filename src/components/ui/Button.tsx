import { forwardRef } from "react";
import clsx from "clsx";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "ghost";
  fullWidth?: boolean;
  loading?: boolean;
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = "primary",
      fullWidth,
      loading,
      className,
      children,
      disabled,
      ...props
    },
    ref,
  ) => {
    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        className={clsx(
          "inline-flex items-center justify-center gap-2 rounded-full px-6 py-3.5 text-sm font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-60",
          variant === "primary" &&
            "bg-primary text-on-primary hover:bg-primary-container",
          variant === "secondary" &&
            "border border-outline-variant bg-transparent text-primary hover:bg-primary-fixed",
          variant === "ghost" &&
            "bg-transparent text-primary hover:bg-primary-fixed/60",
          fullWidth && "w-full",
          className,
        )}
        {...props}
      >
        {loading && (
          <span className="material-symbols-outlined animate-spin text-base">
            progress_activity
          </span>
        )}
        {children}
      </button>
    );
  },
);
Button.displayName = "Button";
