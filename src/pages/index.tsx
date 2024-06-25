import {
  addMonths,
  eachDayOfInterval,
  endOfMonth,
  endOfWeek,
  format,
  startOfMonth,
  startOfWeek,
  subMonths,
} from "date-fns";
import { useEffect, useState } from "react";
import Day from "../components/day";
import { Icon } from "@iconify/react/dist/iconify.js";
import DaySideBarProvider from "../components/day-sidebar";
import { useDispatch, useSelector } from "react-redux";
import { QuoteState, fetchQuotesStart } from "../store/features/quotes";

const Index = () => {
  const [currentDate, setCurrentDate] = useState(new Date());

  const nextMonth = () => setCurrentDate(addMonths(currentDate, 1));
  const prevMonth = () => setCurrentDate(subMonths(currentDate, 1));

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const startDate = startOfWeek(monthStart);
  const endDate = endOfWeek(monthEnd);

  const dateFormat = "MMMM yyyy";
  const days = eachDayOfInterval({ start: startDate, end: endDate });

  const dispatch = useDispatch();

  const { quotes, loading, error } = useSelector<any, QuoteState>(
    (state: any) => state?.quotes
  );

  useEffect(() => {
    const action = fetchQuotesStart();
    action.payload = {
      start_date: startDate?.toISOString(),
      end_date: endDate?.toISOString(),
    } as any;
    dispatch(action);
  }, [dispatch, currentDate]);

  console.log("Rendering QuoteList", { quotes, loading, error });

  return (
    <div className="mt-10 mb-4 flex flex-col gap-[30px]">
      <div className=" container mx-auto flex items-start justify-between">
        <div className="w-full">
          <h2 className="text-dark text-2xl font-semibold leading-[29.05px] tracking-[-3%]">
            All Existing Quotes
          </h2>
          <p className="text-xs text-light">View all created quotes</p>
        </div>
        <div className="flex justify-between items-center whitespace-nowrap gap-2">
          <h2 className="font-bold text-2xl text-dark">
            {format(currentDate, dateFormat?.split(" ")[0])}{" "}
            <span className="text-primary">
              {format(currentDate, dateFormat?.split(" ")[1])}
            </span>
          </h2>
          <div className="flex">
            <button onClick={prevMonth} className="p-0 rounded">
              <Icon icon="mdi:chevron-left" className="text-3xl text-dark" />
            </button>
            <button onClick={nextMonth} className="p-0 rounded">
              <Icon icon="mdi:chevron-right" className="text-3xl text-dark" />
            </button>
          </div>
        </div>
      </div>
      <div className="relative">
        <div className="container mx-auto grid grid-cols-7 border-t border-l text-base leading-[19.36px] text-[#969696] font-medium rounded-t-lg overflow-hidden">
          {loading ? (
            <div className="container mx-auto absolute top-0 left-0 right-0 h-full w-full bg-black/10 grid place-items-center rounded-t-lg">
              <Icon
                icon="mdi:loading"
                className="text-8xl animate-spin text-primary"
              />
            </div>
          ) : (
            <></>
          )}
          {["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"].map((day) => (
            <div key={day} className="p-2 border-b border-r">
              {day}
            </div>
          ))}
          <DaySideBarProvider>
            {days.map((day, idx) => (
              <div key={idx} className="border-b border-r">
                <Day date={day} currentMonth={currentDate} quotes={quotes} />
              </div>
            ))}
          </DaySideBarProvider>
        </div>
      </div>
    </div>
  );
};

export default Index;
