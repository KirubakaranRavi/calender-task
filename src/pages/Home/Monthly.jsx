import React, { useState, useEffect } from "react";
import dayjs from "dayjs";
import isBetween from "dayjs/plugin/isBetween";
import InterviewModal from "./DetailModal";
import { formatDateTime } from "../../utlis/dateFormat";
import { Popover } from "./Popover";
import { RiEdit2Fill } from "react-icons/ri";
import { MdOutlineDeleteOutline } from "react-icons/md";
import { interviewData } from "./data";

dayjs.extend(isBetween); // Add this to enable the isBetween method

const MonthlyCalendar = ({ currentDate, localStorageData, getUserPosts }) => {
  const [calendarDays, setCalendarDays] = useState([]);
  const [currentMonth, setCurrentMonth] = useState(dayjs(currentDate));
  const [isOpen, setIsOpen] = useState(false);
  const [selectedInterview, setSelectedInterview] = useState(null);

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
    const dataSource =
      Array.isArray(localStorageData) && localStorageData.length > 0
        ? localStorageData
        : interviewData;

    return dataSource?.filter((interview) => {
      const interviewStart = dayjs(interview.start);
      const interviewEnd = dayjs(interview.end);
      const currentDay = currentMonth.date(day);

      // Check if current day is between start and end (inclusive)
      return currentDay.isBetween(interviewStart, interviewEnd, "day", "[]");
    });
  };

  const handleDelete = (id) => {
    const updatedData = localStorageData?.map((item) =>
      item.id === id ? { ...item, is_deleted: true } : item
    );

    // Save the updated data back to localStorage
    localStorage.setItem("posts", JSON.stringify(updatedData));
    getUserPosts();
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
                                    onClick={(e) => {
                                      e.preventDefault();
                                      e.stopPropagation();
                                      handleDelete(interview.id);
                                    }}
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
                        {interview?.job_id?.jobRequest_Title}
                      </div>
                      <div className="text-[12px] text-gray-600 mb-1">
                        Interviewer:{" "}
                        {interview?.user_det?.[0]?.handled_by?.firstName}
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
