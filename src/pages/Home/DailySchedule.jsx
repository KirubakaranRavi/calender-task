import React, { useState, useEffect } from "react";
import { RiEdit2Fill, RiEyeFill } from "react-icons/ri";
import { MdOutlineDeleteOutline, MdClose } from "react-icons/md";
import { FaVideo } from "react-icons/fa";
import { FiDownload } from "react-icons/fi";
import InterviewModal from "./DetailModal";
import { formatDateTime } from "../../utlis/dateFormat";
import { Popover } from "./Popover";
import dayjs from "dayjs";
import { interviewData } from "./data";

const DailySchedule = ({ currentDate, localStorageData }) => {
  const [timeSlots, setTimeSlots] = useState([]);

  useEffect(() => {
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

    generateTimeSlots();
  }, []);

  const [showPopups, setShowPopups] = useState({});
  const [selectedInterview, setSelectedInterview] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const openModal = () => setShowModal(true);
  const closeModal = () => setShowModal(false);

  const parseTime = (time) => {
    const [hourMinute, period] = time.split(" ");
    let [hour, minute] = hourMinute.split(":").map(Number);
    if (period === "PM" && hour !== 12) hour += 12;
    if (period === "AM" && hour === 12) hour = 0;
    return hour + minute / 60;
  };

  const getInterviewsForSlot = (time) => {
    const currentDateFormatted = dayjs(currentDate).format("YYYY-MM-DD");

    // Parse slot time (e.g., "08:00 AM" → 8)
    const currentHour = parseTime(time);

    const dataSource =
      Array.isArray(localStorageData) && localStorageData?.length > 0
        ? localStorageData
        : interviewData;

    return dataSource?.filter(({ start, end }) => {
      const startTime = dayjs(start);
      const endTime = dayjs(end);

      const interviewStartDate = startTime.format("YYYY-MM-DD");
      const interviewEndDate = endTime.format("YYYY-MM-DD");

      console.log(
        currentHour,
        startTime.hour(),
        endTime.hour(),
        interviewStartDate,
        currentDateFormatted,
        interviewEndDate,
        currentHour == startTime.hour() && currentHour == endTime.hour(),
        "endTime.hour()"
      );

      // Ensure interviews are on the selected date and time range
      return (
        (interviewStartDate == currentDateFormatted ||
          interviewEndDate == currentDateFormatted) &&
        currentHour == startTime.hour() &&
        currentHour == endTime.hour()
      );
    });
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest(".popup-container")) {
        setShowPopups({});
        setSelectedInterview(null);
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

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
    <div className="overflow-hidden h-[600px] overflow-y-auto">
      <ul className="px-4">
        {timeSlots.map((time, index) => (
          <li key={index} className="flex border-t border-b h-24 relative">
            <div className="w-1/5 border-r flex justify-center items-end text-lg text-[blue]">
              {time}
            </div>

            <div className="w-4/5 h-full flex items-center border-r relative">
              {getInterviewsForSlot(time).map((interview, idx) => (
                <div
                  key={interview.id}
                  className="ms-6 relative popup-container h-full"
                >
                  {interview?.user_det?.length > 1 ? (
                    <Popover
                      key={interview.id}
                      position="right"
                      height={`${calculateBackgroundFill(
                        interview?.start,
                        interview?.end
                      )}%`}
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
                      <div
                        className="w-55 ps-3 py-1 pe-2 border shadow-md bg-white rounded-lg relative cursor-pointer text-start"
                        style={{
                          height: "100%",
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
                          Interviewer:
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
                      <div className="z-10 absolute left-0 top-0 h-full w-[10px] bg-blue-500" />
                      <div className="relative z-10 font-semibold mb-0">
                        {interview?.job_id?.jobRequest_Title}
                      </div>
                      <div className="relative z-10 text-gray-600 mb-0">
                        Interviewer:
                        {interview?.user_det?.[0]?.handled_by?.firstName}
                      </div>
                      <div className="relative z-10 text-gray-600 mb-0">
                        Time: {dayjs(interview.start).format("hh:mm A")} -{" "}
                        {dayjs(interview.end).format("hh:mm A")}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </li>
        ))}
      </ul>
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white w-[80%] max-w-xl rounded-lg shadow-lg relative p-2">
            {/* Close Icon - Half Inside, Half Outside */}
            <button
              onClick={closeModal}
              className="absolute -top-4 -right-4 text-2xl text-white hover:text-black bg-blue-500 rounded-full p-1 shadow-md"
            >
              <MdClose />
            </button>

            {/* Modal Content */}
          </div>
        </div>
      )}

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

export default DailySchedule;
