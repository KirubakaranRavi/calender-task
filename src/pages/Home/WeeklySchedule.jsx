import React, { useState, useEffect } from "react";

const WeeklySchedule = ({ currentDate }) => {
  const [timeSlots, setTimeSlots] = useState([]);
  const [weekDays, setWeekDays] = useState([]);
  const [dates, setDates] = useState([]);

  // Calculate start and end of the week dynamically based on currentDate
  const startOfWeek = currentDate.startOf("week").add(1, "day"); // Start of the week (Monday)
  const endOfWeek = currentDate.endOf("week").add(1, "day"); // End of the week (Sunday)

  console.log("Start of the Week:", startOfWeek.format("DD MMMM YYYY"));
  console.log("End of the Week:", endOfWeek.format("DD MMMM YYYY"));

  useEffect(() => {
    generateTimeSlots();
    generateWeekDays();
  }, [currentDate]); // Add currentDate to dependencies so the effect runs when it changes

  const generateTimeSlots = () => {
    const slots = [];
    for (let hour = 0; hour < 24; hour++) {
      const formattedTime = formatTime(hour);
      slots.push(formattedTime);
    }
    setTimeSlots(slots);
  };

  const formatTime = (hour) => {
    const period = hour >= 12 ? "PM" : "AM";
    const displayHour = hour % 12 === 0 ? 12 : hour % 12;
    return `${String(displayHour).padStart(2, "0")}:00 ${period}`;
  };

  const generateWeekDays = () => {
    const days = [
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
      "Sunday",
    ];

    const newWeekDays = days.map((day, index) => {
      const date = startOfWeek.clone().add(index, "day"); // Clone the startOfWeek and add the index to get each day
      return day; // Store only the day names here
    });

    const newDates = days.map((day, index) => {
      const date = startOfWeek.clone().add(index, "day"); // Clone the startOfWeek and add the index to get each date
      const month = date.format("MMM"); // Short month name
      const dayOfMonth = date.format("DD"); // Day of the month
      return `${dayOfMonth} ${month}`; // Store only the date in separate state
    });

    setWeekDays(newWeekDays);
    setDates(newDates); // Set dates state separately
  };

  return (
    <div className="overflow-hidden h-[500px] overflow-y-auto p-4">
      <div className="flex border-t border-gray-300">
        <div className="w-[15%] border-r border-gray-300 p-4 text-lg font-semibold"></div>
        {weekDays.map((day, index) => (
          <div
            key={index}
            className="w-[12.14%] border-r border-gray-300 p-4 text-lg font-semibold text-center"
          >
            <div>{dates[index]}</div>
            <div>{day}</div>
          </div>
        ))}
      </div>
      <ul className="p-0">
        {timeSlots.map((time, index) => (
          <li
            key={index}
            className={`flex border-t ${
              index === timeSlots.length - 1 ? "border-b border-gray-300" : ""
            } border-gray-300`}
          >
            <div className="w-[15%] border-r border-gray-300 flex justify-center items-end text-lg text-[blue] h-24">
              {time}
            </div>
            {weekDays.map((_, dayIndex) => (
              <div
                key={dayIndex}
                className="w-[12.14%] border-r border-gray-300 h-24 flex items-center justify-center"
              >
                Data goes here
              </div>
            ))}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default WeeklySchedule;
