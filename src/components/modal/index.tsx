import {
  Modal as BaseModal,
  ModalProps as BaseModalProps,
} from "@mui/base/Modal";
import { forwardRef, useLayoutEffect, useRef } from "react";

import { twMerge } from "tw-merge";

export interface ModalProps extends BaseModalProps {
  disableCloseOnClickOutSide?: boolean;
}

export default forwardRef<any, ModalProps>(function Modal(props, ref) {
  const handleClose = (
    event: any,
    reason: "backdropClick" | "escapeKeyDown"
  ) => {
    if (reason == "backdropClick" && props.disableCloseOnClickOutSide) return;

    if (props.onClose) {
      props.onClose(event, reason);
    }
  };
  const modal: any = useRef(null);

  useLayoutEffect(() => {
    setTimeout(() => {
      if (modal?.current) {
        modal.current.scrollTop = 0;
      }
      if ((ref as any)?.current) {
        (ref as any).current.scrollTop = 0;
      }
    }, 1);
  }, [props.open]);
  return (
    <>
      <BaseModal
        ref={(ref as any) || (modal as any)}
        {...props}
        onClose={handleClose}
        className={twMerge(
          `fixed z-[1300] inset-0 flex justify-center items-center overflow-y-auto ${
            props?.className || ""
          }`
        )}
        slots={{ ...props?.slots, backdrop: props?.slots?.backdrop || "div" }}
        slotProps={{
          ...props?.slotProps,
          backdrop: {
            ...props?.slotProps?.backdrop,
            className: twMerge(
              `${
                props.open ? "MuiBackdrop-open" : ""
              } z-[-1] fixed inset-0 bg-black/50 [-webkit-tap-highlight-color:_transparent] ${
                (props?.slotProps?.backdrop as any)?.className || ""
              }`
            ),
          },
        }}
      />
    </>
  );
});
