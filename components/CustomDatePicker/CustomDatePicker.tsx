import { useEffect, useState } from "react";
import {
  addDays,
  addMonths,
  format,
  isAfter,
  isBefore,
  isSameDay,
  isSameMonth,
  parse,
  subMonths,
  isValid,
  setYear,
} from "date-fns";
import DecadeYearPicker from "./YearPickers/DecadeYearPicker";
import ScrollYearPicker from "./YearPickers/ScrollYearPicker";
import DynamicYearPicker from "./YearPickers/DynamicYearPicker";
import { ArrowLeft, ArrowRight, Calendar } from 'lucide-react';

const daysOfWeek = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

const getStartEndDate = (currentMonth: Date) => {
  const start = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1);
  const dayOfWeek = start.getDay();
  const startDate = addDays(start, -dayOfWeek);
  const endDate = addDays(startDate, 41); // 6 weeks
  return { start: startDate, end: endDate };
};


interface Props {
  value: string;
  onChange: (value: string) => void;
  minDate?: string;
  maxDate?: string;
  disabled?: boolean;
  yearPickerMode?: "decade" | "scroll" | "dynamic";
  yearMin?: number;
  yearMax?: number;
}

const CustomDatePicker = ({
  value,
  onChange,
  minDate,
  maxDate,
  disabled,
  yearPickerMode = "decade",
  yearMin = 1900,
  yearMax = 2100,
}: Props) => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [inputValue, setInputValue] = useState("");
  const [isDecadeView, setIsDecadeView] = useState(false);

  useEffect(() => {
    const parsed = value ? new Date(value) : null;
    if (parsed) setCurrentMonth(parsed);
    setInputValue(value);
  }, [value]);

  const today = new Date();

  const handleDateInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const dateInput = e.target.value;
    setInputValue(dateInput);
    if (dateInput.length === 10) {
      const parsedDate = parse(dateInput, "MM/dd/yyyy", new Date());
      if (
        isValid(parsedDate) &&
        (!minDate || !isBefore(parsedDate, new Date(minDate))) &&
        (!maxDate || !isAfter(parsedDate, new Date(maxDate)))
      ) {
        onChange(dateInput);
      }
    }
  };

  const handleBlur = () => {
    const parsedDate = parse(inputValue, "MM/dd/yyyy", new Date());
    if (!isValid(parsedDate)) {
      setInputValue("");
      onChange("");
    } else if (
      (minDate && isBefore(parsedDate, new Date(minDate))) ||
      (maxDate && isAfter(parsedDate, new Date(maxDate)))
    ) {
      setInputValue("");
      onChange("");
    }
  };

  const renderDays = () => {
    const { start, end } = getStartEndDate(currentMonth);
    const days = [];
    let day = start;

    while (day <= end) {
      const cloneDay = new Date(day);
      const formatted = format(cloneDay, "MM/dd/yyyy");
      const isToday = isSameDay(cloneDay, today);
      const isSelected = value && isSameDay(new Date(value), cloneDay);
      const isOutOfMonth = !isSameMonth(cloneDay, currentMonth);
      const isDisabled =
        (minDate && isBefore(cloneDay, new Date(minDate))) ||
        (maxDate && isAfter(cloneDay, new Date(maxDate)));

      days.push(
        <button
          key={formatted}
          disabled={!!isDisabled}
          onClick={() => {
            onChange(formatted);
            setIsOpen(false);
          }}
          className={`m-auto w-8 h-8 text-xs rounded-full flex items-center justify-center
            ${isSelected ? "bg-[#1B8354] text-white" : ""}
            ${isToday && !isSelected ? "border-2 border-[#1B8354] text-[#1B8354]" : ""}
            ${isOutOfMonth ? "text-[#64748B]" : ""}
            ${isDisabled ? "opacity-50 cursor-not-allowed" : "hover:bg-[#88D8AD]"}`}
        >
          {format(cloneDay, "d")}
        </button>
      );
      day = addDays(day, 1);
    }

    return (
      <div className="grid grid-cols-7 gap-1">
        {daysOfWeek.map((d, idx) => (
          <div key={`${idx}-${d}`} className="flex justify-center items-center text-xs text-[#64748B] h-[32px] mb-1">
            {d}
          </div>
        ))}
        {days}
      </div>
    );
  };

  const renderYearPicker = () => {
    switch (yearPickerMode) {
      case "scroll":
        return (
          <ScrollYearPicker
            currentYear={currentMonth.getFullYear()}
            setYear={(year) => setCurrentMonth(setYear(currentMonth, year))}
            min={yearMin}
            max={yearMax}
          />
        );
      case "dynamic":
        return (
          <DynamicYearPicker
            currentYear={currentMonth.getFullYear()}
            setYear={(year) => setCurrentMonth(setYear(currentMonth, year))}
          />
        );
      default:
        return (
          <DecadeYearPicker
            currentYear={currentMonth.getFullYear()}
            setYear={(year) => setCurrentMonth(setYear(currentMonth, year))}
            isDecadeView={isDecadeView}
            setIsDecadeView={setIsDecadeView}
          />
        );
    }
  };

  // Determine if we should show the decade grid instead of days
  const shouldShowDecadeGrid = yearPickerMode === "decade" && isDecadeView;

  function renderMonthsNavigation(): import("react").ReactNode {
    return (
      <div className="flex justify-between items-center">
        <button
          onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
          className="text-xl p-2 hover:bg-[#f5f5f5]"
        >
          <ArrowLeft size={16} strokeWidth={1} absoluteStrokeWidth />
        </button>
        <button
          onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
          className="text-xl p-2 hover:bg-[#f5f5f5]"
        >
          <ArrowRight size={16} strokeWidth={1} absoluteStrokeWidth />
        </button>
      </div>
    )
  }

  return (
    <div className="relative w-[228px]">
      <input
        type="text"
        className="border rounded px-3 py-2 w-full"
        placeholder="MM/DD/YYYY"
        value={inputValue}
        onChange={handleDateInput}
        onBlur={handleBlur}
        disabled={disabled}
      />
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="absolute right-2 top-3 text-gray-600"
      >
        <Calendar size={16} strokeWidth={1} absoluteStrokeWidth />
      </button>
      {isOpen && (
        <div className="absolute z-10 bg-white rounded shadow mt-2 p-2 w-[280px]">
          <div className={`flex items-center gap-1 py-2 ${!shouldShowDecadeGrid && "h-[40px]"} justify-between ${shouldShowDecadeGrid && 'flex-col'}`}>

            {!!shouldShowDecadeGrid ? (
              <button
                onClick={() => setIsDecadeView(false)}
                className="text-sm text-[#64748B] hover:text-gray-700"
              >
                Back
              </button>
            ) :
              <span className="font-medium pl-2 font-semibold text-sm text-[#161616]">
                {format(currentMonth, "MMMM")}
              </span>
            }
            {renderYearPicker()}
            <div
              id="spacer"
              className="flex flex-grow-1 w-[100%]"
            />
            {!shouldShowDecadeGrid && renderMonthsNavigation()}

          </div>
          {!shouldShowDecadeGrid && renderDays()}
        </div>
      )}
    </div>
  );
};

export default CustomDatePicker;
