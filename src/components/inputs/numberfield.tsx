import { Fragment, HTMLProps, forwardRef, useState } from "react";
import { twMerge } from "tw-merge";
import { useIMask } from "react-imask";

export type NumberFieldProps = HTMLProps<HTMLInputElement> & {
  variant?: "default" | "floating" | "mini";
  color?: "white" | "gray";
  error?: boolean;
  errorText?: string;
  infoText?: string;
  labelProps?: HTMLProps<HTMLLabelElement>;
  scale?: number;
  step?: number;
  mask?: string | RegExp | NumberConstructor | DateConstructor | undefined;
  thousandSeparator?: string;
  radix?: string;
  padFractionalZeros?: boolean;
  normalizeZeros?: boolean;
  mapToRadix?: string[];
  definitions?:
    | {
        [key: string]: {
          mask: string;
          displayChar: string;
          placeholderChar: string;
        };
      }
    | undefined;
};

// const classes = {
//   default: {
//     white: {
//       input:
//         "px-3 py-3 block w-full border border-solid border-border3 hover:border-primary rounded-[5px] text-sm focus:border-primary focus:ring-primary disabled:opacity-50 disabled:pointer-events-none dark:bg-slate-900 dark:border-gray-700 dark:text-text dark:focus:ring-gray-600",
//       label: "text-base text-[#344054] mb-2 font-campton font-medium",
//       info: "text-xs text-text mt-[2px]",
//       error: "text-danger text-xs mt-[2px]",
//     },
//     gray: {
//       input:
//         "px-3 py-3 block w-full border border-solid border-border3 hover:border-primary rounded-[5px] text-sm focus:border-primary focus:ring-primary disabled:opacity-50 disabled:pointer-events-none dark:bg-slate-900 dark:border-gray-700 dark:text-text dark:focus:ring-gray-600",
//       label:
//         "block text-sm text-[#344054] font-campton font-medium mb-2 dark:text-white",
//       info: "block text-sm font-medium mb-2 dark:text-white",
//       error: "block text-sm font-medium mb-2 dark:text-white",
//     },
//   },
//   floating: {
//     white: {
//       input:
//         "px-3 py-3 block w-full border border-solid border-border3 hover:border-primary rounded-[5px] text-sm focus:border-primary focus:ring-primary disabled:opacity-50 disabled:pointer-events-none dark:bg-slate-900 dark:border-gray-700 dark:text-text dark:focus:ring-gray-600",
//       label:
//         "block text-sm text-[#344054] font-campton font-medium mb-2 dark:text-white",
//       info: "block text-sm font-medium mb-2 dark:text-white",
//       error: "block text-sm font-medium mb-2 dark:text-white",
//     },
//     gray: {
//       input:
//         "px-3 py-3 block w-full border border-solid border-border3 hover:border-primary rounded-[5px] text-sm focus:border-primary focus:ring-primary disabled:opacity-50 disabled:pointer-events-none dark:bg-slate-900 dark:border-gray-700 dark:text-text dark:focus:ring-gray-600",
//       label:
//         "block text-sm text-[#344054] font-campton font-medium mb-2 dark:text-white",
//       info: "block text-sm font-medium mb-2 dark:text-white",
//       error: "block text-sm font-medium mb-2 dark:text-white",
//     },
//   },
//   mini: {
//     white: {
//       input:
//         "px-3 py-3 block w-full border border-solid border-border3 hover:border-primary rounded-[5px] text-sm focus:border-primary focus:ring-primary disabled:opacity-50 disabled:pointer-events-none dark:bg-slate-900 dark:border-gray-700 dark:text-text dark:focus:ring-gray-600",
//       label: "block text-sm font-medium mb-2 dark:text-white",
//       info: "block text-sm font-medium mb-2 dark:text-white",
//       error: "block text-sm font-medium mb-2 dark:text-white",
//     },
//     gray: {
//       input:
//         "px-3 py-3 block w-full border border-solid border-border3 hover:border-primary rounded-[5px] text-sm focus:border-primary focus:ring-primary disabled:opacity-50 disabled:pointer-events-none dark:bg-slate-900 dark:border-gray-700 dark:text-text dark:focus:ring-gray-600",
//       label: "block text-sm font-medium mb-2 dark:text-white",
//       info: "block text-sm font-medium mb-2 dark:text-white",
//       error: "block text-sm font-medium mb-2 dark:text-white",
//     },
//   },
// };

// function getClassNames(
//   props: NumberFieldProps,
//   type: "input" | "label" | "info" | "error"
// ) {
//   return (
//     classes?.[props?.variant || "default"]?.[props?.color || "white"]?.[type] ||
//     ""
//   );
// }

const NumberField = forwardRef<HTMLInputElement, NumberFieldProps>((props) => {
  const [touched, setTouched] = useState(false);
  const {
    value,
    padFractionalZeros,
    normalizeZeros,
    mapToRadix,
    onInput,
    ...restProps
  } = props;
  const { ref, unmaskedValue, setUnmaskedValue } = useIMask(
    {
      mask: props?.mask,
      min: props?.min ? parseFloat(props?.min?.toString()) : undefined,
      max: props?.max ? parseFloat(props?.max?.toString()) : undefined,
      scale: props?.scale || 0,
      thousandsSeparator: props?.thousandSeparator || "",
      radix: props?.radix || "",
      padFractionalZeros: padFractionalZeros,
      normalizeZeros: normalizeZeros,
      mapToRadix: mapToRadix,
      definitions: props?.definitions,
    } as any,
    {
      onAccept(value) {
        console.log(value);
        if (!touched) return;
        onInput!({
          target: {
            name: props?.name,
            id: props?.id,
            value: value?.toString()?.replaceAll(",", ""),
          },
        } as any);
      },
    }
  );

  function preKeydownEvent(e: any) {
    if (props.disabled) return;
    let newValue: string;
    if (props.mask == Number) {
      switch (e?.keyCode) {
        case 38:
          newValue = (
            (parseFloat(unmaskedValue?.replace(/\.&/, "")) || 0) +
            (props?.step || 0)
          )?.toString();
          setUnmaskedValue(newValue);
          props?.onInput!({
            target: {
              name: props?.name,
              id: props?.id,
              value: newValue,
            },
          } as any);
          break;
        case 40:
          newValue = (
            (parseFloat(unmaskedValue?.replace(/\.&/, "")) || 0) -
            (props?.step || 0)
          )?.toString();
          setUnmaskedValue(newValue);
          props?.onInput!({
            target: {
              name: props?.name,
              id: props?.id,
              value: newValue,
            },
          } as any);
          break;
        // Add more cases for other keys as needed
      }
    }
  }

  return (
    <Fragment>
      {props?.label && (
        <label
          {...(props?.labelProps || {})}
          htmlFor={props?.id}
          className={twMerge(
            `!text-light text-sm leading-[16.94px] block mb-[8px] font-normal`
          )}
        >
          {props?.label}
          {props?.required && (
            <span className="text-danger inline-block ml-1">*</span>
          )}
        </label>
      )}
      <div>
        <div className={`relative flex justify-center items-center w-full`}>
          <input
            {...(restProps || {})}
            type="text"
            ref={ref as any}
            className={twMerge(`
              text-sm w-full rounded leading-[19.94px] font-medium placeholder:text-placeholder border border-border3 py-2.5 ${
                props?.error
                  ? "border-danger hover:border-primary focus:border-danger focus:ring-danger"
                  : "border-border3 hover:border-primary focus:border-primary focus:ring-primary"
              } ${props?.className || ""}`)}
            onKeyDown={preKeydownEvent}
            onFocus={() => setTouched(true)}
            defaultValue={value}
          />
        </div>
      </div>
      {props.error ? (
        <p className="!text-danger !text-xs !mt-[2px]">{props?.errorText}</p>
      ) : props?.infoText ? (
        <p className="!text-xs !text-light !mt-[2px]">{props?.infoText}</p>
      ) : (
        ""
      )}
    </Fragment>
  );
});

export default NumberField;
