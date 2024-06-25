import { cloneElement, useEffect, useState } from "react";
import Modal from "./modal";
import Button from "./button";
import { Icon } from "@iconify/react/dist/iconify.js";
import { useNotificationContext } from "../contexts/notification-context";
import { useAddEditQuote } from "../pages/add-edit-quote";
import { Autocomplete } from "./inputs/autocomplete";
import NumberField from "./inputs/numberfield";

const CURRENCY_OPTIONS = [
  {
    label: "NGN",
    value: "NGN",
    icon: <span className="currency-flag currency-flag-ngn"></span>,
  },
  {
    label: "USD",
    value: "USD",
    icon: <span className="currency-flag currency-flag-usd"></span>,
  },
  {
    label: "EUR",
    value: "EUR",
    icon: <span className="currency-flag currency-flag-eur"></span>,
  },
  {
    label: "GBP",
    value: "GBP",
    icon: <span className="currency-flag currency-flag-gbp"></span>,
  },
];

export default function EditCurrencyModal(props: {
  children: JSX.Element;
  id: string;
  sectionIdx: number;
}) {
  const { showErrorMessage } = useNotificationContext();
  const [open, setOpen] = useState(false);

  const [isValid, setIsValid] = useState(false);

  const { quote, errors, updateSectionCurrency } = useAddEditQuote();

  const [isBase, setIsBase] = useState(
    (quote.sections[props?.sectionIdx]?.section_currency as any)
      ?.is_base_currency
      ? "yes"
      : "no"
  );

  useEffect(() => {
    if (
      (quote.sections[props?.sectionIdx]?.section_currency as any)
        ?.is_base_currency
    ) {
      setIsBase("yes");
    } else {
      setIsBase("no");
    }
  }, [
    (quote.sections[props?.sectionIdx]?.section_currency as any)
      ?.is_base_currency,
  ]);

  useEffect(() => {
    const errs = Object.values(
      (errors as any)?.sections?.[props?.sectionIdx]?.section_currency || {}
    );
    console.log(errs);
    setIsValid(!errs?.map((i) => (i ? false : true))?.includes(false));
  }, [quote.sections[props?.sectionIdx]?.section_currency]);

  function handleInput(e: any) {
    const name = e?.target?.name;
    const value = e?.target?.value;

    updateSectionCurrency(props?.id, name, value);
  }

  function submit() {
    onClose();
  }

  function onClose() {
    setOpen(false);
  }

  useEffect(() => {
    if (!props?.id) {
      showErrorMessage("Quote date is required");
      onClose();
    }
  }, []);

  return (
    <>
      <Modal open={open}>
        <div className="w-full max-w-[454px] bg-white rounded-[10px] mx-auto my-auto">
          <div className="heading p-[25px] flex justify-between gap-2 border-b border-border2">
            <div>
              <h4 className="text-dark font-medium text-base">
                Set Section Currency
              </h4>
              <p className="text-light text-xs">
                Kindly set a currency and rate
              </p>
            </div>
            <div>
              <Button
                variant="text"
                color="light"
                className="p-0"
                onClick={onClose}
              >
                <Icon icon="mdi:close" className="text-light text-xl" />
              </Button>
            </div>
          </div>
          <div className="content p-[25px] grid gap-[25px]">
            <div>
              <Autocomplete
                label="Select Currency"
                placeholder="Enter currency"
                disableClearable={true}
                options={CURRENCY_OPTIONS}
                value={
                  CURRENCY_OPTIONS?.find(
                    (i) =>
                      i.value ==
                      (
                        quote.sections[props?.sectionIdx]
                          ?.section_currency as any
                      )?.currency
                  ) || undefined
                }
                startAdornment={
                  CURRENCY_OPTIONS?.find(
                    (i) =>
                      i.value ==
                      (
                        quote.sections[props?.sectionIdx]
                          ?.section_currency as any
                      )?.currency
                  )?.icon || undefined
                }
                onChange={(_, val: any) =>
                  handleInput({
                    target: { name: "currency", value: val?.value || "" },
                  })
                }
                error={
                  (
                    (errors as any)?.sections?.[props?.sectionIdx]
                      ?.section_currency as any
                  )?.currency
                    ? true
                    : false
                }
                errorText={
                  (
                    (errors as any)?.sections?.[props?.sectionIdx]
                      ?.section_currency as any
                  )?.currency
                }
              />
            </div>
            <div>
              <h4 className="text-sm text-light mb-[8px]">
                Is this the base currency?
              </h4>
              <div className="flex gap-4">
                <label htmlFor="yes" className="text-dark text-sm flex gap-2">
                  <div>
                    <input
                      type="radio"
                      name="is_base_currency"
                      value="yes"
                      className="hidden peer"
                      checked={isBase == "yes"}
                    />
                    <span
                      className="w-5 h-5 border border-gray-300 rounded flex items-center justify-center peer-checked:border-primary hover:border-primary peer-checked:bg-primary"
                      onClick={() =>
                        handleInput({
                          target: { name: "is_base_currency", value: true },
                        })
                      }
                    >
                      <Icon icon="mdi:check" className="text-sm text-white" />
                    </span>
                  </div>
                  Yes, it is
                </label>
                <label htmlFor="no" className="text-dark text-sm flex gap-2">
                  <div>
                    <input
                      type="radio"
                      name="is_base_currency"
                      id="no"
                      value="no"
                      className="hidden peer"
                      checked={isBase == "no"}
                    />
                    <span
                      className="w-5 h-5 border border-gray-300 rounded flex items-center justify-center peer-checked:border-primary hover:border-primary peer-checked:bg-primary"
                      onClick={() =>
                        handleInput({
                          target: { name: "is_base_currency", value: false },
                        })
                      }
                    >
                      <Icon icon="mdi:check" className="text-sm text-white" />
                    </span>
                  </div>
                  No
                </label>
              </div>
            </div>
            <div>
              <div className="flex items-start text-[#005BC2] gap-2">
                <Icon
                  icon="mynaui:info-square"
                  className="text-2xl text-inherit"
                />
                <p className="text-xs">
                  <span className="font-bold">Note,</span> Base currency is the
                  currency the customer will make payment in.
                </p>
              </div>
            </div>
            <hr className="border-border" />
            <div>
              <Autocomplete
                label="Customer's Currency"
                placeholder="Enter customer currency"
                disableClearable={true}
                options={CURRENCY_OPTIONS}
                value={
                  CURRENCY_OPTIONS?.find(
                    (i) =>
                      i.value ==
                      (
                        quote.sections[props?.sectionIdx]
                          ?.section_currency as any
                      )?.customer_currency
                  ) || undefined
                }
                startAdornment={
                  CURRENCY_OPTIONS?.find(
                    (i) =>
                      i.value ==
                      (
                        quote.sections[props?.sectionIdx]
                          ?.section_currency as any
                      )?.customer_currency
                  )?.icon || undefined
                }
                onChange={(_, val: any) =>
                  handleInput({
                    target: {
                      name: "customer_currency",
                      value: val?.value || "",
                    },
                  })
                }
                error={
                  (
                    (errors as any)?.sections?.[props?.sectionIdx]
                      ?.section_currency as any
                  )?.customer_currency
                    ? true
                    : false
                }
                errorText={
                  (
                    (errors as any)?.sections?.[props?.sectionIdx]
                      ?.section_currency as any
                  )?.customer_currency
                }
              />
            </div>
            <div>
              <NumberField
                label="Enter rate"
                placeholder="Enter rate"
                mask={Number}
                radix="."
                mapToRadix={["."]}
                thousandSeparator=","
                padFractionalZeros={false}
                normalizeZeros={true}
                scale={2}
                step={1}
                value={(
                  quote.sections[props?.sectionIdx]?.section_currency as any
                )?.exchange_rate?.toString()}
                onInput={(e: any) => {
                  console.log(e);
                  handleInput({
                    target: {
                      name: "exchange_rate",
                      value: parseFloat(e?.target?.value),
                    },
                  });
                }}
                className="!text-xs text-input"
              />
            </div>
          </div>
          <div className="actions p-[25px] border-t border-border2 flex flex-col gap-1">
            <Button
              variant="filled"
              color="primary"
              onClick={submit}
              disabled={!isValid}
              className="bg-dark border-dark"
            >
              Set section currency
            </Button>
          </div>
        </div>
      </Modal>
      {cloneElement(props.children, { onClick: () => setOpen(true) })}
    </>
  );
}
