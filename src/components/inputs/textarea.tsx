import { forwardRef } from "react";
import {
  TextareaAutosize,
  TextareaAutosizeProps,
} from "@mui/base/TextareaAutosize";
import { twMerge } from "tw-merge";

type TextAreaProps = TextareaAutosizeProps & {
  label?: string;
  errorText?: string;
  infoText?: string;
  error?: boolean;
};

export const TextArea = forwardRef<HTMLTextAreaElement, TextAreaProps>(
  (props, ref) => {
    return (
      <>
        {props?.label && (
          <label
            htmlFor={props?.id}
            className="text-light text-sm leading-[16.94px] block mb-[8px]"
          >
            {props?.label}
            {props?.required && (
              <span className="text-danger inline-block ml-1">*</span>
            )}
          </label>
        )}
        <TextareaAutosize
          ref={ref}
          minRows={3}
          maxRows={3}
          {...props}
          className={twMerge(
            "w-full text-sm font-normal resize-none leading-5 px-3 py-3 rounded-[5px] border border-solid border-border3 hover:border-primary focus:border-primary focus-visible:ring-primary focus-visible:outline-none bg-white text-input disabled:opacity-60 disabled:bg-gray-50 " +
              `${
                props?.error &&
                "border-danger hover:border-danger focus:border-danger focus-visible:ring-danger "
              }` +
              props?.className
          )}
        />
        {props?.error ? (
          <p className="text-danger text-xs mt-[2px]">{props?.errorText}</p>
        ) : props?.infoText ? (
          <p className="text-xs text-light">{props?.infoText}</p>
        ) : (
          ""
        )}
      </>
    );
  }
);
