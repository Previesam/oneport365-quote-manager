import { useAddEditQuote } from "..";
import Input from "../../../components/inputs/input";
import NumberField from "../../../components/inputs/numberfield";
import currencySymbol from "currency-symbol";
import { formatNumber } from "../../../utils/functions";
import { Autocomplete } from "../../../components/inputs/autocomplete";
import Button from "../../../components/button";
import { Icon } from "@iconify/react/dist/iconify.js";
import { twMerge } from "tw-merge";
import { useEffect, useState } from "react";
import { QuoteSetionCurrency } from "../../../store/features/quotes";
import EditCurrencyModal from "../../../components/edit-currency-modal";
import { SECTION_CURRENCY_SAMPLE } from "..";
import PreviewQuoteModal from "../../../components/preview-quote-modal";
import { useNavigate } from "react-router-dom";

export function YDivider({ className }: { className?: string }) {
  return (
    <div
      className={twMerge(
        `border-r border-r-border3 h-full block ${className || ""}`
      )}
    >
      &nbsp;
    </div>
  );
}

export const MEASUREMENT_OPTIONS = [
  { label: "Per Kilogram", value: "Kilogram" },
  { label: "Per Meter", value: "Meter" },
  { label: "Per Liter", value: "Liter" },
];

export default function QuoteSection(props: { id: string }) {
  const {
    quote,
    addSection,
    removeSection,
    updateSection,
    updateSectionData,
    addSectionData,
    removeSectionData,
    resetForm,
    formIsValid,
  } = useAddEditQuote();
  const [sectionCurrency, setSectionCurrency] = useState(
    quote?.sections?.find((i) => i?.id == props.id)
      ?.section_currency as QuoteSetionCurrency
  );
  const [sectionIdx, setSectionIdx] = useState(
    quote?.sections?.findIndex((i) => i?.id == props?.id)
  );
  useEffect(() => {
    const currency = (quote as any)?.sections?.find(
      (i: any) => i?.id == props.id
    )?.section_currency;
    setSectionCurrency(
      currency?.currency
        ? currency
        : typeof currency == "string"
        ? {
            ...(SECTION_CURRENCY_SAMPLE as any),
            currency: currency,
            customer_currency: currency,
          }
        : { ...(SECTION_CURRENCY_SAMPLE as any) }
    );
    setSectionIdx(quote?.sections?.findIndex((i) => i?.id == props?.id));
  }, [quote, props?.id]);

  const navigate = useNavigate();

  function cancel() {
    setSectionIdx(-1);
    setSectionCurrency(null as any);
    resetForm();
    navigate("/");
  }
  return (
    <div className="container mx-auto px-4 flex gap-[40px] flex-wrap sm:flex-nowrap">
      <div className="left w-full max-w-[976px] grid gap-[35px]">
        {sectionIdx !== 0 ? (
          <>
            <hr className="w-full bg-border1" />
          </>
        ) : (
          <></>
        )}
        <div className="rounded border border-border3 w-full h-fit">
          <div className="flex  gap-2 justify-between items-center">
            <Input
              placeholder="Enter Section Label"
              className="text-xs font-normal !rounded-none border-transparent -mx-[1px] w-[145px]"
              value={quote?.sections?.[sectionIdx]?.section_name}
              onInput={(e: any) =>
                updateSection(props?.id, "section_name", e?.target?.value)
              }
            />
            {sectionIdx > 0 ? (
              <Button
                variant="text"
                color="danger"
                onClick={() => removeSection(props?.id)}
              >
                Remove Section
              </Button>
            ) : (
              <></>
            )}
          </div>
          <div className="grid">
            <div className="flex items-center p-4 first:bg-bg2 border-b border-b-border2 last:border-none text-xs text-[#6B7280]">
              <div className="first min-w-[20%] max-w-[20%] pr-4">Basis</div>
              <YDivider />
              <div className="first min-w-[15%] max-w-[15%] px-4">
                Unit of measure
              </div>
              <YDivider />
              <div className="first min-w-[13%] max-w-[13%] px-4">Unit</div>
              <YDivider />
              <div className="first min-w-[13%] max-w-[13%] px-4 flex items-center gap-2 justify-between">
                <span>Rate</span>
                {sectionCurrency?.currency ? (
                  <div className="p-[4px_8px] rounded bg-[#E5E7EB] text-[10px] leading-[14px]">
                    {sectionCurrency?.currency}
                  </div>
                ) : (
                  <></>
                )}
              </div>
              <YDivider />
              <div className="first min-w-[13%] max-w-[13%] px-4 flex items-center gap-2 justify-between">
                <span>Amount</span>
                {sectionCurrency?.currency ? (
                  <div className="p-[4px_8px] rounded bg-[#E5E7EB] text-[10px] leading-[14px]">
                    {sectionCurrency?.currency}
                  </div>
                ) : (
                  <></>
                )}
              </div>
              <div className="min-w-[13%] max-w-[13%]">&nbsp;</div>
            </div>
            {quote?.sections?.[sectionIdx]?.section_data?.map((data, idx) => (
              <>
                <div
                  className="flex items-center p-4 first:bg-bg2 border-b border-b-border2 last:border-none !text-xs !text-[#6B7280]"
                  key={(data as any)?.id}
                >
                  <div className="first min-w-[20%] max-w-[20%] pr-4">
                    <Input
                      placeholder="Enter basis"
                      className="-mx-[1px] w-[calc(100%-2px)] text-xs border-transparent p-0 hover:border-transparent focus:border-transparent focus:ring-transparent rounded-none"
                      value={data?.basis}
                      onInput={(e: any) =>
                        updateSectionData(
                          props.id,
                          (data as any)?.id,
                          "basis",
                          e?.target?.value
                        )
                      }
                    />
                  </div>
                  <YDivider />
                  <div className="first min-w-[15%] max-w-[15%] px-4">
                    <Autocomplete
                      placeholder="Choose option"
                      slotProps={{
                        root: {
                          className:
                            "!text-xs font-medium ring-none !border-transparent p-0 hover:!border-transparent focus-visible:!border-transparent focus-within:!border-transparent focus-visible:!ring-transparent focus-within:!ring-transparent focus:!border-transparent focus:!ring-transparent !rounded-none",
                        },
                        input: {
                          className: "!px-0 !py-0",
                        },
                        listbox: {
                          className: "text-xs font-medium",
                        },
                        indicator: {
                          className: "text-sm",
                        },
                      }}
                      disableClearable={true}
                      options={MEASUREMENT_OPTIONS}
                      value={
                        data?.unit_of_measurement
                          ? MEASUREMENT_OPTIONS?.find(
                              (d) => d?.value == data?.unit_of_measurement
                            )
                          : undefined
                      }
                      onChange={(_: any, val: any) =>
                        updateSectionData(
                          props.id,
                          (data as any)?.id,
                          "unit_of_measurement",
                          val?.value || undefined
                        )
                      }
                    />
                  </div>
                  <YDivider />
                  <div className="first min-w-[13%] max-w-[13%] px-4">
                    <NumberField
                      placeholder="Enter unit"
                      className="!text-xs text-input border-transparent p-0 hover:border-transparent focus:border-transparent focus:ring-transparent rounded-none"
                      mask={Number}
                      radix="."
                      mapToRadix={["."]}
                      thousandSeparator=","
                      padFractionalZeros={false}
                      normalizeZeros={true}
                      scale={0}
                      step={1}
                      value={data?.unit?.toString()}
                      onInput={(e: any) =>
                        updateSectionData(
                          props.id,
                          (data as any)?.id,
                          "unit",
                          parseFloat(e?.target?.value)
                        )
                      }
                    />
                  </div>
                  <YDivider />
                  <div className="first min-w-[13%] max-w-[13%] px-4 flex items-center gap-2 justify-between">
                    <NumberField
                      placeholder="Enter rate"
                      className="!text-xs text-input border-transparent p-0 hover:border-transparent focus:border-transparent focus:ring-transparent rounded-none"
                      mask={Number}
                      radix="."
                      mapToRadix={["."]}
                      thousandSeparator=","
                      padFractionalZeros={false}
                      normalizeZeros={true}
                      scale={2}
                      step={1}
                      value={data?.rate?.toString()}
                      onInput={(e: any) => {
                        console.log(e);
                        updateSectionData(
                          props.id,
                          (data as any)?.id,
                          "rate",
                          parseFloat(e?.target?.value)
                        );
                      }}
                    />
                  </div>
                  <YDivider />
                  <div
                    className={`first min-w-[13%] max-w-[13%] px-4 flex items-center gap-1 ${
                      data?.amount > 0 ? "text-input" : ""
                    }`}
                  >
                    <span
                      dangerouslySetInnerHTML={{
                        __html: currencySymbol.symbol(
                          sectionCurrency?.currency
                            ? sectionCurrency?.currency
                            : typeof sectionCurrency == "string"
                            ? sectionCurrency
                            : ""
                        ),
                      }}
                    ></span>
                    {formatNumber(data?.amount)}
                  </div>
                  <div className="min-w-[13%] max-w-[13%] ml-auto flex justify-end">
                    {(quote?.sections?.[sectionIdx]?.section_data || [])
                      ?.length > 1 ? (
                      <Button
                        variant="text"
                        color="danger"
                        className="p-0"
                        onClick={() =>
                          removeSectionData(props?.id, (data as any).id)
                        }
                      >
                        <Icon
                          icon="mdi:trash-outline"
                          className="text-xl text-inherit"
                        />
                      </Button>
                    ) : (
                      <>&nbsp;</>
                    )}
                  </div>
                </div>
                {idx ==
                (quote?.sections?.[sectionIdx]?.section_data || [])?.length -
                  1 ? (
                  <div className="flex items-center p-4 !text-xs">
                    <Button
                      variant="text"
                      color="primary"
                      className="p-0"
                      onClick={() => addSectionData(props?.id)}
                    >
                      <Icon
                        icon="mdi:plus"
                        className="text-white text-lg inline-block !p-[1px] rounded-md bg-primary"
                      />{" "}
                      Add new basis
                    </Button>
                  </div>
                ) : (
                  <></>
                )}
              </>
            ))}
          </div>
        </div>
        {sectionIdx == quote?.sections?.length - 1 ? (
          <>
            <div className="border-b border-b-border1 pb-[40px] mb-[35px]">
              <Button
                variant="light"
                color="primary"
                className="bg-primary/20 text-primary w-full"
                onClick={addSection}
              >
                <Icon
                  icon="mdi:plus"
                  className="text-white text-lg inline-block !p-[1px] rounded-md bg-primary"
                />{" "}
                Add new Section
              </Button>
            </div>
            <div className="flex justify-between gap-4">
              <Button
                variant="text"
                color="danger"
                className="bg-[#F9FAFB] border-[#E5E7EB] px-[32px]"
                tooltip="You will lose all the data inputted if you cancel"
                onClick={cancel}
              >
                Cancel
              </Button>
              <PreviewQuoteModal data={quote} context={true}>
                <Button
                  variant="filled"
                  color="primary"
                  className="px-[32px]"
                  disabled={!formIsValid}
                >
                  Save Quote
                </Button>
              </PreviewQuoteModal>
            </div>
          </>
        ) : (
          <></>
        )}
      </div>
      <div className="right w-full sm:max-w-[304px]">
        <div className="border border-border1 rounded-xl w-full p-[20px]">
          <div className="head border-b border-b-border2 pb-[20px] flex items-center justify-between">
            <h4 className="text-dark font-medium text-[15px] leading-[20px] -tracking-[1%]">
              Section Currency
            </h4>
            <div className="flex gap-2 items-center">
              <span>
                {sectionCurrency?.currency
                  ? sectionCurrency?.currency
                  : typeof sectionCurrency == "string"
                  ? sectionCurrency
                  : ""}
              </span>
              <span
                className={twMerge(
                  `currency-flag currency-flag-${(sectionCurrency?.currency
                    ? sectionCurrency?.currency
                    : typeof sectionCurrency == "string"
                    ? sectionCurrency
                    : ""
                  )?.toLowerCase!()}`
                )}
              ></span>
            </div>
          </div>
          <div className="content pt-[20px]">
            <h6 className="text-[#6B7280] text-sm mb-[16px]">
              Currency & Rate
            </h6>
            <div className="flex items-center gap-3 mb-[20px] flex-nowrap whitespace-nowrap">
              <div className="w-full max-w-[66px] p-[13px_16px_13px_12px] rounded border border-border1 grid place-items-center">
                <span
                  className={twMerge(
                    `currency-flag currency-flag-${(sectionCurrency?.currency
                      ? sectionCurrency?.currency
                      : typeof sectionCurrency == "string"
                      ? sectionCurrency
                      : ""
                    )?.toLowerCase!()}`
                  )}
                ></span>
              </div>
              <div className="flex items-center">
                <Icon
                  icon="codicon:arrow-swap"
                  className="text-[#9CA3AF] text-xl"
                />
              </div>
              <div className="w-full p-[13px_16px_12px_12px] rounded border border-border1 text-sm text-[#34373F] flex items-center gap-2">
                <span
                  className={twMerge(
                    `currency-flag currency-flag-${(sectionCurrency?.customer_currency
                      ? sectionCurrency?.customer_currency
                      : typeof sectionCurrency == "string"
                      ? sectionCurrency
                      : ""
                    )?.toLowerCase!()}`
                  )}
                ></span>{" "}
                <div>
                  <span
                    dangerouslySetInnerHTML={{
                      __html: currencySymbol.symbol(
                        sectionCurrency?.customer_currency
                          ? sectionCurrency?.customer_currency
                          : typeof sectionCurrency == "string"
                          ? sectionCurrency
                          : ""
                      ),
                    }}
                  ></span>{" "}
                  {formatNumber(sectionCurrency.exchange_rate)}
                </div>
              </div>
            </div>
            <EditCurrencyModal id={props?.id} sectionIdx={sectionIdx}>
              <Button
                variant="filled"
                color="light"
                className="!w-full bg-[#F3F4F6] border-[#F3F4F6] text-[#1F2937]"
              >
                Edit section currency
              </Button>
            </EditCurrencyModal>
          </div>
        </div>
      </div>
    </div>
  );
}
