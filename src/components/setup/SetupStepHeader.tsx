import clsx from "clsx";

type SetupStepHeaderProps = {
  step: number;
  total: number;
  labels: string[];
  title: string;
  subtitle: string;
};

export function SetupStepHeader({
  step,
  total,
  labels,
  title,
  subtitle,
}: SetupStepHeaderProps) {
  return (
    <div className="mb-8">
      <ol className="mb-8 flex items-center justify-center gap-2 text-xs font-medium text-on-surface-variant">
        {labels.map((label, i) => {
          const stepNumber = i + 1;
          const state =
            stepNumber < step
              ? "done"
              : stepNumber === step
                ? "active"
                : "upcoming";
          return (
            <li key={label} className="flex items-center gap-2">
              <span
                className={clsx(
                  "flex h-6 w-6 items-center justify-center rounded-full text-[11px]",
                  state === "done" && "bg-primary text-on-primary",
                  state === "active" &&
                    "border-2 border-primary text-primary",
                  state === "upcoming" &&
                    "border border-outline-variant text-outline",
                )}
              >
                {state === "done" ? (
                  <span className="material-symbols-outlined text-sm">
                    check
                  </span>
                ) : (
                  stepNumber
                )}
              </span>
              <span
                className={clsx(
                  state === "active" && "text-on-surface",
                  "hidden sm:inline",
                )}
              >
                {label}
              </span>
              {stepNumber !== total && (
                <span className="mx-1 h-px w-4 bg-outline-variant" />
              )}
            </li>
          );
        })}
      </ol>
      <h1 className="text-center text-2xl font-bold text-on-surface">
        {title}
      </h1>
      <p className="mx-auto mt-2 max-w-md text-center text-sm text-on-surface-variant">
        {subtitle}
      </p>
    </div>
  );
}
