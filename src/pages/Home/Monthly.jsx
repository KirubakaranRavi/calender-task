// import React, { useState, useEffect } from "react";
// import dayjs from "dayjs";

// const MonthlyCalendar = ({ currentDate }) => {
//   const [calendarDays, setCalendarDays] = useState([]);
//   const [currentMonth, setCurrentMonth] = useState(dayjs(currentDate));

//   useEffect(() => {
//     setCurrentMonth(dayjs(currentDate));
//   }, [currentDate]);

//   useEffect(() => {
//     generateMonthDays();
//   }, [currentMonth]);

//   // Generate days of the month with weeks starting from Sunday to Saturday
//   const generateMonthDays = () => {
//     const startOfMonth = currentMonth.startOf("month");
//     const endOfMonth = currentMonth.endOf("month");

//     const daysInMonth = endOfMonth.date(); // Total days in current month
//     const startDay = startOfMonth.day(); // Day of the week (0 = Sunday, 6 = Saturday)

//     const days = [];

//     // Fill days from previous month if the month doesn't start on Sunday
//     for (let i = 0; i < startDay; i++) {
//       days.push(null);
//     }

//     // Fill days of the current month
//     for (let i = 1; i <= daysInMonth; i++) {
//       days.push(i);
//     }

//     // Ensure the array length is a multiple of 7 (for full weeks)
//     while (days.length % 7 !== 0) {
//       days.push(null);
//     }

//     setCalendarDays(days);
//   };

//   return (
//     <div className="p-4">
//       {/* Days of the Week Header */}
//       <div className="grid grid-cols-7 font-semibold text-center">
//         {[
//           "Sunday",
//           "Monday",
//           "Tuesday",
//           "Wednesday",
//           "Thursday",
//           "Friday",
//           "Saturday",
//         ].map((day) => (
//           <div key={day} className="p-2 border-b text-[blue]">
//             {day}
//           </div>
//         ))}
//       </div>

//       {/* Calendar Body */}
//       <div className="grid grid-cols-7">
//         {calendarDays.map((day, index) => (
//           <div
//             key={index}
//             className="border flex items-start justify-center h-24"
//           >
//             {day && <span>{day}</span>}
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default MonthlyCalendar;

import React, { useState, useEffect } from "react";
import dayjs from "dayjs";
import isBetween from "dayjs/plugin/isBetween";
import InterviewModal from "./DetailModal";
import { formatDateTime } from "../../utlis/dateFormat";
import { Popover } from "./Popover";
import { RiEdit2Fill } from "react-icons/ri";
import { MdOutlineDeleteOutline } from "react-icons/md";

dayjs.extend(isBetween); // Add this to enable the isBetween method

const MonthlyCalendar = ({ currentDate }) => {
  const [calendarDays, setCalendarDays] = useState([]);
  const [currentMonth, setCurrentMonth] = useState(dayjs(currentDate));
  const [isOpen, setIsOpen] = useState(false);
  const [selectedInterview, setSelectedInterview] = useState(null);

  const interviewData = [
    {
      id: 1,
      summary: "1st Round",
      title: "Node.js Engineer",
      interviewer: "Karan",
      start: "2025-03-10T00:01:00+05:30",
      end: "2025-03-12T01:40:00+05:30",
      link: "http://www.hhh.com",
      user_det: [
        {
          id: 1,
          candidate: {
            candidate_firstName: "Juni",
            candidate_lastName: "Kin",
          },
          handled_by: {
            firstName: "Prin",
          },
          job_id: {
            jobRequest_Title: "Node Developer",
          },
        },
      ],
    },
    {
      id: 2,
      summary: "2nd Round",
      title: "Next.js Engineer",
      interviewer: "Ravi",
      start: "2025-03-16T18:00:00+05:30",
      end: "2025-03-16T20:40:00+05:30",
      link: "http://www.hhh.com",
      user_det: [
        {
          id: 1,
          candidate: {
            candidate_firstName: "mohan",
            candidate_lastName: "raj",
          },
          handled_by: {
            firstName: "Vinodhini",
          },
          job_id: {
            jobRequest_Title: "Django Developer",
          },
        },
      ],
    },
  ];

  useEffect(() => {
    setCurrentMonth(dayjs(currentDate));
  }, [currentDate]);

  useEffect(() => {
    generateMonthDays();
  }, [currentMonth]);

  const generateMonthDays = () => {
    const startOfMonth = currentMonth.startOf("month");
    const endOfMonth = currentMonth.endOf("month");

    const daysInMonth = endOfMonth.date();
    const startDay = startOfMonth.day();

    const days = [];

    for (let i = 0; i < startDay; i++) {
      days.push(null);
    }

    for (let i = 1; i <= daysInMonth; i++) {
      days.push(i);
    }

    while (days.length % 7 !== 0) {
      days.push(null);
    }

    setCalendarDays(days);
  };

  const getInterviewsForDate = (day) => {
    return interviewData.filter((interview) => {
      const interviewStart = dayjs(interview.start);
      const interviewEnd = dayjs(interview.end);
      const currentDay = currentMonth.date(day);

      // Check if current day is between start and end (inclusive)
      return currentDay.isBetween(interviewStart, interviewEnd, "day", "[]");
    });
  };

  return (
    <div className="p-4">
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

      <div className="grid grid-cols-7">
        {calendarDays.map((day, index) => (
          <div
            key={index}
            className="border flex flex-col items-start justify-start h-[8rem] p-1"
          >
            {day && <span>{day}</span>}

            {day &&
              getInterviewsForDate(day).map((interview) => (
                <div
                  key={interview.id}
                  className="text-sm text-black-700 cursor-pointer"
                >
                  <Popover
                    key={interview.id}
                    position={
                      index % 7 === 5 || index % 7 === 6 ? "left" : "right"
                    }
                    content={
                      <div>
                        {interview?.user_det?.map((data) => {
                          const { formattedDate, startTime, endTime } =
                            formatDateTime(interview?.start, interview?.end);

                          let props_data = {
                            detail: data,
                            date: formattedDate,
                            startTime: startTime,
                            endTime: endTime,
                            link: interview?.link,
                          };
                          return (
                            <div
                              key={data.id}
                              className="w-55 ps-3 py-3 pe-2 border shadow-md bg-white rounded-lg relative cursor-pointer"
                              onClick={() => {
                                setSelectedInterview(props_data);
                                setIsOpen(true);
                              }}
                            >
                              <div className="absolute left-0 top-0 h-full w-[10px] bg-blue-500" />
                              <div className="flex justify-between items-center mb-2">
                                <h4 className="text-sm font-semibold text-black mb-0">
                                  {data.job_id.jobRequest_Title}
                                </h4>
                                <div className="flex items-center">
                                  <RiEdit2Fill
                                    size={18}
                                    cursor="pointer"
                                    color="black"
                                  />
                                  <MdOutlineDeleteOutline
                                    className="ms-2"
                                    size={18}
                                    cursor="pointer"
                                    color="red"
                                  />
                                </div>
                              </div>

                              {/* Fixed Flexbox Alignment */}
                              <div className="flex items-center justify-between">
                                <p className="text-xs text-gray-600 mb-0 truncate">
                                  {interview?.summary}
                                </p>
                                <span className="text-xs text-gray-600 mb-0 mx-2">
                                  |
                                </span>
                                <p className="text-xs text-gray-600 mb-0 truncate">
                                  Interviewer: {data.handled_by.firstName}
                                </p>
                              </div>
                              {/* Date and Time */}
                              <div className="flex items-center justify-between mt-1">
                                <p className="text-xs text-gray-600 mb-0">
                                  Date: {formattedDate || "N/A"}
                                </p>
                                <span className="text-xs text-gray-600 mb-0 mx-2">
                                  |
                                </span>
                                <p className="text-xs text-gray-600 mb-0">
                                  Time:{" "}
                                  {startTime && endTime
                                    ? `${startTime} - ${endTime}`
                                    : "N/A"}
                                </p>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    }
                  >
                    <div className="w-55 ps-3 py-1 pe-2 border shadow-md bg-white rounded-lg relative cursor-pointer mt-2 text-start">
                      <div className="absolute left-0 top-0 h-full w-[10px] bg-blue-500" />
                      {interview?.user_det?.length > 0 && (
                        <div className="absolute -top-2 -right-1 h-5 w-5 rounded-full bg-[#FFA500] flex items-center justify-center text-black text-[10px] font-semibold">
                          {interview?.user_det?.length}
                        </div>
                      )}
                      <div className="text-[12px] font-semibold mb-1">
                        {interview.title}
                      </div>
                      <div className="text-[12px] text-gray-600 mb-1">
                        Interviewer: {interview.interviewer}
                      </div>
                      <div className="text-[12px] text-gray-600 mb-1">
                        Time: {dayjs(interview.start).format("hh:mm A")} -{" "}
                        {dayjs(interview.end).format("hh:mm A")}
                      </div>
                    </div>
                  </Popover>
                </div>
              ))}
          </div>
        ))}
      </div>

      {selectedInterview && (
        <InterviewModal
          isOpen={isOpen}
          closeModal={() => setIsOpen(false)}
          interviewDetails={selectedInterview}
        />
      )}
    </div>
  );
};

export default MonthlyCalendar;
