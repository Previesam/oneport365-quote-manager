import { Icon } from "@iconify/react/dist/iconify.js";
import Button from "../../components/button";
import { format } from "date-fns";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import {
  QuoteSectionI,
  QuoteSectionData,
  QuoteSetionCurrency,
  Quote,
} from "../../store/features/quotes";
import { createContext, useContext, useEffect, useState } from "react";
import AddQuoteModal from "../../components/add-quote-modal";
import { useNotificationContext } from "../../contexts/notification-context";
import { ValidationSchema } from "../../types/validation";
import { transformValidationResult, validateForm } from "../../utils/functions";
import QuoteSection from "./components/quote-section";
import { v4 } from "uuid";
import { useDispatch, useSelector } from "react-redux";
import {
  SingleQuoteState,
  fetchQuoteStart,
} from "../../store/features/quotes/single";
import PreviewQuoteModal from "../../components/preview-quote-modal";

const SECTION_DATA_SAMPLE: QuoteSectionData & { id?: string } = {
  basis: "",
  unit_of_measurement: "",
  unit: 1,
  rate: 0,
  amount: 0,
  id: v4(),
};

const SECTION_DATA_ERROR_SAMPLE: Omit<
  QuoteSectionData,
  "amount" | "unit" | "rate"
> & {
  unit: string;
  rate: string;
} = {
  basis: "",
  unit_of_measurement: "",
  unit: "",
  rate: "",
};

const SECTION_DATA_SAMPLE_SCHEMA: ValidationSchema = {
  basis: { required: {} },
  unit_of_measurement: { required: {} },
  unit: { required: {}, number: { min: 1 } },
  rate: { required: {}, number: { min: 0 } },
};

export const SECTION_CURRENCY_SAMPLE: QuoteSectionI["section_currency"] = {
  currency: "NGN",
  exchange_rate: 1,
  is_base_currency: false,
  customer_currency: "USD",
};

const SECTION_CURRENCY_ERROR_SAMPLE: Omit<
  QuoteSetionCurrency,
  "exchange_rate" | "is_base_currency"
> & { exchange_rate: string } = {
  currency: "",
  exchange_rate: "",
  customer_currency: "",
};

const SECTION_CURRENCY_SAMPLE_SCHEMA: ValidationSchema = {
  currency: { required: {} },
  exchange_rate: { required: {}, number: {} },
  customer_currency: { required: {} },
};

const SECTION_SAMPLE: QuoteSectionI & { id?: string } = {
  section_name: "",
  section_number: 1,
  section_data: [{ ...SECTION_DATA_SAMPLE }],
  section_currency: { ...SECTION_CURRENCY_SAMPLE },
  id: v4(),
};

const SECTION_ERROR_SAMPLE = {
  section_name: "",
  section_number: "",
  section_data: [{ ...SECTION_DATA_ERROR_SAMPLE }],
  section_currency: { ...SECTION_CURRENCY_ERROR_SAMPLE },
};

const SECTION_SAMPLE_SCHEMA: ValidationSchema = {
  section_name: { required: {} },
  section_number: { required: {}, number: { min: 1 } },
  section_data: {
    object: SECTION_DATA_SAMPLE_SCHEMA,
  },
  section_currency: {
    object: SECTION_CURRENCY_SAMPLE_SCHEMA,
  },
};

const QUOTE_SAMPLE = {
  quote_date: "",
  sections: [{ ...SECTION_SAMPLE }],
  quote_title: "",
};

const QUOTE_ERROR_SAMPLE = {
  quote_date: "",
  quote_title: "",
  section: [{ ...SECTION_ERROR_SAMPLE }],
};

const QUOTE_SAMPLE_SCHEMA: ValidationSchema = {
  quote_date: { required: {} },
  quote_title: { required: {} },
  sections: {
    object: SECTION_SAMPLE_SCHEMA,
  },
};

const AddEditQuoteContext = createContext({
  quote: {
    ...QUOTE_SAMPLE,
  },
  errors: {
    ...QUOTE_ERROR_SAMPLE,
  },
  formIsValid: false,
  updateSection(sectionId: string, key: string, value: string | number) {
    console.log(sectionId, key, value);
  },
  updateSectionCurrency(
    sectionId: string,
    key: string,
    value: string | number
  ) {
    console.log(sectionId, key, value);
  },
  addSection() {},
  removeSection(sectionId: string) {
    console.log(sectionId);
  },
  updateSectionData(
    sectionId: string,
    sectionDataId: string,
    key: string,
    value: string | number
  ) {
    console.log(sectionId, sectionDataId, key, value);
  },
  addSectionData(sectionId: string) {
    console.log(sectionId);
  },
  removeSectionData(sectionId: string, sectionDataId: string) {
    console.log(sectionId, sectionDataId);
  },
  resetForm() {},
});

export default function AddEditQuote() {
  const navigate = useNavigate();
  const { showErrorMessage } = useNotificationContext();
  const location = useLocation();

  const dispatch = useDispatch();

  const { loading: fetchLoading } = useSelector<any, SingleQuoteState>(
    (state: any) => state?.quote
  );

  const params = useParams();

  useEffect(() => {
    if (params?.id) {
      const action = fetchQuoteStart();
      action.payload = {
        id: params?.id,
        onSuccess: (_: any, data: Quote) => {
          setQuote({
            ...data,
            sections: [...(data?.sections || [])].map((i) => ({
              ...i,
              id: i?._id || v4(),
              section_data: [...(i?.section_data || [])]?.map((d) => ({
                ...d,
                id: d?._id || v4(),
              })),
            })),
          } as any);
        },
        onError: (err: any) => {
          const errors = err?.errors;
          if (errors) {
            showErrorMessage(Object.keys(errors).map((e) => errors[e][0]));
          } else {
            showErrorMessage(err?.message || err || "Unknown error occured");
          }
        },
      } as any;
      dispatch(action);
    }
  }, [params]);

  const searchParams = new URLSearchParams(location.search);
  const [quote, setQuote] = useState({
    ...QUOTE_SAMPLE,
    quote_date: searchParams.get("quote_date"),
    quote_title: searchParams?.get("title"),
  });
  const [errors, setErrors] = useState({
    ...QUOTE_ERROR_SAMPLE,
  });
  const [formIsValid, setFormIsValid] = useState(false);

  useEffect(() => {
    if (
      !params?.id &&
      (!searchParams.get("quote_date") ||
        !searchParams?.get("title") ||
        !searchParams?.get("start_time") ||
        !searchParams?.get("end_time"))
    ) {
      showErrorMessage(
        "Quote date, title, start_time and end_time not provided in url search params"
      );
      navigate("/");
    }
  }, []);

  function updateSection(
    sectionId: string,
    key: string,
    value: string | number
  ) {
    setQuote((prev) => ({
      ...prev,
      sections: [...(prev?.sections || [])]?.map((s) => {
        if (s?.id == sectionId) {
          return { ...s, [key]: value };
        } else {
          return s;
        }
      }),
    }));
  }

  function updateSectionCurrency(
    sectionId: string,
    key: string,
    value: string | number
  ) {
    setQuote((prev) => ({
      ...prev,
      sections: [...(prev?.sections || [])]?.map((s) => {
        if (s?.id == sectionId) {
          return {
            ...s,
            section_currency: {
              ...(typeof s?.section_currency == "string"
                ? { currency: s?.section_currency }
                : s?.section_currency || {}),
              [key]: value,
            } as any,
          };
        } else {
          return s;
        }
      }),
    }));
  }

  function addSection() {
    setQuote((prev) => ({
      ...prev,
      sections: [
        ...(prev?.sections || []),
        {
          ...SECTION_SAMPLE,
          section_number: prev?.sections?.length + 1,
          id: v4(),
        },
      ],
    }));
  }

  function removeSection(sectionId: string) {
    setQuote((prev) => ({
      ...prev,
      sections: [...(prev.sections || [])]?.filter((s) => s?.id !== sectionId),
    }));
  }

  function updateSectionData(
    sectionId: string,
    sectionDataId: string,
    key: string,
    value: string | number
  ) {
    console.log(key, value);
    setQuote((prev) => ({
      ...prev,
      sections: [...(prev?.sections || [])]?.map((s) => {
        if (s?.id == sectionId) {
          return {
            ...s,
            section_data: [...(s?.section_data || [])]?.map((d: any) => {
              if (d?.id == sectionDataId) {
                return {
                  ...d,
                  [key]: value,
                  amount: ["unit"]?.includes(key)
                    ? parseFloat(d?.rate?.toString()?.replaceAll(",", "")) *
                      parseFloat(value?.toString()?.replaceAll(",", ""))
                    : ["rate"]?.includes(key)
                    ? parseFloat(d?.unit?.toString()?.replaceAll(",", "")) *
                      parseFloat(value?.toString()?.replaceAll(",", ""))
                    : d?.amount,
                } as any;
              } else {
                return d;
              }
            }),
          };
        } else {
          return s;
        }
      }),
    }));
    setTimeout(() => {}, 300);
  }

  function addSectionData(sectionId: string) {
    setQuote((prev) => ({
      ...prev,
      sections: [...(prev?.sections || [])]?.map((s) => {
        console.log(sectionId, s?.id);
        if (s?.id == sectionId) {
          return {
            ...s,
            section_data: [
              ...(s?.section_data || []),
              { ...SECTION_DATA_SAMPLE, id: v4() },
            ],
          };
        } else {
          return s;
        }
      }),
    }));
  }

  function removeSectionData(sectionId: string, sectionDataId: string) {
    console.log("called");
    setQuote((prev) => ({
      ...prev,
      sections: [...(prev?.sections || [])]?.map((s) => {
        if (s?.id == sectionId) {
          return {
            ...s,
            section_data: [...(s?.section_data || [])]?.filter(
              (d: any) => d?.id !== sectionDataId
            ),
          };
        } else {
          return s;
        }
      }),
    }));
  }

  useEffect(() => {
    const validated = transformValidationResult(
      validateForm(
        {
          ...(quote || {}),
          sections: [...(quote?.sections || [])]?.map((d) => ({
            ...(d || {}),
            section_currency: [d?.section_currency],
          })),
        },
        QUOTE_SAMPLE_SCHEMA
      )
    );
    setErrors({
      ...(validated?.errors || []),
      sections: (validated?.errors?.sections || [])?.map((d: any) => ({
        ...(d || {}),
        section_currency: d?.section_currency?.[0] || {},
      })),
    });
    setFormIsValid(validated?.meta?.is_empty);
  }, [quote]);

  function resetForm() {
    setFormIsValid(false);
    setQuote({
      ...QUOTE_SAMPLE,
      quote_date: searchParams.get("quote_date"),
      quote_title: searchParams?.get("title"),
    });
    setErrors({
      ...QUOTE_ERROR_SAMPLE,
    });
  }

  return (
    <AddEditQuoteContext.Provider
      value={{
        quote: quote as any,
        errors,
        formIsValid,
        updateSection,
        updateSectionCurrency,
        addSection,
        removeSection,
        updateSectionData,
        addSectionData,
        removeSectionData,
        resetForm,
      }}
    >
      <div className="relative">
        {fetchLoading ? (
          <div className="absolute top-0 left-0 right-0 h-screen w-full bg-black/10 grid place-items-center rounded-t-lg z-[200]">
            <Icon
              icon="mdi:loading"
              className="text-8xl animate-spin text-primary"
            />
          </div>
        ) : (
          <></>
        )}
        <div className="heading bg-bg1">
          <div className="container mx-auto py-[25px] px-4 flex gap-6 justify-between items-center">
            <div>
              <Link to="/" style={{ display: "contents" }}>
                <Button
                  variant="text"
                  color="light"
                  className="bg-bg1 p-0 border-bg1"
                >
                  <Icon icon="mdi:chevron-left" className="text-md" />
                  Back to quotes
                </Button>
              </Link>
              <h4 className="text-2xl font-medium text-dark">
                {quote.quote_title}{" "}
                <span className="text-light">
                  {format(quote?.quote_date || new Date(), "d/M/yyy")}
                </span>
              </h4>
            </div>
            <div className="flex gap-6">
              <Button variant="filled" color="light">
                Save as draft
              </Button>
              <PreviewQuoteModal data={quote} context={true}>
                <Button
                  variant="light"
                  color="primary"
                  className="bg-primary/20 text-primary"
                  disabled={!formIsValid}
                >
                  <Icon icon="mdi:eye-outline" className="text-xl" />
                  Preview
                </Button>
              </PreviewQuoteModal>
            </div>
          </div>
        </div>
        <div className="mb-[40px]">
          <div className="container mx-auto py-[40px] px-4">
            <div className="w-full max-w-[976px] py-[8px] px-[16px] rounded-t flex gap-4 items-center bg-bg2">
              <h4 className="text-dark text-xs font-medium">
                Change Quote Time
              </h4>
              <AddQuoteModal
                data={{
                  quote_date: quote?.quote_date || new Date(),
                  title: quote?.quote_title || "",
                  start_time:
                    (quote as any)?.start_time ||
                    searchParams?.get("start_time") ||
                    "",
                  end_time:
                    (quote as any)?.end_time ||
                    searchParams?.get("end_time") ||
                    "",
                }}
                onDone={(data) => {
                  setQuote((prev) => ({
                    ...prev,
                    qoute_date: data?.quote_date || "",
                    quote_title: data?.title || "",
                  }));
                  searchParams.set("quote_date", data?.quote_date as any);
                  searchParams.set("quote_title", data?.title || "");
                  searchParams.set("start_time", data?.start_time || "");
                  searchParams.set("end_time", data?.end_time || "");
                }}
              >
                <Button
                  variant="filled"
                  color="light"
                  radius="full"
                  className="text-xs px-[12px] py-[6px]"
                >
                  <span className="text-primary">
                    {format(quote?.quote_date || new Date(), "E do, MMM yyyy")}
                  </span>
                  <span className="uppercase">9:30 AM - 10:30 AM</span>
                  <Icon icon="mdi:chevron-down" className="text-xl" />
                </Button>
              </AddQuoteModal>
            </div>
          </div>
          <div className="grid gap-[35px]">
            {quote?.sections?.map((section: any) => (
              <>
                <QuoteSection key={section?.id} id={section?.id} />
              </>
            ))}
          </div>
        </div>
      </div>
    </AddEditQuoteContext.Provider>
  );
}

export function useAddEditQuote() {
  return useContext(AddEditQuoteContext);
}
