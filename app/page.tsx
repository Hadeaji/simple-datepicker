"use client"

import CustomDatePicker from "@/components/CustomDatePicker/CustomDatePicker";
import Image from "next/image";
import { useState } from "react";

export default function Home() {
  const [date, setDate] = useState("");

  return (
    <div className="">
      <div className="">
        <h1 className="">Custom Date Picker Test</h1>
        <CustomDatePicker
          value={date}
          onChange={(newDate: any) => setDate(newDate)}
          minDate="01/01/2000"
          maxDate="12/31/2030"
          disabled={false}
          yearPickerMode="decade"
        />
      </div>
      {/* <input type="text" /> */}
    </div>
  );
}
