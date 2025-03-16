import React, { useState, useEffect } from "react";
import { RiEdit2Fill, RiEyeFill } from "react-icons/ri";
import { MdOutlineDeleteOutline, MdClose } from "react-icons/md";
import { FaVideo } from "react-icons/fa";
import { FiDownload } from "react-icons/fi";
import InterviewModal from "./DetailModal";
import { formatDateTime } from "../../utlis/dateFormat";
import { Popover } from "./Popover";
import dayjs from "dayjs";

const DailySchedule = () => {
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
            candidate_firstName: "Mohan",
            candidate_lastName: "Raj",
          },
          handled_by: {
            firstName: "Vinodhini",
          },
          job_id: {
            jobRequest_Title: "Django Developer",
          },
        },
        {
          id: 2,
          candidate: {
            candidate_firstName: "Test",
            candidate_lastName: "Here",
          },
          handled_by: {
            firstName: "Kiruba",
          },
          job_id: {
            jobRequest_Title: "Django Developer",
          },
        },
      ],
    },
  ];

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
    const currentHour = parseTime(time);

    return interviewData.filter(({ start, end }) => {
      const startTime = new Date(start);
      const endTime = new Date(end);

      const interviewStartHour =
        startTime.getHours() + startTime.getMinutes() / 60;
      const interviewEndHour = endTime.getHours() + endTime.getMinutes() / 60;

      if (interviewEndHour < interviewStartHour) {
        return (
          currentHour >= interviewStartHour || currentHour < interviewEndHour
        );
      }

      return (
        currentHour >= interviewStartHour && currentHour < interviewEndHour
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
                  className="ms-6 relative popup-container"
                  // onClick={() => togglePopup(interview.id)}
                >
                  <Popover
                    key={interview.id}
                    position="right"
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

            <div className="flex border-[1.5px] border-grey-500 m-2">
              {/* Left Section */}
              <div className="w-1/2 p-4 border-r border-gray-300">
                <p className="text-sm mb-2">
                  <strong>Interview With:</strong> Kiruba
                </p>
                <p className="text-sm mb-2">
                  <strong>Position:</strong> React Developer
                </p>
                <p className="text-sm mb-2">
                  <strong>Created By:</strong> -
                </p>
                <p className="text-sm mb-2">
                  <strong>Interview Date:</strong> 29 Aug 2025
                </p>
                <p className="text-sm mb-2">
                  <strong>Interview Time:</strong> 10:00 AM
                </p>
                <p className="text-sm mb-4">
                  <strong>Interview Via:</strong> Google Meet
                </p>

                {/* Resume Section */}
                <div className="border-[1.5px] border-blue-500 p-3 mb-3 rounded-md flex items-center justify-between">
                  <span className="text-sm text-blue-500">Resume.docx</span>
                  <div className="flex gap-3">
                    <RiEyeFill
                      size={20}
                      className="text-blue-500 cursor-pointer"
                    />
                    <FiDownload
                      size={20}
                      className="text-blue-500 cursor-pointer"
                    />
                  </div>
                </div>

                {/* Aadhar Section */}
                <div className="border-[1.5px] border-blue-500 p-3 rounded-md flex items-center justify-between">
                  <span className="text-sm text-blue-500">Aadhar Card</span>
                  <div className="flex gap-3">
                    <RiEyeFill
                      size={20}
                      className="text-blue-500 cursor-pointer"
                    />
                    <FiDownload
                      size={20}
                      className="text-blue-500 cursor-pointer"
                    />
                  </div>
                </div>
              </div>

              {/* Right Section */}
              <div className="w-1/2 p-4 flex flex-col items-center justify-center">
                <div className="border border-grey-500 rounded-md p-3 mb-6">
                  <FaVideo size={80} className="text-blue-500" />
                </div>
                <button className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition">
                  Join
                </button>
              </div>
            </div>
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
