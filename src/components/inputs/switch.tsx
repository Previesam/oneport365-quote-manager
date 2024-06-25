import { forwardRef, useRef, useState } from "react";
import { twMerge } from "tw-merge";
import { SwitchProps as BaseSwitchProps } from "@mui/base";

// const resolveSlotProps = (fn: any, args: any) =>
//   typeof fn === "function" ? fn(args) : fn;

type SwitchProps = BaseSwitchProps & {
  name?: string;
  error?: boolean;
  label?: string;
  errorText?: string;
  infoText?: string;
};

export const Switch = forwardRef<HTMLInputElement, SwitchProps>(
  (props, ref) => {
    const [checked, setChecked] = useState(props.checked || false);

    const rootRef: any = useRef(null);

    function preChange(e: any) {
      setChecked(e?.target?.checked ? true : false);
      if (props.onChange) {
        props.onChange(e);
      }
    }
    return (
      <>
        <div
          className={twMerge(
            `flex items-center w-full gap-2 justify-between ${
              props.disabled ? "cursor-not-allowed" : "cursor-pointer"
            } ${props.className || ""}`
          )}
          onClick={() => {
            if (props?.disabled) return false;
            if (ref) {
              (ref as any)?.current?.click();
            } else if (rootRef) {
              rootRef?.current?.click();
            }
          }}
        >
          <div>
            {props?.label && (
              <label
                htmlFor={props?.id}
                className={twMerge(
                  `text-light text-sm leading-[16.94px] block mb-[8px] ${
                    props.disabled ? "cursor-not-allowed" : "cursor-pointer"
                  }`
                )}
              >
                {props?.label}
                {props?.required && (
                  <span className="text-danger inline-block ml-1">*</span>
                )}
              </label>
            )}
            {props?.infoText ? (
              <p className="text-xs text-text">{props?.infoText}</p>
            ) : (
              ""
            )}
          </div>
          <input
            {...props}
            type="checkbox"
            ref={ref || rootRef}
            onChange={preChange}
            className="hidden"
            id={props?.id}
          />
          <div
            className={twMerge(
              `switch w-[38px] min-w-[38px] h-[22px] border border-border rounded-r-full rounded-l-full p-0.5 ${
                checked ? "bg-primary/10" : "bg-white"
              } ${(props?.slotProps?.input as any)?.className || ""}`
            )}
          >
            <div
              className={twMerge(
                `flex thumb h-full min-h-full aspect-square rounded-full top-0 ${
                  checked ? "bg-primary ml-auto" : "bg-light"
                }`
              )}
            ></div>
          </div>
        </div>
        {props.error ? (
          <p className="text-danger text-xs mt-[2px]">{props?.errorText}</p>
        ) : (
          ""
        )}
      </>
    );
  }
);
