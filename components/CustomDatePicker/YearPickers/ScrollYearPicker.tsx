import React from "react";

interface ScrollYearPickerProps {
  currentYear: number;
  setYear: (year: number) => void;
  min: number;
  max: number;
}

const ScrollYearPicker: React.FC<ScrollYearPickerProps> = ({ currentYear, setYear, min, max }) => {
  const handleYearChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setYear(Number(event.target.value));
  };

  return (
    <div className="space-y-2">
      <select
        className="block w-full px-4 py-2 border rounded-md"
        value={currentYear}
        onChange={handleYearChange}
      >
        {Array.from({ length: max - min + 1 }, (_, index) => min + index).map((year) => (
          <option key={year} value={year}>
            {year}
          </option>
        ))}
      </select>
    </div>
  );
};

export default ScrollYearPicker;
