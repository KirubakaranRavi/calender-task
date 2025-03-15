import React, { useState, useEffect } from "react";
import dayjs from "dayjs";

const YearlyCalendar = ({ currentDate }) => {
  const [calendarMonths, setCalendarMonths] = useState([]);

  const interviewData = {
    title: "React Developer",
    interviewer: "Kiruba",
    time: "06:00PM - 07:00PM",
  };

  useEffect(() => {
    generateYearMonths();
  }, [currentDate]);

  // Generate all months and days for the current year
  const generateYearMonths = () => {
    const currentYear = dayjs(currentDate).year(); // Ensure currentDate is a dayjs object

    const months = Array.from({ length: 12 }, (_, monthIndex) => {
      const startOfMonth = dayjs(`${currentYear}-${monthIndex + 1}-01`);
      const daysInMonth = startOfMonth.daysInMonth();
      const startDay = startOfMonth.day();

      const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);

      // Fill days to align with the start day of the month
      const paddedDays = Array(startDay).fill(null).concat(days);

      // Ensure complete weeks (multiples of 7)
      while (paddedDays.length % 7 !== 0) {
        paddedDays.push(null);
      }

      return { month: startOfMonth.format("MMMM"), days: paddedDays };
    });

    setCalendarMonths(months);
  };

  return (
    <div className="p-4">
      <div className="grid grid-cols-3 gap-8">
        {calendarMonths.map(({ month, days }, monthIndex) => (
          <div key={monthIndex} className="border p-4 rounded-lg shadow">
            <h3 className="text-xl font-semibold text-center mb-4 text-blue-600">
              {month}
            </h3>

            {/* Days of the Week Header */}
            <div className="grid grid-cols-7 text-center font-medium mb-2">
              {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                <div key={day} className="p-1 text-gray-600">
                  {day}
                </div>
              ))}
            </div>

            {/* Calendar Days */}
            <div className="grid grid-cols-7 gap-1">
              {days.map((day, index) => (
                <div
                  key={index}
                  className="flex items-center justify-center h-10 border rounded"
                >
                  {day}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default YearlyCalendar;
