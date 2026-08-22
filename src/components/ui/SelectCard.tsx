import clsx from "clsx";

type SelectCardProps = {
  name: string;
  value: string;
  checked: boolean;
  onChange: (value: string) => void;
  icon?: string;
  title: string;
  description?: string;
  layout?: "row" | "column";
};

export function SelectCard({
  name,
  value,
  checked,
  onChange,
  icon,
  title,
  description,
  layout = "row",
}: SelectCardProps) {
  return (
    <label
      className={clsx(
        "relative flex cursor-pointer items-center gap-4 rounded-lg border bg-surface-container-lowest p-4 transition-colors",
        layout === "column" && "flex-col items-start text-start",
        checked
          ? "border-2 border-primary bg-primary-fixed"
          : "border border-outline-variant hover:border-primary/50",
      )}
    >
      <input
        type="radio"
        name={name}
        value={value}
        checked={checked}
        onChange={() => onChange(value)}
        className="sr-only"
      />
      {icon && (
        <span
          className={clsx(
            "material-symbols-outlined text-2xl",
            checked ? "text-primary" : "text-secondary",
          )}
        >
          {icon}
        </span>
      )}
      <span className="flex-1">
        <span className="block text-sm font-semibold text-on-surface">
          {title}
        </span>
        {description && (
          <span className="mt-0.5 block text-xs text-on-surface-variant">
            {description}
          </span>
        )}
      </span>
      {checked && (
        <span className="material-symbols-outlined absolute top-3 end-3 text-primary">
          check_circle
        </span>
      )}
    </label>
  );
}
