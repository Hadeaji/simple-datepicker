import React from "react";

interface DynamicYearPickerProps {
  currentYear: number;
  setYear: (year: number) => void;
}

const DynamicYearPicker: React.FC<DynamicYearPickerProps> = ({ currentYear, setYear }) => {
  const startYear = currentYear - 6; // 6 years before
  const endYear = currentYear + 5;   // 5 years after

  const years = Array.from({ length: endYear - startYear + 1 }, (_, index) => startYear + index);

  return (
    <div className="flex space-x-2 overflow-x-auto">
      {years.map((year) => (
        <button
          key={year}
          className="px-4 py-2 text-sm font-semibold rounded-md bg-gray-200 hover:bg-gray-300"
          onClick={() => setYear(year)}
        >
          {year}
        </button>
      ))}
    </div>
  );
};

export default DynamicYearPicker;
