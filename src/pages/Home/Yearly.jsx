import React, { useState, useEffect } from "react";
import dayjs from "dayjs";
import { IoClose } from "react-icons/io5";
import { IoChevronDown } from "react-icons/io5";
import InterviewModal from "./DetailModal";
import { formatDateTime } from "../../utlis/dateFormat";

const interviewData = [
  {
    id: 1,
    summary: "1st Round",
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
      {
        id: 2,
        candidate: {
          candidate_firstName: "Juni",
          candidate_lastName: "Kin",
        },
        handled_by: {
          firstName: "Prin",
        },
        job_id: {
          jobRequest_Title: "Next Developer",
        },
      },
    ],
  },
  {
    id: 2,
    summary: "2nd Round",
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

const YearlyCalendar = ({ currentDate }) => {
  const [calendarMonths, setCalendarMonths] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [modalData, setModalData] = useState([]);
  const [expandedId, setExpandedId] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedInterview, setSelectedInterview] = useState(null);

  useEffect(() => {
    generateYearMonths();
  }, [currentDate, interviewData]);

  const generateYearMonths = () => {
    const currentYear = dayjs(currentDate).year();

    const interviewDates = interviewData.flatMap((interview) => {
      const startDate = dayjs(interview.start);
      const endDate = dayjs(interview.end);
      const dates = [];
      let current = startDate;
      while (current.isBefore(endDate) || current.isSame(endDate)) {
        dates.push({ date: current.format("YYYY-MM-DD"), interview });
        current = current.add(1, "day");
      }
      return dates;
    });

    const months = Array.from({ length: 12 }, (_, monthIndex) => {
      const startOfMonth = dayjs(`${currentYear}-${monthIndex + 1}-01`);
      const daysInMonth = startOfMonth.daysInMonth();
      const startDay = startOfMonth.day();

      const days = Array.from({ length: daysInMonth }, (_, i) => {
        const date = startOfMonth.add(i, "day").format("YYYY-MM-DD");
        return { day: i + 1, date };
      });

      const paddedDays = Array(startDay).fill(null).concat(days);

      while (paddedDays.length % 7 !== 0) {
        paddedDays.push(null);
      }

      return { month: startOfMonth.format("MMMM"), days: paddedDays };
    });

    setCalendarMonths(
      months.map((month) => ({
        ...month,
        days: month.days.map((day) => {
          const interview = interviewDates.find((d) => d.date === day?.date);
          return day && interview
            ? { ...day, isHighlighted: true, interview: interview.interview }
            : day;
        }),
      }))
    );
  };

  const handleDayClick = (day) => {
    if (day?.isHighlighted) {
      setSelectedDate(day.date);
      setModalData(
        interviewData.filter(({ start, end }) =>
          dayjs(day.date).isBetween(dayjs(start), dayjs(end), "day", "[]")
        )
      );
    }
  };

  const closeModal = () => {
    setSelectedDate(null);
    setModalData([]);
  };

  const toggleInterview = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const handleInterviewClick = (interviewId) => {
    const interviewDetails = interviewData.find(
      (interview) => interview.id === interviewId
    );
    // Store or log interview details as needed
    console.log("Clicked Interview Details:", interviewDetails);
  };

  const { formattedDate, startTime, endTime } = formatDateTime(
    modalData?.[0]?.start,
    modalData?.[0]?.end
  );

  console.log(modalData, "modalData");
  return (
    <div className="p-4">
      <div className="grid grid-cols-3 gap-8">
        {calendarMonths.map(({ month, days }, monthIndex) => (
          <div key={monthIndex} className="border p-4 rounded-lg shadow">
            <h3 className="text-xl font-semibold text-center mb-4 text-blue-600">
              {month}
            </h3>

            <div className="grid grid-cols-7 text-center font-medium mb-2">
              {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                <div key={day} className="p-1 text-gray-600">
                  {day}
                </div>
              ))}
            </div>

            <div className="grid grid-cols-7 gap-1">
              {days.map((day, index) => (
                <div
                  key={index}
                  onClick={() => handleDayClick(day)}
                  className={`flex items-center justify-center h-10 border rounded cursor-pointer ${
                    day?.isHighlighted ? "bg-blue-500 text-white" : ""
                  }`}
                >
                  {day?.day}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {selectedDate && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="relative bg-white p-6 rounded-lg shadow-lg w-1/4">
            <IoClose
              onClick={closeModal}
              cursor="pointer"
              color="white"
              className="absolute -top-4 -right-4 bg-blue-500 border border-gray-300 rounded-full w-8 h-8 flex items-center justify-center shadow-md"
            />
            {modalData?.[0]?.user_det?.map((interview) => (
              <div key={interview.id} className="mb-4">
                <div
                  onClick={() => toggleInterview(interview.id)}
                  className="flex justify-between items-center cursor-pointer"
                >
                  <p>{interview?.job_id?.jobRequest_Title}</p>
                  <IoChevronDown
                    className={`transition-transform duration-500 ${
                      expandedId === interview.id ? "rotate-180" : ""
                    }`}
                  />
                </div>
                <div
                  className={`overflow-hidden transition-max-height duration-500 ${
                    expandedId === interview.id ? "max-h-40" : "max-h-0"
                  }`}
                >
                  <p>{modalData?.[0]?.summary}</p>
                  <p>
                    <strong>Interview With:</strong>{" "}
                    {interview?.candidate?.candidate_firstName}
                  </p>
                  <p>
                    <strong>Interviewer:</strong>{" "}
                    {interview?.handled_by?.firstName}
                  </p>
                  <button
                    onClick={() => {
                      setSelectedInterview({
                        detail: interview,
                        date: formattedDate,
                        startTime: startTime,
                        endTime: endTime,
                        link: modalData?.[0]?.link,
                      });
                      setIsOpen(true);
                    }}
                    className="text-blue-500"
                  >
                    View Details
                  </button>
                </div>
              </div>
            ))}
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

export default YearlyCalendar;
