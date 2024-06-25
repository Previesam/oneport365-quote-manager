import {
  HTMLAttributes,
  InputHTMLAttributes,
  LabelHTMLAttributes,
  ReactNode,
  forwardRef,
  useEffect,
  useState,
} from "react";
import { twMerge } from "tw-merge";

export interface InputProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "ref"> {
  valuePrefix?: "";
  valueSuffix?: "";
  label?: string;
  error?: boolean;
  errorText?: string;
  infoText?: string;
  labelProps?: InputLabelProps;
  errorProps?: InputErrorProps;
  infoProps?: InputInfoProps;
  startAdornment?: ReactNode;
  endAdornment?: ReactNode;
}

export interface InputLabelProps
  extends Omit<LabelHTMLAttributes<HTMLLabelElement>, "ref"> {}

export interface InputErrorProps
  extends Omit<HTMLAttributes<HTMLParagraphElement>, "ref"> {}

export interface InputInfoProps
  extends Omit<HTMLAttributes<HTMLParagraphElement>, "ref"> {}

const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  props,
  ref
) {
  const {
    valuePrefix = "",
    valueSuffix = "",
    label = "",
    labelProps = undefined,
    errorProps = undefined,
    infoProps = undefined,
    startAdornment = undefined,
    endAdornment = undefined,
    error = false,
    errorText = "",
    infoText = "",
    ...rest
  } = props;

  const [value, setValue] = useState<any>(
    props?.type == "checkbox"
      ? props?.checked || props?.defaultChecked || ""
      : props?.value || props?.defaultValue || ""
  );

  useEffect(() => {
    console.log("Changed");
    if (props.type == "checkbox") {
      setValue(props?.checked || props?.defaultChecked);
    } else {
      setValue(props?.value || props?.defaultValue || "");
    }
  }, [props?.type, props.checked]);

  function preInput(e: any) {
    if (props?.type !== "checkbox") {
      e.target.value = (e?.target?.value || "")
        ?.replace(props.valuePrefix, "")
        ?.replace(props.valueSuffix, "");

      setValue(e?.target?.value);
    } else {
      setValue(e?.target?.checked ? true : false);
    }
    if (props.onInput) {
      props?.onInput(e);
    }
  }

  function preChange(e: any) {
    if (props?.type !== "checkbox") {
      e.target.value = (e?.target?.value || "")
        ?.replace(props.valuePrefix, "")
        ?.replace(props.valueSuffix, "");

      setValue(e?.target?.value);
    } else {
      setValue(e?.target?.checked ? true : false);
    }
    if (props.onChange) {
      props?.onChange(e);
    }
  }

  return (
    <>
      {label ? (
        <label
          htmlFor={props.id}
          {...labelProps}
          className={twMerge(
            `text-light text-sm leading-[16.94px] block mb-[8px] ${
              labelProps?.className || ""
            }`
          )}
        >
          {label}
        </label>
      ) : (
        <></>
      )}
      <div
        className={twMerge(
          `relative px-[2px] ${props.type == "checkbox" ? "px-0" : ""}`
        )}
      >
        <input
          ref={ref}
          {...rest}
          className={twMerge(
            `text-sm rounded leading-[19.94px] font-medium placeholder:text-placeholder border border-border3 py-2.5 ${
              error
                ? "border-danger hover:border-primary focus:border-danger focus:ring-danger"
                : "border-border3 hover:border-primary focus:border-primary focus:ring-primary"
            } ${startAdornment ? "pl-[32px]" : "pl-[10px]"} ${
              endAdornment ? "pr-[32px]" : "pr-[10px]"
            } ${
              props?.type == "checkbox"
                ? "!text-primary hover:border-primary focus:ring-0 w-[20px] h-[20px] !p-0"
                : "text-input w-full"
            } ${
              props?.type == "radio" && value
                ? "!text-primary checked:[background-image:'']"
                : ""
            } ${rest?.className || ""}`
          )}
          value={`${valuePrefix}${value}${valueSuffix}`}
          checked={
            props?.type == "checkbox" ? (value ? true : false) : undefined
          }
          onInput={preInput}
          onChange={preChange}
        />
        {startAdornment ? (
          <div className="absolute top-0 left-0 h-full w-[40px] grid place-items-center z-10">
            {startAdornment}
          </div>
        ) : (
          <></>
        )}
        {endAdornment ? (
          <div className="absolute top-0 right-0 h-full w-[40px] grid place-items-center z-10">
            {endAdornment}
          </div>
        ) : (
          <></>
        )}
      </div>
      {!error && infoText ? (
        <p
          {...infoProps}
          className={twMerge(
            `text-light text-xs leading-[16.94px] mt-[5px] ${
              infoProps?.className || ""
            }`
          )}
        >
          {infoText}
        </p>
      ) : error && errorText ? (
        <p
          {...errorProps}
          className={twMerge(
            `text-danger text-xs leading-[16.94px] mt-[5px] ${
              errorProps?.className || ""
            }`
          )}
        >
          {errorText}
        </p>
      ) : (
        <></>
      )}
    </>
  );
});

export default Input;
