import React from "react";
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface DecadeYearPickerProps {
  currentYear: number;
  setYear: (year: number) => void;
  isDecadeView: boolean;
  setIsDecadeView: (isDecadeView: boolean) => void;
}

const DecadeYearPicker: React.FC<DecadeYearPickerProps> = ({ 
  currentYear, 
  setYear, 
  isDecadeView, 
  setIsDecadeView 
}) => {
  const [decadeStart, setDecadeStart] = React.useState(Math.floor(currentYear / 10) * 10);

  const years = Array.from({ length: 12 }, (_, index) => decadeStart + index);

  const handleYearClick = () => {
    setIsDecadeView(true);
  };

  const handleYearSelect = (year: number) => {
    setYear(year);
    setIsDecadeView(false);
  };

  const handlePrevDecade = () => {
    setDecadeStart(decadeStart - 10);
  };

  const handleNextDecade = () => {
    setDecadeStart(decadeStart + 10);
  };

  return (
    <div className="text-[#161616] w-[100%]">
      {!isDecadeView ? (
        <button
          className="px-2 py-1 text-sm text-center font-semibold bg-white rounded-md hover:bg-[#f5f5f5]"
          onClick={handleYearClick}
        >
          {currentYear}
        </button>
      ) : (
        <div>
          <div className="flex justify-between items-center mb-2">
            <button
              className="px-2 py-1 bg-gray-50 rounded-md hover:bg-[#f5f5f5]"
              onClick={handlePrevDecade}
            >
              <ChevronLeft size={16} strokeWidth={1} absoluteStrokeWidth/>
            </button>
            <span className="text-md">{decadeStart} - {decadeStart + 11}</span>
            <button
              className="px-2 py-1 bg-gray-50 rounded-md hover:bg-[#f5f5f5]"
              onClick={handleNextDecade}
            >
              <ChevronRight size={16} strokeWidth={1} absoluteStrokeWidth />
            </button>
          </div>
          <div className="grid grid-cols-3 gap-2 mt-4">
            {years.map((year) => (
              <button
                key={year}
                className="px-4 py-2 text-sm rounded-md bg-gray-100 hover:bg-[#88D8AD] hover:text-white"
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
