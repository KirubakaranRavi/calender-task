import React, { useState, useEffect } from "react";
import { RiEdit2Fill } from "react-icons/ri";
import { MdOutlineDeleteOutline } from "react-icons/md";
import dayjs from "dayjs";
import { Popover } from "./Popover";
import { formatDateTime } from "../../utlis/dateFormat";
import InterviewModal from "./DetailModal";
import { interviewData } from "./data";

const WeeklySchedule = ({ currentDate, localStorageData, getUserPosts }) => {
  const [timeSlots, setTimeSlots] = useState([]);
  const [weekDays, setWeekDays] = useState([]);
  const [dates, setDates] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedInterview, setSelectedInterview] = useState(null);

  const startOfWeek = currentDate.startOf("week").add(1, "day");

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

  const isInterviewInSlot = (dayIndex, time) => {
    const day = startOfWeek.clone().add(dayIndex, "day").format("YYYY-MM-DD");
    const slotTime = parseTime(day, time);

    const dataSource =
      Array.isArray(localStorageData) && localStorageData?.length > 0
        ? localStorageData
        : interviewData;

    return dataSource?.filter(({ start, end }) => {
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

  const handleDelete = (id) => {
    // Retrieve the existing data from localStorage

    // Update the 'is_deleted' property for the matching item
    const updatedData = localStorageData?.map((item) =>
      item.id === id ? { ...item, is_deleted: true } : item
    );

    // Save the updated data back to localStorage
    localStorage.setItem("posts", JSON.stringify(updatedData));
    getUserPosts();
  };

  const getFillPercentage = (start, end) => {
    const startTime = dayjs(start);
    const endTime = dayjs(end);

    // Ensure valid times
    if (!startTime.isValid() || !endTime.isValid()) return 0;

    // Calculate the duration in minutes
    const durationMinutes = endTime.diff(startTime, "minute");

    // Ensure the fill percentage does not exceed 100%
    const fillPercentage = Math.min((durationMinutes / 60) * 100, 100);

    return fillPercentage;
  };

  const calculateBackgroundFill = (start, end) => {
    return getFillPercentage(start, end);
  };

  return (
    <div className="p-4">
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
      <ul className="overflow-hidden h-[400px] overflow-y-auto p-0">
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
                {isInterviewInSlot(dayIndex, time).map((interview) =>
                  interview?.user_det?.length > 1 ? (
                    <Popover
                      key={interview.id}
                      height={`${calculateBackgroundFill(
                        interview?.start,
                        interview?.end
                      )}%`}
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
                      <div
                        className="w-55 ps-3 py-1 pe-2 border shadow-md bg-white rounded-lg relative cursor-pointer text-start"
                        style={{
                          height: "100%",
                          fontSize:
                            calculateBackgroundFill(
                              interview?.start,
                              interview?.end
                            ) > 90
                              ? "12px"
                              : calculateBackgroundFill(
                                  interview?.start,
                                  interview?.end
                                ) < 35
                              ? "8px"
                              : "10px",
                          lineHeight:
                            calculateBackgroundFill(
                              interview?.start,
                              interview?.end
                            ) > 90
                              ? "20px"
                              : calculateBackgroundFill(
                                  interview?.start,
                                  interview?.end
                                ) < 35
                              ? "10px"
                              : calculateBackgroundFill(
                                  interview?.start,
                                  interview?.end
                                ) > 80
                              ? "20px"
                              : "15px",
                          display: "flex",
                          flexDirection: "column",
                          justifyContent: "center",
                          alignItems: "start",
                        }}
                      >
                        <div className="z-10 absolute left-0 top-0 h-full w-[10px] bg-blue-500" />
                        {interview?.user_det?.length > 0 && (
                          <div className="absolute -top-2 -right-1 h-5 w-5 rounded-full bg-[#FFA500] flex items-center justify-center text-black text-[10px] font-semibold">
                            {interview?.user_det?.length}
                          </div>
                        )}
                        <div className="relative z-10 font-semibold mb-0">
                          {interview?.job_id?.jobRequest_Title}
                        </div>
                        <div className="relative z-10 text-gray-600 mb-0">
                          Interviewer:{" "}
                          {interview?.user_det?.[0]?.handled_by?.firstName}
                        </div>
                        <div className="relative z-10 text-gray-600 mb-0">
                          Time: {dayjs(interview.start).format("hh:mm A")} -{" "}
                          {dayjs(interview.end).format("hh:mm A")}
                        </div>
                      </div>
                    </Popover>
                  ) : (
                    <div
                      className="w-55 ps-3 py-1 pe-2 border shadow-md bg-white rounded-lg relative cursor-pointer text-start"
                      onClick={() => {
                        const { formattedDate, startTime, endTime } =
                          formatDateTime(interview?.start, interview?.end);

                        let props_data = {
                          detail: interview?.user_det?.[0],
                          date: formattedDate,
                          startTime: startTime,
                          endTime: endTime,
                          link: interview?.link,
                        };
                        setSelectedInterview(props_data);
                        setIsOpen(true);
                      }}
                      style={{
                        height: `${calculateBackgroundFill(
                          interview?.start,
                          interview?.end
                        )}%`,
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "center",
                        alignItems: "start",
                        fontSize:
                          calculateBackgroundFill(
                            interview?.start,
                            interview?.end
                          ) > 90
                            ? "12px"
                            : calculateBackgroundFill(
                                interview?.start,
                                interview?.end
                              ) < 35
                            ? "8px"
                            : "10px",
                        lineHeight:
                          calculateBackgroundFill(
                            interview?.start,
                            interview?.end
                          ) > 90
                            ? "20px"
                            : calculateBackgroundFill(
                                interview?.start,
                                interview?.end
                              ) < 35
                            ? "10px"
                            : calculateBackgroundFill(
                                interview?.start,
                                interview?.end
                              ) > 80
                            ? "20px"
                            : "15px",
                      }}
                    >
                      <div className="absolute z-10 left-0 top-0 h-full w-[10px] bg-blue-500" />
                      <div className="font-semibold mb-">
                        {interview?.job_id?.jobRequest_Title}
                      </div>
                      <div className="text-gray-600 mb-0">
                        Interviewer:{" "}
                        {interview?.user_det?.[0]?.handled_by?.firstName}
                      </div>
                      <div className="text-gray-600 mb-0">
                        Time: {dayjs(interview.start).format("hh:mm A")} -{" "}
                        {dayjs(interview.end).format("hh:mm A")}
                      </div>
                    </div>
                  )
                )}
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
