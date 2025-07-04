import * as React from "react";

interface FloatingLabelInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  tooltip?: string;
}

export const FloatingLabelInput = React.forwardRef<HTMLInputElement, FloatingLabelInputProps>(
  ({ label, tooltip, className = "", ...props }, ref) => {
    const [focused, setFocused] = React.useState(false);
    const hasValue = props.value !== undefined && props.value !== "";
    return (
      <div className={"relative w-full " + className}>
        <input
          ref={ref}
          {...props}
          className={
            "peer block w-full rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white/70 dark:bg-zinc-800/70 px-4 pt-6 pb-2 text-base text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-400 transition placeholder-transparent shadow-sm " +
            (props.disabled ? "opacity-60 cursor-not-allowed " : "")
          }
          onFocus={(e) => {
            setFocused(true);
            props.onFocus?.(e);
          }}
          onBlur={(e) => {
            setFocused(false);
            props.onBlur?.(e);
          }}
        />
        <label
          className={
            "absolute left-4 top-2 text-zinc-500 dark:text-zinc-400 text-sm pointer-events-none transition-all duration-200 " +
            ((focused || hasValue) ? "-translate-y-1 scale-90" : "translate-y-4 scale-100")
          }
        >
          {label}
          {tooltip && (
            <span className="ml-1 text-xs text-zinc-400" title={tooltip}>?</span>
          )}
        </label>
      </div>
    );
  }
);
FloatingLabelInput.displayName = "FloatingLabelInput";
