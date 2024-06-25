import { forwardRef } from "react";
import { twMerge } from "tw-merge";
import {
  default as BaseDatepicker,
  DatepickerType,
} from "react-tailwindcss-datepicker";

type TextFieldProps = DatepickerType & {
  label?: string;
  error?: boolean;
  errorText?: string;
  infoText?: string;
  required?: boolean;
  onChange?: (value: {
    startDate: string | null;
    endDate: string | null;
  }) => void;
};

export const DatePicker = forwardRef<HTMLInputElement, TextFieldProps>(
  (props) => {
    return (
      <>
        {props?.label && (
          <label
            htmlFor={props?.inputId}
            className="text-light text-sm leading-[16.94px] block mb-[8px]"
          >
            {props?.label}
            {props?.required && (
              <span className="text-danger ml-1 inline-block">*</span>
            )}
          </label>
        )}
        <BaseDatepicker
          {...props}
          primaryColor="green"
          inputClassName={twMerge(
            `w-full z-[5] text-sm font-normal leading-5 px-2 py-2 rounded-[5px] border border-solid border-border3 hover:border-primary focus:border-primary focus-visible:ring-primary bg-white text-input disabled:opacity-60 disabled:bg-gray-50 ${
              props?.error
                ? "border-danger hover:border-danger focus:border-danger focus-visible:ring-danger "
                : ""
            } ${props.inputClassName || ""}`
          )}
          placeholder={props?.placeholder || " "}
        />
        {props?.error ? (
          <p className="text-danger mt-[2px] text-xs">{props?.errorText}</p>
        ) : props?.infoText ? (
          <p className="text-light mt-[2px] text-xs">{props?.infoText}</p>
        ) : (
          ""
        )}
      </>
    );
  }
);
