import { cloneElement, useEffect, useState } from "react";
import { useNotificationContext } from "../contexts/notification-context";
import { useNavigate } from "react-router-dom";
import Modal from "./modal";
import Button from "./button";
import { Icon } from "@iconify/react/dist/iconify.js";
import {
  MEASUREMENT_OPTIONS,
  YDivider,
} from "../pages/add-edit-quote/components/quote-section";
import currencySymbol from "currency-symbol";
import { formatNumber } from "../utils/functions";
import ComponentDownloader from "./ComponentDownloader";
import { PostQuoteState, postQuoteStart } from "../store/features/quotes/post";
import { useDispatch, useSelector } from "react-redux";
import { QuoteSectionI } from "../store/features/quotes";
import { useAddEditQuote } from "../pages/add-edit-quote";

export interface PreviewQuoteModalProps {
  children: JSX.Element;
  data: any;
  context?: boolean;
}

const termsAndConditions = [
  {
    text: "Above rates are for cargo details as provided by you.",
  },
  {
    text: "Above quote is/are subject to VAT.",
  },
  {
    text: "Above quoted rates are on Door-to-Door basis excludes of Duties at the time of exports.",
  },
  {
    text: "Standard Trading Terms and Conditions of Oneport365 applies.",
  },
  {
    text: "Above rates excludes services like packing, re-packing, Customs Inspection etc which may be charged additional(if required) with prior customer approval.",
  },
  {
    text: "Above rates do not cover Insurance charges.",
  },
  {
    text: "Above rates does not include any additional services required e.g.- special handling, week-end pick-up/delivery which has not been agreed and same will be charged as mutually agreed before services are rendered.",
  },
  {
    text: "Above rates apply for weight/volume (whichever is higher). Rates are based on ratio 1: 6.",
  },
  {
    text: "Quoted rates are valid for a period of one month and will need prior approval from Oneport365 incase further extension is required.",
  },
  {
    text: "Charges are based on shipment details provided by you: if quantity/weight will vary our quotation will change accordingly.",
  },
  {
    text: "Pricing team has the right to re-price if the actual cargo details differ from the information indicated in enquiry.",
  },
  {
    text: "Unless otherwise specified, any haulage included within the quote is based upon standard roadside only and between business hours Monday to Friday.",
  },
];

export default function PreviewQuoteModal(props: PreviewQuoteModalProps) {
  const { showErrorMessage, showSuccessMessage } = useNotificationContext();

  const [open, setOpen] = useState(false);

  const navigate = useNavigate();

  const dispatch = useDispatch();

  const { resetForm } = useAddEditQuote();

  const { loading: postLoading } = useSelector<any, PostQuoteState>(
    (state: any) => state?.postQuote
  );

  function postPutQuote() {
    if (!props?.context) return showErrorMessage("Cannot post when no edits.");
    const action = postQuoteStart();
    action.payload = {
      method: (props?.data as any)?._id ? "PUT" : "POST",
      data: props?.data,
      onSuccess: (message: string | string[]) => {
        showSuccessMessage(message);
        onClose();
        resetForm();
        navigate("/");
      },
      onError: (err: any) => {
        const errors = err?.errors;
        if (errors) {
          showErrorMessage(
            Object.keys(errors).map((e) => errors[e][0]),
            { timeout: "never" }
          );
        } else {
          showErrorMessage(err?.message || err || "Unknown error occured");
        }
        setOpen(false);
      },
    } as any;
    dispatch(action);
  }

  function onClose() {
    setOpen(false);
  }

  useEffect(() => {
    if (!props?.data) {
      showErrorMessage("Quote data is required");
      onClose();
    }
  }, []);

  return (
    <>
      <Modal open={open} className="py-[47px] px-[16px]">
        <div className="w-full max-w-[1280px] bg-white rounded-[10px] mx-auto h-full overflow-hidden">
          <div className="heading p-[25px] flex items-center justify-between gap-2 border-b border-border2 bg-bg2">
            <div>
              <h4 className="text-dark font-medium text-base">
                Preview
                <span className="font-normal">
                  {props?.data?._id ? " #" + props?.data?._id : ""}
                </span>
              </h4>
            </div>
            <div className="flex items-center gap-3">
              {props?.context ? (
                <Button
                  variant="filled"
                  color="primary"
                  radius="full"
                  className="!py-[6px] !px-[15px] text-xs"
                  onClick={postPutQuote}
                  loading={postLoading}
                  disabled={postLoading}
                >
                  {props?.data?._id ? "Update " : "Save "} Quote
                </Button>
              ) : (
                <>
                  <Button
                    variant="filled"
                    color="primary"
                    radius="full"
                    className="!py-[6px] !px-[15px] text-xs"
                    onClick={() => {
                      navigate(`/edit-quote/${props?.data?._id}`);
                      onClose();
                    }}
                  >
                    Edit Quote
                  </Button>
                </>
              )}
              <ComponentDownloader
                element_id="quote-content"
                file_name={
                  props?.data?.quote_title + " - " + props?.data?.quote_date
                }
              >
                <Button
                  variant="text"
                  color="light"
                  className="p-1 bg-transparent border-[#296FD8]"
                >
                  <Icon
                    icon="solar:download-outline"
                    className="text-[#296FD8] text-base"
                  />
                </Button>
              </ComponentDownloader>
              <div className="w-[1px] min-w-[1px] !bg-[#F3F4F6] h-full block">
                &nbsp;
              </div>
              <Button
                variant="text"
                color="light"
                className="p-1 bg-transparent border-[#E5E7EB]"
                onClick={onClose}
              >
                <Icon icon="mdi:close" className="text-danger text-lg" />
              </Button>
            </div>
          </div>
          <div
            id="quote-content"
            className="content p-[45px] grid gap-[25px] overflow-y-auto h-[calc(100%-86px)] max-h-full"
          >
            <div className="p-[32px] rounded-[12px] grid gap-[48px] border border-[#E5E7EB]">
              <div className="flex justify-between items-center p-4">
                <img
                  src="https://ik.imagekit.io/oneport365/images/oneport-logo.svg"
                  alt="OnePort 365 Logo"
                  className="w-[150px]"
                />
                <div className="text-right text-[#6B7280]">
                  <p className="text-sm">UAC Building Marina</p>
                  <p className="text-sm">Lagos, Nigeria</p>
                  <p className="text-sm">100223</p>
                </div>
              </div>
              <div className="py-[30px] px-[20px] bg-[#F9FAFB] rounded-[16px]">
                <div className="grid grid-cols-4 gap-x-4 gap-y-8 text-[#9CA3AF] text-xs">
                  <div>
                    <p>Shipper (Customer Name)</p>
                    <p className="text-base text-[#1F2937] leading-[19.36px] mt-1">
                      Daniel Akobode
                    </p>
                  </div>
                  <div className="border-l pl-4 border-l-[#F3F4F6]">
                    <p>Email Address</p>
                    <p className="text-base text-primary leading-[19.36px] mt-1">
                      ample@mail.com
                    </p>
                  </div>
                  <div className="border-l pl-4 border-l-[#F3F4F6]">
                    <p>Commodity</p>
                    <p className="text-base text-[#1F2937] leading-[19.36px] mt-1">
                      Electric goods
                    </p>
                  </div>
                  <div className="border-l pl-4 border-l-[#F3F4F6]">
                    <p>Service Type</p>
                    <p className="text-base text-[#1F2937] leading-[19.36px] mt-1">
                      Export Air Frieght
                    </p>
                  </div>
                  <div>
                    <p>Chargeable weight (KG)</p>
                    <p className="text-base text-[#1F2937] leading-[19.36px] mt-1">
                      55.34KG
                    </p>
                  </div>
                  <div className="border-l pl-4 border-l-[#F3F4F6]">
                    <p>POL (Port of Loading)</p>
                    <p className="text-base text-[#1F2937] leading-[19.36px] mt-1">
                      Lagos City
                    </p>
                  </div>
                  <div className="border-l pl-4 border-l-[#F3F4F6]">
                    <p>POD (Port of Destination)</p>
                    <p className="text-base text-[#1F2937] leading-[19.36px] mt-1">
                      Johannesburg
                    </p>
                  </div>
                  <div className="border-l pl-4 border-l-[#F3F4F6]">
                    <p className="text-danger">Due Date</p>
                    <p className="text-base text-[#1F2937] leading-[19.36px] mt-1">
                      23rd, March 2024
                    </p>
                  </div>
                  <div className="col-span-full flex gap-6 justify-between pt-8 border-t border-t-[#E5E7EB]">
                    <div>
                      <p>Collection Address</p>
                      <p className="text-base text-[#1F2937] leading-[19.36px] mt-1">
                        INNIO Waukesha Gas Engines 8123 116th Street, Suite 300,
                        SW
                      </p>
                      <p className="text-base text-[#1F2937] leading-[19.36px] mt-1">
                        Side of Building, Dock 46-50, Pleasant Prairie, WI 53158
                      </p>
                    </div>
                    <div className="text-end">
                      <p>Delivery Destination</p>
                      <p className="text-base text-[#1F2937] leading-[19.36px] mt-1">
                        TPG PH
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              {props?.data?.sections?.map(
                (section: QuoteSectionI, sectionIdx: number) => (
                  <div>
                    {sectionIdx == 0 ? (
                      <h2 className="text-[#9CA3AF] text-sm mb-1">
                        Quote Breakdown
                      </h2>
                    ) : (
                      <></>
                    )}
                    <p className="text-lg text-dark font-medium mb-[20px] uppercase">
                      {section?.section_name}
                    </p>
                    <div className="rounded border-t border-t-border3 w-full h-fit">
                      <div className="grid">
                        <div className="flex items-center py-4 border-b border-b-border2 last:border-none text-xs text-[#6B7280]">
                          <div className="first min-w-[26%] py-2 max-w-[26%] pr-4">
                            Basis
                          </div>
                          <YDivider />
                          <div className="first min-w-[18%] py-2 max-w-[18%] px-4">
                            Unit of measure
                          </div>
                          <YDivider />
                          <div className="first min-w-[18%] py-2 max-w-[17%] px-4">
                            Unit
                          </div>
                          <YDivider />
                          <div className="first min-w-[18%] max-w-[18%] px-4 py-2 flex items-center gap-2 justify-between">
                            <span>
                              Rate (
                              {(section?.section_currency as any)?.currency
                                ? (section?.section_currency as any)?.currency
                                : typeof (section?.section_currency as any) ==
                                  "string"
                                ? (section?.section_currency as any)
                                : ""}
                              )
                            </span>
                          </div>
                          <YDivider />
                          <div className="first min-w-[18%] max-w-[18%] px-4 py-2 flex items-center gap-2 justify-between">
                            <span>
                              Amount (
                              {(section?.section_currency as any)?.currency
                                ? (section?.section_currency as any)?.currency
                                : typeof (section?.section_currency as any) ==
                                  "string"
                                ? (section?.section_currency as any)
                                : ""}
                              )
                            </span>
                          </div>
                          <YDivider className="!ml-auto" />
                        </div>
                        {section?.section_data?.map(
                          (data: any, idx: number) => (
                            <>
                              <div
                                className={`flex items-center py-4 border-b border-b-border2 last:border-b-0 !text-sm !text-dark font-medium ${
                                  idx == section?.section_data?.length - 1
                                    ? "border-b-0"
                                    : ""
                                }`}
                                key={(data as any)?.id || data?._id}
                              >
                                <div className="first min-w-[26%] py-2 max-w-[26%] pr-4">
                                  {data?.basis}
                                </div>
                                <YDivider />
                                <div className="first min-w-[18%] py-2 max-w-[18%] px-4">
                                  {MEASUREMENT_OPTIONS?.find(
                                    (i) => i?.value == data?.unit_of_measurement
                                  )?.label || data?.unit_of_measurement}
                                </div>
                                <YDivider />
                                <div className="first min-w-[18%] py-2 max-w-[18%] px-4 flex items-center justify-end">
                                  {data?.unit}
                                </div>
                                <YDivider />
                                <div className="first min-w-[18%] py-2 max-w-[18%] px-4 flex items-center justify-end">
                                  <span
                                    dangerouslySetInnerHTML={{
                                      __html: (section?.section_currency as any)
                                        ?.currency
                                        ? currencySymbol.symbol(
                                            (section?.section_currency as any)
                                              ?.currency
                                          )
                                        : typeof (section?.section_currency as any) ==
                                          "string"
                                        ? currencySymbol.symbol(
                                            section?.section_currency as any
                                          )
                                        : "",
                                    }}
                                  ></span>
                                  {formatNumber(data?.rate)}
                                </div>
                                <YDivider />
                                <div className="first min-w-[18%] py-2 max-w-[18%] pl-4 flex items-center justify-end">
                                  <span
                                    dangerouslySetInnerHTML={{
                                      __html: (section?.section_currency as any)
                                        ?.currency
                                        ? currencySymbol.symbol(
                                            (section?.section_currency as any)
                                              ?.currency
                                          )
                                        : typeof (section?.section_currency as any) ==
                                          "string"
                                        ? currencySymbol.symbol(
                                            section?.section_currency as any
                                          )
                                        : "",
                                    }}
                                  ></span>
                                  {formatNumber(data?.amount)}
                                </div>
                                <YDivider />
                              </div>
                              {idx == section?.section_data?.length - 1 ? (
                                <>
                                  <div className="flex items-center py-4 text-lg">
                                    <div className="first min-w-[25.4%] py-2 max-w-[25.4%] pr-4">
                                      &nbsp;
                                    </div>
                                    <YDivider className="border-transparent" />
                                    <div className="first min-w-[18%] py-2 max-w-[18%] px-4">
                                      &nbsp;
                                    </div>
                                    <YDivider className="border-transparent" />
                                    <div className="first min-w-[18%] py-2 max-w-[18%] px-4">
                                      &nbsp;
                                    </div>
                                    <YDivider className="border-transparent" />
                                    <div className="first min-w-[18%] py-2 max-w-[18%] px-4">
                                      Sub Total:
                                    </div>
                                    <YDivider />
                                    <div className="first min-w-[18%] py-2 max-w-[18%] pl-4 !text-dark font-medium flex items-center justify-end">
                                      <span
                                        dangerouslySetInnerHTML={{
                                          __html: (
                                            section?.section_currency as any
                                          )?.currency
                                            ? currencySymbol.symbol(
                                                (
                                                  section?.section_currency as any
                                                )?.currency
                                              )
                                            : typeof (section?.section_currency as any) ==
                                              "string"
                                            ? currencySymbol.symbol(
                                                section?.section_currency as any
                                              )
                                            : "",
                                        }}
                                      ></span>
                                      {formatNumber(
                                        section?.section_data?.reduce(
                                          (prev: any, sec: any) =>
                                            prev + sec?.amount || 0,
                                          0
                                        )
                                      )}
                                    </div>
                                    <YDivider />
                                  </div>
                                </>
                              ) : (
                                <></>
                              )}
                            </>
                          )
                        )}
                      </div>
                    </div>
                  </div>
                )
              )}
              <div className="text-white bg-green-900 rounded-xl p-[25px] flex items-start gap-2">
                <Icon
                  icon="mynaui:info-square"
                  className="text-2xl text-inherit min-w-fit"
                />
                <div>
                  <p className="mb-3">
                    Please note this offer is firm for acceptance within
                    48hours, otherwise above offer will be considered as
                    invalid. Rates advised is subject to prevailing parallel
                    market rate at time of invoice. Freight advised is subject
                    to chargeable weight as declared by airline. Above tariff is
                    not applicable to non-compliant shipments without Form Ms,
                    PAARs.
                  </p>
                  <p>
                    NOTE: duty and tax not inclusive in the rates advised. They
                    will be advised when you provide the CIF value and H.S code
                    We do trust that this offer meets your requirements. Please,
                    contact us if any further explanation is required.
                  </p>
                </div>
              </div>
              <div className="text-dark">
                <p className="text-lg font-medium mb-[20px] uppercase">
                  OnePort365 Terms and Conditions
                </p>
                <ul className="grid border border-border1 rounded-xl gap-[20px] p-[16px]">
                  {termsAndConditions?.map((term, idx) => (
                    <li className="flex items-center p-0">
                      <p className="w-[30px] min-w-[30px]">{idx + 1}</p>
                      <YDivider />
                      <p className="ml-4 py-1">{term?.text}</p>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </Modal>
      {cloneElement(props.children, { onClick: () => setOpen(true) })}
    </>
  );
}
