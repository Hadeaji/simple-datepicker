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

const daysOfWeek = ["S", "M", "T", "W", "T", "F", "S"];

const getStartEndDate = (currentMonth: Date) => {
  const start = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1);
  const end = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0);
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
          className={`w-8 h-8 text-sm rounded-full flex items-center justify-center
            ${isSelected ? "bg-blue-600 text-white" : ""}
            ${isOutOfMonth ? "text-gray-400" : ""}
            ${isDisabled ? "opacity-50 cursor-not-allowed" : "hover:bg-blue-100"}`}
        >
          {format(cloneDay, "d")}
        </button>
      );
      day = addDays(day, 1);
    }

    return (
      <div className="grid grid-cols-7 gap-1">
        {daysOfWeek.map((d, idx) => (
          <div key={`${idx}-${d}`} className="text-center font-bold text-xs">
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
          />
        );
    }
  };

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
        className="absolute right-2 top-2.5 text-gray-600"
      >
        📅
      </button>
      {isOpen && (
        <div className="absolute z-10 bg-white border rounded shadow mt-2 p-2 w-[228px]">
          <div className="flex items-center justify-between mb-2">
            <button
              onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
              className="text-xl px-2"
            >
              ‹
            </button>
            <span className="font-medium">
              {format(currentMonth, "MMMM")}
            </span>
            {renderYearPicker()}
            <button
              onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
              className="text-xl px-2"
            >
              ›
            </button>
          </div>
          {renderDays()}
        </div>
      )}
    </div>
  );
};

export default CustomDatePicker;
