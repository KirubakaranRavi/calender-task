import React, { useState, useEffect } from "react";
import { RiEdit2Fill } from "react-icons/ri";
import { MdOutlineDeleteOutline } from "react-icons/md";
import dayjs from "dayjs";
import { Popover } from "./Popover";

import { formatDateTime } from "../../utlis/dateFormat";
import InterviewModal from "./DetailModal";

const WeeklySchedule = ({ currentDate }) => {
  const [timeSlots, setTimeSlots] = useState([]);
  const [weekDays, setWeekDays] = useState([]);
  const [dates, setDates] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedInterview, setSelectedInterview] = useState(null);

  const startOfWeek = currentDate.startOf("week").add(1, "day");

  const interviewData = [
    {
      id: 1,
      title: "React Developer",
      interviewer: "Kiruba",
      start: "2025-03-10T16:00:00+05:30",
      end: "2025-03-10T16:40:00+05:30",
    },
    {
      id: 2,
      summary: "1st Round",
      title: "Node.js Engineer",
      interviewer: "Karan",
      start: "2025-03-10T00:01:00+05:30",
      end: "2025-03-10T01:40:00+05:30",
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
        {
          id: 2,
          candidate: {
            candidate_firstName: "Jordan",
            candidate_lastName: "nick",
          },
          handled_by: {
            firstName: "Huno",
          },
          job_id: {
            jobRequest_Title: "MERN Developer",
          },
        },
      ],
    },
    {
      id: 3,
      summary: "2nd Round",
      title: "Next.js Engineer",
      interviewer: "Ravi",
      start: "2025-03-11T01:00:00+05:30",
      end: "2025-03-14T02:40:00+05:30",
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
    {
      id: 4,
      summary: "3rd Round",
      title: "Python Engineer",
      interviewer: "Shan",
      start: "2025-03-14T18:00:00+05:30",
      end: "2025-03-14T20:40:00+05:30",
      link: "http://www.hhh.com",
      user_det: [
        {
          id: 1,
          candidate: {
            candidate_firstName: "John",
            candidate_lastName: "Anger",
          },
          handled_by: {
            firstName: "Aeger",
          },
          job_id: {
            jobRequest_Title: "Java Developer",
          },
        },
      ],
    },
    {
      id: 5,
      summary: "4th Round",
      title: "C# Engineer",
      interviewer: "Beo",
      start: "2025-03-15T06:00:00+05:30",
      end: "2025-03-15T08:40:00+05:30",
      link: "http://www.hhh.com",
      user_det: [
        {
          id: 1,
          candidate: {
            candidate_firstName: "John",
            candidate_lastName: "Anger",
          },
          handled_by: {
            firstName: "Aeger",
          },
          job_id: {
            jobRequest_Title: "Java Developer",
          },
        },
      ],
    },
  ];

  useEffect(() => {
    generateTimeSlots();
    generateWeekDays();
  }, [currentDate]);

  const generateTimeSlots = () => {
    const slots = [];
    for (let hour = 0; hour < 24; hour++) {
      slots.push(formatTime(hour));
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

    setWeekDays(days);

    const newDates = days.map((_, index) => {
      const date = startOfWeek.clone().add(index, "day");
      return `${date.format("DD")} ${date.format("MMM")}`;
    });

    setDates(newDates);
  };

  // const isInterviewInSlot = (dayIndex, time) => {
  //   const day = startOfWeek.clone().add(dayIndex, "day").format("YYYY-MM-DD");

  //   return interviewData.filter(({ start, end }) => {
  //     const startTime = dayjs(start);
  //     const slotTime = parseTime(day, time);

  //     return startTime.isSame(slotTime, "hour") && startTime.isSame(day, "day");
  //   });
  // };

  const isInterviewInSlot = (dayIndex, time) => {
    const day = startOfWeek.clone().add(dayIndex, "day").format("YYYY-MM-DD");
    const slotTime = parseTime(day, time);

    return interviewData.filter(({ start, end }) => {
      const startTime = dayjs(start);
      const endTime = dayjs(end);

      // Check if the slotTime is between start and end (inclusive)
      return slotTime.isBetween(startTime, endTime, "hour", "[]");
    });
  };

  const parseTime = (date, time) => {
    const [hourMinute, period] = time.split(" ");
    let [hour, minute] = hourMinute.split(":").map(Number);
    if (period === "PM" && hour !== 12) hour += 12;
    if (period === "AM" && hour === 12) hour = 0;
    return dayjs(`${date} ${hour}:${minute}`);
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
                className="w-[12.14%] border-r border-gray-300 h-24"
              >
                {isInterviewInSlot(dayIndex, time).map((interview) => (
                  <Popover
                    key={interview.id}
                    position={
                      weekDays[dayIndex] === "Sunday" ||
                      weekDays[dayIndex] === "Saturday"
                        ? "left"
                        : "right"
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
                                <h4 className="text-sm font-semibold mb-0">
                                  {data.job_id.jobRequest_Title}
                                </h4>
                                <div className="flex items-center">
                                  <RiEdit2Fill size={18} cursor="pointer" />
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
                      <div className="absolute -top-2 -right-1 h-5 w-5 rounded-full bg-[#FFA500] flex items-center justify-center text-black text-[10px] font-semibold">
                        {interview.id}
                      </div>
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
                ))}
              </div>
            ))}
          </li>
        ))}
      </ul>
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

export default WeeklySchedule;
