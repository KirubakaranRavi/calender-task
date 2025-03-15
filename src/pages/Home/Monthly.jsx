import React, { useState, useEffect } from "react";
import dayjs from "dayjs";

const MonthlyCalendar = ({ currentDate }) => {
  const [calendarDays, setCalendarDays] = useState([]);
  const [currentMonth, setCurrentMonth] = useState(dayjs(currentDate));

  useEffect(() => {
    setCurrentMonth(dayjs(currentDate));
  }, [currentDate]);

  useEffect(() => {
    generateMonthDays();
  }, [currentMonth]);

  // Generate days of the month with weeks starting from Sunday to Saturday
  const generateMonthDays = () => {
    const startOfMonth = currentMonth.startOf("month");
    const endOfMonth = currentMonth.endOf("month");

    const daysInMonth = endOfMonth.date(); // Total days in current month
    const startDay = startOfMonth.day(); // Day of the week (0 = Sunday, 6 = Saturday)

    const days = [];

    // Fill days from previous month if the month doesn't start on Sunday
    for (let i = 0; i < startDay; i++) {
      days.push(null);
    }

    // Fill days of the current month
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(i);
    }

    // Ensure the array length is a multiple of 7 (for full weeks)
    while (days.length % 7 !== 0) {
      days.push(null);
    }

    setCalendarDays(days);
  };

  return (
    <div className="p-4">
      {/* Days of the Week Header */}
      <div className="grid grid-cols-7 font-semibold text-center">
        {[
          "Sunday",
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday",
          "Saturday",
        ].map((day) => (
          <div key={day} className="p-2 border-b text-[blue]">
            {day}
          </div>
        ))}
      </div>

      {/* Calendar Body */}
      <div className="grid grid-cols-7">
        {calendarDays.map((day, index) => (
          <div
            key={index}
            className="border flex items-start justify-center h-24"
          >
            {day && <span>{day}</span>}
          </div>
        ))}
      </div>
    </div>
  );
};

export default MonthlyCalendar;
