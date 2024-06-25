import { forwardRef, useState } from "react";
import { Autocomplete, AutocompleteProps } from "./autocomplete";
import { padLeadingZero } from "../../utils/functions";

interface TimeOptions {
  AM: (
    | {
        label: string;
        value: string | number;
      }
    | undefined
  )[];
  PM: (
    | {
        label: string;
        value: string | number;
      }
    | undefined
  )[];
}

const TimePicker = forwardRef(function TimePicker(
  props: Omit<AutocompleteProps, "options">,
  ref: any
) {
  const [options] = useState<TimeOptions>({
    AM: loadTime("AM"),
    PM: loadTime("PM"),
  });

  function loadTime(daylight: "AM" | "PM") {
    let max = 12;
    const inProcess: TimeOptions[typeof daylight] = [];
    while (max > 0) {
      let max2 = 59;
      while (max2 > -1) {
        inProcess.push({
          label: `${padLeadingZero(max)} : ${padLeadingZero(max2)} ${daylight}`,
          value: `${padLeadingZero(max)} : ${padLeadingZero(max2)} ${daylight}`,
        });
        max2--;
      }
      max--;
    }
    return inProcess;
  }

  const { key, ...respProps } = props as any;

  console.log(key);

  return (
    <Autocomplete
      {...respProps}
      options={[...(options?.AM || []), ...(options?.PM || [])]}
      disableClearable={true}
      ref={ref}
    />
  );
});

export default TimePicker;
