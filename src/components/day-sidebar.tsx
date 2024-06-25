import { ReactNode, createContext, useContext, useMemo, useState } from "react";
import { DayProps } from "./day";
import Button from "./button";
import { Icon } from "@iconify/react/dist/iconify.js";
import { format } from "date-fns";
import quotes, { Quote } from "../store/features/quotes";
import { twMerge } from "tw-merge";
import currencySymbol from "currency-symbol";
import { formatNumber } from "../utils/functions";
import AddQuoteModal from "./add-quote-modal";
import PreviewQuoteModal from "./preview-quote-modal";

function SingleQuoteButton({ quote }: { quote: Quote }) {
  const quoteStats = useMemo(() => {
    const count = [quote].reduce((prev) => prev + 1, 0);

    const currencies = [];

    for (const q of [quote]) {
      for (const sec of q.sections) {
        if (typeof sec?.section_currency == "string") {
          currencies.push(sec?.section_currency);
        } else {
          currencies.push(sec?.section_currency?.currency);
        }
      }
    }

    const amount: Record<string, number> = {};

    for (const c of currencies) {
      amount[c] = [quote].reduce(
        (sum, q) =>
          sum +
          q.sections.reduce(
            (sum1, sec) =>
              sum1 +
              (((sec as any)?.section_currency?.currency ||
                (sec as any)?.section_currency ||
                "") == c
                ? sec.section_data.reduce((sum2, d) => sum2 + d.amount, 0)
                : 0),
            0
          ),
        0
      );
    }

    return { count, amount };
  }, [quotes]);
  return (
    <PreviewQuoteModal data={quote}>
      <button className="text-left p-1 items-stretch rounded hover:bg-[#D0F5FF] hover:!text-[#005BC2] flex gap-2 text-xs h-[54px]">
        <div className="h-full w-[5px] max-w-[5px] rounded-sm bg-[#374151] self-stretch">
          &nbsp;
        </div>
        <div className="flex flex-col gap-[10px] w-full">
          <div className="flex items-center gap-4 justify-between">
            <p>
              {Object.keys(quoteStats?.amount || {}).map((key, idx) => (
                <>
                  <span
                    dangerouslySetInnerHTML={{
                      __html: currencySymbol.symbol(key || "NGN"),
                    }}
                  ></span>
                  <span>
                    {formatNumber(quoteStats?.amount[key] || 0)}
                    {idx < Object.keys(quoteStats?.amount || {})?.length - 1
                      ? ", "
                      : ""}
                  </span>
                </>
              ))}
            </p>
            <p className="px-[2px] bg-[#374151] rounded-sm text-[#D0F5FF] uppercase">
              {format(quote.quote_date, "HH:MM a")}
            </p>
          </div>
          <h4 className="line-clamp-1">{quote?.quote_title}</h4>
        </div>
      </button>
    </PreviewQuoteModal>
  );
}

const DaySideBarContext = createContext({
  toggle: (props: DayProps) => {
    console.log(props);
  },
  data: {
    date: new Date(),
    currentMonth: new Date(),
    quotes: [] as any as Quote[],
  },
  open: false,
});

export interface DaySideBarProps {
  children: ReactNode;
}

export default function DaySideBarProvider({ children }: DaySideBarProps) {
  const [open, setOpen] = useState(false);
  const [data, setData] = useState<DayProps>({
    date: new Date(),
    currentMonth: new Date(),
    quotes: [] as any as Quote[],
  });

  function toggle(props: DayProps) {
    setOpen(true);
    setData(props);
  }
  return (
    <DaySideBarContext.Provider value={{ toggle, data, open }}>
      <div
        className={twMerge(
          `absolute duration-500 top-0 right-0 w-full max-w-[300px] bg-[#1F2937] p-[20px] h-full slide-out-to-right-[100%] slide-in-from-right-[100%] ${
            open ? "animate-in" : "animate-out hidden"
          }`
        )}
      >
        <Button
          className="absolute top-0.5 right-0.5 p-0.5"
          variant="text"
          color="light"
          radius="full"
          onClick={() => {
            setOpen(false);
            setData({ date: new Date(), currentMonth: new Date(), quotes: [] });
          }}
        >
          <Icon icon="mdi:close" className="text-sm" />
        </Button>
        <div className="flex flex-col gap-[25px]">
          <div className="heading flex justify-between items-center">
            <h3 className="text-blue-500 font-bold">
              TODAY{" "}
              <span className="!font-normal">
                {format(data?.date, "d/M/yyyy")}
              </span>
            </h3>
            <h4>
              55º/40º
              <Icon icon="noto-v1:sun" className="text-xl inline" />
            </h4>
          </div>
          {data?.quotes && data.quotes?.length > 0 ? (
            data.quotes.map((quote) => (
              <div key={quote?._id} className="w-full grid">
                <SingleQuoteButton quote={quote} />
              </div>
            ))
          ) : (
            <p className="text-light text-center w-full text-sm">
              There are no quotes to show...
            </p>
          )}
          <AddQuoteModal data={{ quote_date: data?.date } as any}>
            <Button variant="filled" color="light" className="text-[#1F2937]">
              <Icon icon="mdi:plus" className="text-xl text-inherit" />
              Add new quote
            </Button>
          </AddQuoteModal>
        </div>
      </div>

      {children}
    </DaySideBarContext.Provider>
  );
}

export function useDaySideBarContext() {
  return useContext(DaySideBarContext);
}
