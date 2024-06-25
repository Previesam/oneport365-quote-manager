import { cloneElement, useEffect, useMemo, useState } from "react";
import Modal from "./modal";
import Button from "./button";
import { Icon } from "@iconify/react/dist/iconify.js";
import Input from "./inputs/input";
import TimePicker from "./inputs/time";
import { useNavigate } from "react-router-dom";
import { ValidationSchema } from "../types/validation";
import { transformValidationResult, validateForm } from "../utils/functions";
import { useNotificationContext } from "../contexts/notification-context";
import QueryString from "qs";

const FORM = {
  title: "",
  start_time: "",
  end_time: "",
};

const SCHEMA: ValidationSchema = {
  title: { required: {} },
  start_time: { required: {} },
  end_time: { required: {} },
};

export default function AddQuoteModal(props: {
  children: JSX.Element;
  data?: {
    quote_date: string | Date;
    title: string;
    start_time: string;
    end_time: string;
  };
  onDone?: (d: typeof props.data) => void;
}) {
  const { showErrorMessage } = useNotificationContext();
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({ ...FORM });
  const [formErrors, setFormErrors] = useState({ ...FORM });
  const [formIsValid, setFormIsValid] = useState(false);

  function handleInput(e: any) {
    const name = e?.target?.name;
    const value = e?.target?.value;

    console.log(value);

    const data = { ...formData, [name]: value };

    setFormData(data);

    const validated = transformValidationResult(validateForm(data, SCHEMA));

    setFormErrors(validated.errors);

    setFormIsValid(validated.meta.is_empty);
  }

  function submit() {
    if (props.onDone) {
      onClose(true);
    } else {
      navigate(
        `/add-quote?${QueryString.stringify({
          quote_date: props?.data?.quote_date,
          ...formData,
        })}`
      );
      onClose();
    }
  }

  function onClose(update?: boolean) {
    if (update && props.onDone) {
      props.onDone({
        quote_date: props?.data?.quote_date as any,
        ...formData,
      });
    }
    setFormData({ ...FORM });
    setFormErrors({ ...FORM });
    setFormIsValid(false);
    setOpen(false);
  }

  useEffect(() => {
    if (!props?.data?.quote_date) {
      showErrorMessage("Quote date is required");
      onClose();
    }
  }, []);

  const editing = useMemo(
    () =>
      props?.data?.title || props?.data?.start_time || props?.data?.end_time,
    [props?.data]
  );

  useEffect(() => {
    if (
      props?.data?.title ||
      props?.data?.start_time ||
      props?.data?.end_time
    ) {
      const data = { ...formData, ...props?.data };

      setFormData(data);

      const validated = transformValidationResult(validateForm(data, SCHEMA));

      setFormErrors(validated.errors);

      setFormIsValid(validated.meta.is_empty);
    }
  }, [props?.data]);

  return (
    <>
      <Modal open={open}>
        <div className="w-full max-w-[454px] bg-white rounded-[10px] mx-auto my-auto">
          <div className="heading p-[25px] flex justify-between gap-2 border-b border-border2">
            <div>
              <h4 className="text-dark font-medium text-base">
                {editing ? "Edit " : "Create New "}
                Quote
              </h4>
              <p className="text-light text-xs">Enter quote name and time</p>
            </div>
            <div>
              <Button
                variant="text"
                color="light"
                className="p-0"
                onClick={() => onClose()}
              >
                <Icon icon="mdi:close" className="text-light text-xl" />
              </Button>
            </div>
          </div>
          <div className="content p-[25px] grid gap-[25px]">
            <div>
              <Input
                label="Enter Quote Title"
                placeholder="Enter quote title here"
                className="-mx-[2px]"
                name="title"
                onInput={handleInput}
                value={formData.title}
                error={formErrors?.title ? true : false}
                errorText={formErrors?.title}
              />
            </div>
            <div className="grid grid-cols-2 gap-[20px]">
              <div>
                <TimePicker
                  label="Start Time"
                  placeholder="09 : 00 AM"
                  onChange={(_, val: any) =>
                    handleInput({
                      target: { name: "start_time", value: val?.value },
                    })
                  }
                  value={
                    formData?.start_time
                      ? ({
                          label: formData?.start_time,
                          value: formData?.start_time,
                        } as any)
                      : undefined
                  }
                  error={formErrors?.start_time ? true : false}
                  errorText={formErrors?.start_time}
                />
              </div>
              <div>
                <TimePicker
                  label="End Time"
                  placeholder="09 : 00 AM"
                  onChange={(_, val: any) =>
                    handleInput({
                      target: { name: "end_time", value: val?.value },
                    })
                  }
                  value={
                    formData?.end_time
                      ? ({
                          label: formData?.end_time,
                          value: formData?.end_time,
                        } as any)
                      : undefined
                  }
                  error={formErrors?.end_time ? true : false}
                  errorText={formErrors?.end_time}
                />
              </div>
            </div>
          </div>
          <div className="actions p-[25px] border-t border-border2 flex flex-col gap-1">
            <Button
              variant="filled"
              color="primary"
              onClick={submit}
              disabled={!formIsValid}
            >
              {editing ? "Update " : "Create New"}
              Quote
            </Button>
            <Button variant="text" color="danger" onClick={() => onClose()}>
              Cancel
            </Button>
          </div>
        </div>
      </Modal>
      {cloneElement(props.children, { onClick: () => setOpen(true) })}
    </>
  );
}
