import { Icon } from "@iconify/react/dist/iconify.js";
import { ButtonHTMLAttributes, forwardRef } from "react";
import { twMerge } from "tw-merge";

export interface ButtonProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "ref"> {
  variant?: "filled" | "outlined" | "text" | "light";
  color?: "primary" | "accent" | "success" | "danger" | "light";
  radius?: "full";
  loading?: boolean;
  tooltip?: string;
}

function getClasses(props: ButtonProps) {
  if (props.variant == "filled") {
    switch (props.color) {
      case "primary":
        return "bg-primary border-primary text-white";

      case "accent":
        return "bg-accent border-accent text-white";

      case "success":
        return "bg-success border-success text-white";

      case "danger":
        return "bg-danger border-danger text-white";

      default:
        return "bg-white border-border2 text-light";
    }
  } else if (props.variant == "outlined") {
    switch (props.color) {
      case "primary":
        return "bg-white border-primary text-primary";

      case "accent":
        return "bg-white border-accent text-accent";

      case "success":
        return "bg-white border-success text-success";

      case "danger":
        return "bg-white border-danger text-danger";

      default:
        return "bg-white border-border2 text-light";
    }
  } else if (props.variant == "text") {
    switch (props.color) {
      case "primary":
        return "bg-white border-white text-primary";

      case "accent":
        return "bg-white border-white text-accent";

      case "success":
        return "bg-white border-white text-success";

      case "danger":
        return "bg-white border-white text-danger";

      default:
        return "bg-white border-white text-light";
    }
  } else {
    switch (props.color) {
      case "primary":
        return "bg-white border-border2 text-light";

      case "accent":
        return "bg-white border-border2 text-light";

      case "success":
        return "bg-white border-border2 text-light";

      case "danger":
        return "bg-white border-border2 text-light";

      default:
        return "bg-white border-border2 text-light";
    }
  }
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>((props, ref) => {
  const { radius, ...rest } = props;

  return props?.tooltip ? (
    <div className="relative inline-block group">
      <button
        {...rest}
        ref={ref}
        className={twMerge(
          `flex items-center justify-center gap-2 p-[10px_14px] text-sm leading-[20px] cursor-pointer disabled:opacity-65 disabled:cursor-not-allowed border ${
            radius ? "rounded-r-full rounded-l-full" : "rounded"
          } ${getClasses(props)} ${rest?.className || ""}`
        )}
      >
        {props.loading ? (
          <Icon
            icon="mdi:loading"
            className="text-2xl min-w-fit animate-spin"
          />
        ) : (
          <></>
        )}
        {props.children}
      </button>
      {props?.tooltip ? (
        <div className="absolute z-10 w-48 px-4 py-2 mt-2 text-sm text-white bg-gray-800 rounded-lg shadow-lg invisible opacity-0 group-hover:visible group-hover:opacity-100 transition-opacity duration-300 ease-in-out bottom-full left-1/2 transform -translate-x-1/2 mb-4 isolate">
          {props?.tooltip}
          <div className="absolute w-3 h-3 bg-gray-800 transform rotate-45 -bottom-1.5 left-1/2 -translate-x-1/2"></div>
        </div>
      ) : (
        <></>
      )}
    </div>
  ) : (
    <button
      {...rest}
      ref={ref}
      className={twMerge(
        `flex items-center justify-center gap-2 p-[10px_14px] text-sm leading-[20px] cursor-pointer disabled:opacity-65 disabled:cursor-not-allowed border ${
          radius ? "rounded-r-full rounded-l-full" : "rounded"
        } ${getClasses(props)} ${rest?.className || ""}`
      )}
    >
      {props.loading ? (
        <Icon icon="mdi:loading" className="text-2xl min-w-fit animate-spin" />
      ) : (
        <></>
      )}
      {props.children}
    </button>
  );
});

export default Button;
