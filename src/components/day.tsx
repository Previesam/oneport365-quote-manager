import { format, isSameDay, isSameMonth, isToday } from "date-fns";
import { useDaySideBarContext } from "./day-sidebar";
import { useEffect, useMemo, useState } from "react";
import { Quote } from "../store/features/quotes";
import { formatNumber } from "../utils/functions";
import * as currencySymbol from "currency-symbol";
import { twMerge } from "tw-merge";

export interface DayProps {
  date: Date;
  currentMonth: Date;
  quotes: Quote[];
}

const Day = ({ date, currentMonth, quotes }: DayProps) => {
  const dayNumber = format(date, "d");
  const isCurrentMonth = isSameMonth(date, currentMonth);

  const { toggle, open, data } = useDaySideBarContext();

  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    if (open) {
      if (data?.date == date && data?.currentMonth == currentMonth) {
        setIsActive(true);
      } else {
        setIsActive(false);
      }
    } else {
      setIsActive(false);
    }
  }, [data.date, data.currentMonth, data.quotes, open]);

  const quoteStats = useMemo(() => {
    if (!isCurrentMonth) return null;

    const count = quotes.reduce(
      (prev, curr) => prev + (isSameDay(curr.quote_date, date) ? 1 : 0),
      0
    );

    const currencies = [];

    for (const quote of quotes) {
      if (!isSameDay(quote.quote_date, date)) continue;
      for (const sec of quote.sections) {
        if (typeof sec?.section_currency == "string") {
          currencies.push(sec?.section_currency);
        } else {
          currencies.push(sec?.section_currency?.currency);
        }
      }
    }

    const amount: Record<string, number> = {};

    for (const c of currencies) {
      amount[c] = quotes.reduce(
        (sum, quote) =>
          sum +
          (isSameDay(quote.quote_date, date)
            ? quote.sections.reduce(
                (sum1, sec) =>
                  sum1 +
                  (((sec as any)?.section_currency?.currency ||
                    (sec as any)?.section_currency ||
                    "") == c
                    ? sec.section_data.reduce((sum2, d) => sum2 + d.amount, 0)
                    : 0),
                0
              )
            : 0),
        0
      );
    }

    return { count, amount };
  }, [quotes]);

  return (
    <button
      className={twMerge(
        `px-1 pt-1 pb-3 h-full w-full text-left flex flex-col gap-[30px] bg-white ${
          isCurrentMonth ? "" : "cursor-default"
        } ${isActive ? "bg-[#1F2937]" : ""}`
      )}
      onClick={() =>
        !isCurrentMonth
          ? false
          : toggle({
              date,
              currentMonth,
              quotes: quotes.filter((q) => isSameDay(q.quote_date, date)),
            })
      }
    >
      {isCurrentMonth && (
        <>
          <div
            className={twMerge(
              `text-base leading-[19.36px] font-medium w-fit h-fit p-[5px] text-[#969696] ${
                isToday(date) ? "rounded-lg bg-[#005BC2] !text-white" : ""
              } ${isActive ? "!text-white" : ""}`
            )}
          >
            {dayNumber}
          </div>
          <div
            className={twMerge(
              `px-2 text-xs  flex flex-col gap-[5px] ${
                isActive ? "text-white" : "text-[#374151]"
              }`
            )}
          >
            <div className="p-[2px_4px] rounded">
              {quoteStats?.count || 0} Quotes
            </div>
            <div
              className={twMerge(
                ` p-[2px_4px] rounded ${
                  isActive ? "bg-white text-[#1F2937]" : "bg-primary/20"
                }`
              )}
            >
              Total:{" "}
              {Object.keys(quoteStats?.amount || {})?.length > 0 ? (
                Object.keys(quoteStats?.amount || {}).map((key, idx) => (
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
                ))
              ) : (
                <>
                  <span
                    dangerouslySetInnerHTML={{
                      __html: currencySymbol.symbol("NGN"),
                    }}
                  ></span>
                  <span>{formatNumber(0)}</span>
                </>
              )}
            </div>
          </div>
        </>
      )}
    </button>
  );
};

export default Day;
