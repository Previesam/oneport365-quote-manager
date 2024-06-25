import * as React from "react";
import {
  useAutocomplete,
  UseAutocompleteProps,
} from "@mui/base/useAutocomplete";
import { Button } from "@mui/base/Button";
import { Popper } from "@mui/base/Popper";
import { unstable_useForkRef as useForkRef } from "@mui/utils";
import { Icon, loadIcon } from "@iconify/react/dist/iconify.js";
import { twMerge } from "tw-merge";
import { SelectFieldProps } from "./select";

loadIcon("ic:sharp-clear");
loadIcon("mdi:chevron-down");

export interface AutocompleteProps
  extends UseAutocompleteProps<
    { label: string; value: string | number } | undefined,
    boolean,
    boolean,
    boolean
  > {
  required?: boolean;
  placeholder?: string;
  error?: boolean;
  label?: string;
  errorText?: string;
  infoText?: string;
  multiple?: boolean;
  slotProps?: SelectFieldProps<any, any>["slotProps"] & {
    input?: React.InputHTMLAttributes<HTMLInputElement>;
    clear?: React.HTMLAttributes<HTMLButtonElement>;
    indicator?: React.HTMLAttributes<HTMLButtonElement>;
  };
  startAdornment?: React.ReactNode;
}

export const Autocomplete = React.forwardRef(function Autocomplete(
  props: AutocompleteProps,
  ref: React.ForwardedRef<HTMLDivElement>
) {
  const {
    disableClearable = false,
    disabled = false,
    readOnly = false,
    options,
    isOptionEqualToValue = (option, value) => {
      return option?.value === value?.value;
    },
    ...other
  } = props;

  const {
    getRootProps,
    getInputProps,
    getPopupIndicatorProps,
    getClearProps,
    getListboxProps,
    getOptionProps,
    dirty,
    id,
    popupOpen,
    anchorEl,
    setAnchorEl,
    groupedOptions,
    value,
  } = useAutocomplete({
    ...props,
    componentName: "BaseAutocomplete",
    isOptionEqualToValue: isOptionEqualToValue,
    options,
  });

  const hasClearIcon = !disableClearable && !disabled && dirty && !readOnly;

  const rootRef = useForkRef(ref, setAnchorEl);

  return (
    <React.Fragment>
      {props?.label && (
        <label
          htmlFor={props?.id}
          className="text-light text-sm leading-[16.94px] block mb-[8px]"
        >
          {props?.label}
          {props?.required && (
            <span className="text-danger ml-1 inline-block">*</span>
          )}
        </label>
      )}
      {props?.multiple && ((value as any) || [])?.length > 0 && (
        <>
          <div className="mb-3 mt-2 flex flex-wrap gap-2">
            {(value as any)?.map((val: any) => (
              <div
                key={val?.value}
                className="border-border w-fit rounded-l-full rounded-r-full border bg-gray-100 px-2 py-2 text-xs"
              >
                {val?.label}
              </div>
            ))}
          </div>
        </>
      )}
      <div
        {...getRootProps(other)}
        ref={rootRef}
        className={twMerge(
          `relative border-border3 text-input flex w-full max-w-full gap-[5px] overflow-hidden rounded-[5px] border border-solid bg-white focus-within:ring-1 focus:ring-1 focus-visible:outline-0 focus-visible:ring-1 disabled:bg-gray-50 disabled:opacity-60 
          ${
            props?.error
              ? "!border-danger hover:border-danger !ring-danger"
              : "border-border3 hover:border-primary focus:border-primary focus-visible:border-primary focus-within:border-primary ring-primary"
          } 
          ${(props?.slotProps?.root as any)?.className || ""}
        `
        )}
      >
        {props?.startAdornment ? (
          <div className="absolute top-0 left-0 h-full w-fit flex items-center justify-center gap-0.5 p-2.5">
            {props?.startAdornment}
          </div>
        ) : (
          <></>
        )}
        <input
          id={id}
          disabled={disabled}
          readOnly={readOnly}
          {...getInputProps()}
          className={twMerge(
            `shrink-0 py-2.5 px-10 pl-[10px] grow basis-auto w-full rounded-[inherit] border-0 bg-inherit leading-[1.5] [font-size:inherit] [font-weight:inherit] placeholder:text-placeholder outline-0 focus:ring-0 disabled:bg-gray-50 disabled:opacity-60 ${
              props?.startAdornment ? "px-[40px]" : ""
            } 
              ${(props?.slotProps?.input as any)?.className || ""}
          `
          )}
          placeholder={props.placeholder}
          onChange={getInputProps().onChange}
        />
        <div className="absolute top-0 right-0 h-full w-fit flex items-center justify-center gap-0.5 p-2.5">
          {hasClearIcon && (
            <Button
              {...getClearProps()}
              className={twMerge(
                `-mt-1 self-center rounded-[4px] border-0 bg-transparent px-0.5 pb-0.5 flex items-center shadow-none outline-0 hover:cursor-pointer hover:bg-violet-100 dark:hover:bg-gray-700 text-sm ${
                  (props?.slotProps?.clear as any)?.className || ""
                }`
              )}
            >
              <Icon
                icon="ic:sharp-clear"
                className="scale-90 [font-size:inherit] min-w-fit"
              />
            </Button>
          )}
          <Button
            {...getPopupIndicatorProps()}
            className={twMerge(
              `-mt-1 self-center rounded-[4px] border-0 bg-transparent p-0 shadow-none outline-0 hover:cursor-pointer translate-y-[2px] transition-transform duration-500 text-2xl text-gray-400
              ${popupOpen ? "rotate-180" : ""} 
                ${getPopupIndicatorProps()?.className || ""} ${
                (props?.slotProps?.indicator as any)?.className || ""
              }
            `
            )}
          >
            <Icon
              icon="mdi:chevron-down"
              className="text-inherit [font-size:inherit] min-w-fit"
            />
          </Button>
        </div>
      </div>
      {anchorEl && (
        <Popper
          open={popupOpen}
          anchorEl={anchorEl}
          slotProps={{
            root: {
              className: "relative z-[99999999]", // z-index: 1001 is needed to override ComponentPageTabs with z-index: 1000
              style: { width: "100%", maxWidth: anchorEl.clientWidth },
            },
          }}
          modifiers={[
            { name: "flip", enabled: false },
            { name: "preventOverflow", enabled: false },
          ]}
        >
          <ul
            {...getListboxProps()}
            className={twMerge(
              `z-[1] mx-0 my-3 box-border max-h-[300px] min-w-[320px] overflow-auto rounded-xl border border-solid border-gray-200 bg-white p-1.5 text-sm text-gray-900 shadow-[0_4px_30px_transparent] shadow-gray-200 outline-0 dark:shadow-gray-900 ${
                (props?.slotProps?.listbox as any)?.className || ""
              }`
            )}
            id="options-ctn"
          >
            {(groupedOptions as AutocompleteProps["options"]).map(
              (option: any, index) => {
                const optionProps = getOptionProps({ option, index });

                return (
                  <li
                    {...optionProps}
                    className="aria-selected:bg-primary/30 aria-selected:text-primary cursor-default list-none rounded-lg p-2 last-of-type:border-b-0 focus-within:bg-gray-50 hover:cursor-pointer hover:bg-gray-50 focus:bg-gray-50 flex gap-2 items-center"
                  >
                    {option?.icon ? option?.icon : <></>}
                    {option.label}
                  </li>
                );
              }
            )}
            {groupedOptions.length === 0 && (
              <li className="cursor-default list-none p-2">No results</li>
            )}
          </ul>
        </Popper>
      )}
      {props?.error ? (
        <p className="text-danger mt-[2px] text-xs">{props?.errorText}</p>
      ) : props?.infoText ? (
        <p className="text-light mt-[2px] text-xs">{props?.infoText}</p>
      ) : (
        ""
      )}
    </React.Fragment>
  );
});
