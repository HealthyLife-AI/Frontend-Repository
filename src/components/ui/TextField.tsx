import { forwardRef } from "react";
import clsx from "clsx";

type TextFieldProps = React.InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  error?: string;
  icon?: string;
  trailingAction?: React.ReactNode;
};

export const TextField = forwardRef<HTMLInputElement, TextFieldProps>(
  ({ label, error, icon, trailingAction, className, id, ...props }, ref) => {
    const inputId = id ?? props.name;
    return (
      <div className="flex flex-col gap-1.5">
        <label
          htmlFor={inputId}
          className="text-xs font-medium tracking-wide text-on-surface-variant"
        >
          {label}
        </label>
        <div className="relative flex items-center">
          {icon && (
            <span className="material-symbols-outlined pointer-events-none absolute start-4 text-outline">
              {icon}
            </span>
          )}
          <input
            ref={ref}
            id={inputId}
            className={clsx(
              "w-full rounded-lg border border-outline-variant bg-surface-container-lowest px-4 py-3 text-sm text-on-surface outline-none placeholder:text-outline focus:border-primary",
              icon && "ps-11",
              trailingAction && "pe-11",
              error && "border-error",
              className,
            )}
            {...props}
          />
          {trailingAction && (
            <div className="absolute end-3">{trailingAction}</div>
          )}
        </div>
        {error && <p className="text-xs text-error">{error}</p>}
      </div>
    );
  },
);
TextField.displayName = "TextField";
