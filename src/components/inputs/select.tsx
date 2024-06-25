import { forwardRef, useState } from "react";
import {
  Select as BaseSelect,
  SelectRootSlotProps,
  SelectProps,
} from "@mui/base/Select";
import {
  Option as BaseOption,
  OptionProps,
  OptionOwnerState,
} from "@mui/base/Option";
import clsx from "clsx";
import { Icon, loadIcon } from "@iconify/react/dist/iconify.js";
import { unstable_useForkRef as useForkRef } from "@mui/utils";
import { twMerge } from "tw-merge";

const getOptionColorClasses = ({
  selected,
  highlighted,
  disabled,
}: Partial<OptionOwnerState<number>>) => {
  let classes = "";
  if (disabled) {
    classes += "text-gray-400";
  } else {
    if (selected) {
      classes += " bg-primary/20 text-primary";
    } else if (highlighted) {
      classes += " bg-gray-50 text-text";
    }
    classes += " hover:bg-gray-50 hover:text-text";
  }
  return classes;
};

export const Option = forwardRef<HTMLLIElement, OptionProps<number | string>>(
  (props, ref) => {
    return (
      <BaseOption
        ref={ref}
        {...props}
        slotProps={{
          root: ({ selected, highlighted, disabled }) => ({
            className: `list-none p-2 rounded-[5px] cursor-default last-of-type:border-b-0 ${getOptionColorClasses(
              { selected, highlighted, disabled }
            )}`,
          }),
        }}
      />
    );
  }
);

loadIcon("material-symbols-light:unfold-more-rounded");

const Button = forwardRef(function Button<
  TValue extends Record<any, any>,
  Multiple extends boolean
>(
  props: SelectRootSlotProps<TValue, Multiple>,
  ref: React.ForwardedRef<HTMLButtonElement>
) {
  const { ownerState: _, ...other } = props;

  console.log(_);

  return (
    <button type="button" {...other} ref={ref}>
      {other.children}
      <Icon
        icon="material-symbols-light:unfold-more-rounded"
        className="text-sm"
      />
    </button>
  );
});

const resolveSlotProps = (fn: any, args: any) =>
  typeof fn === "function" ? fn(args) : fn;

export type SelectFieldProps<
  TValue extends Record<any, any> | string | number,
  Multiple extends boolean
> = SelectProps<TValue, Multiple> & {
  error?: boolean;
  label?: string;
  errorText?: string;
  infoText?: string;
};

export const Select = forwardRef(function CustomSelect<
  TValue extends Record<any, any> | string | number,
  Multiple extends boolean
>(
  props: SelectFieldProps<TValue, Multiple>,
  ref: React.ForwardedRef<HTMLButtonElement>
) {
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);

  const rootRef = useForkRef(ref, (value) => setAnchorEl(value as any));

  return (
    <>
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
      <div className="relative w-full">
        <BaseSelect
          ref={rootRef}
          renderValue={
            props?.renderValue ||
            ((option: any) => {
              if (!option) {
                return <>{props?.placeholder || ""}</>;
              } else {
                return <>{option?.label}</>;
              }
            })
          }
          {...props}
          slots={{
            root: Button,
            ...props.slots,
          }}
          className={clsx(
            "CustomSelect",
            props.className,
            (!props?.multiple && !props?.value) ||
              (props?.multiple && (props?.value as any)?.length < 1)
              ? "text-gray-400"
              : ""
          )}
          slotProps={{
            ...props.slotProps,
            root: (ownerState) => {
              const resolvedSlotProps = resolveSlotProps(
                props.slotProps?.root,
                ownerState
              );
              return {
                ...resolvedSlotProps,
                className: twMerge(
                  `relative text-sm font-medium placeholder:text-placeholder box-border w-full px-3 py-2.5 rounded-[5px] text-left bg-white border border-solid focus:ring-1 focus-visible:outline-0 focus-visible:ring-1 focus-within:ring-1 text-input transition-all [&>svg]:text-base	[&>svg]:absolute [&>svg]:h-full [&>svg]:top-0 [&>svg]:right-2.5 disabled:opacity-60 disabled:bg-gray-50 ${
                    props?.error
                      ? "border-danger hover:border-danger ring-danger"
                      : "border-border1 hover:border-primary focus:border-primary focus-visible:border-primary focus-within:border-primary ring-primary"
                  } ${
                    (!ownerState?.multiple && !ownerState.value) ||
                    (ownerState?.multiple &&
                      (ownerState?.value as any)?.length < 1)
                      ? "text-placeholder"
                      : "text-input"
                  } ${resolvedSlotProps?.className || ""}`
                ),
              };
            },
            listbox: (ownerState) => {
              const resolvedSlotProps = resolveSlotProps(
                props.slotProps?.listbox,
                ownerState
              );
              return {
                ...resolvedSlotProps,
                className: twMerge(
                  `text-sm p-1.5 my-3 w-full rounded-[5px] overflow-auto outline-0 bg-white border border-solid border-light text-input shadow shadow-slate-200 ${
                    resolvedSlotProps?.className || ""
                  }`
                ),
              };
            },
            popup: (ownerState) => {
              const resolvedSlotProps = resolveSlotProps(
                props?.slotProps?.popup,
                ownerState
              );
              return {
                ...resolvedSlotProps,
                anchorEl: anchorEl,
                className: twMerge(
                  `relative z-[99999999] ${resolvedSlotProps?.className || ""}`
                ),
                style: {
                  width: anchorEl?.offsetWidth,
                },
              };
            },
          }}
          onChange={(...args) => {
            if (args?.includes(null)) return;
            props?.onChange!(args[0], args[1]);
          }}
        />
      </div>
      {props.error ? (
        <p className="text-danger mt-[2px] text-xs">{props?.errorText}</p>
      ) : props?.infoText ? (
        <p className="text-light mt-[2px] text-xs">{props?.infoText}</p>
      ) : (
        ""
      )}
    </>
  );
});
