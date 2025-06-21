import React, { useState } from "react";

interface DecadeYearPickerProps {
  currentYear: number;
  setYear: (year: number) => void;
}

const DecadeYearPicker: React.FC<DecadeYearPickerProps> = ({ currentYear, setYear }) => {
  const [isDecadeView, setIsDecadeView] = useState(false); // Track whether to show the decade grid or not
  const [decadeStart, setDecadeStart] = useState(Math.floor(currentYear / 10) * 10); // Start year of the current decade

  const years = Array.from({ length: 12 }, (_, index) => decadeStart + index); // 12 years grid

  // Toggle to show/hide the decade grid
  const handleYearClick = () => {
    setIsDecadeView(true);
  };

  // Select a year and return to the normal calendar
  const handleYearSelect = (year: number) => {
    setYear(year);
    setIsDecadeView(false);
  };

  // Move to the previous decade (10 years back)
  const handlePrevDecade = () => {
    setDecadeStart(decadeStart - 10);
  };

  // Move to the next decade (10 years forward)
  const handleNextDecade = () => {
    setDecadeStart(decadeStart + 10);
  };

  return (
    <div>
      {/* Show selected year or decade grid */}
      {!isDecadeView ? (
        <button
          className="px-4 py-2 text-xl font-bold text-center bg-gray-200 rounded-md w-full hover:bg-gray-300"
          onClick={handleYearClick}
        >
          {currentYear}
        </button>
      ) : (
        <div>
          <div className="flex justify-between items-center mb-2">
            {/* Left button to move back a decade */}
            <button
              className="px-2 py-1 bg-gray-200 rounded-md hover:bg-gray-300"
              onClick={handlePrevDecade}
            >
              &lt;
            </button>
            <span className="text-lg font-bold">{decadeStart} - {decadeStart + 11}</span>
            {/* Right button to move forward a decade */}
            <button
              className="px-2 py-1 bg-gray-200 rounded-md hover:bg-gray-300"
              onClick={handleNextDecade}
            >
              &gt;
            </button>
          </div>
          <div className="grid grid-cols-3 gap-2 mt-4">
            {years.map((year) => (
              <button
                key={year}
                className="px-4 py-2 text-sm font-semibold rounded-md bg-gray-200 hover:bg-gray-300"
                onClick={() => handleYearSelect(year)}
              >
                {year}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default DecadeYearPicker;
