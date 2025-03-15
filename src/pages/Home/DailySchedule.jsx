import React, { useState, useEffect } from "react";

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
      title: "React Developer",
      interviewer: "Kiruba",
      time: "06:00 PM - 07:00 PM",
    },
    {
      id: 2,
      title: "Node.js Engineer",
      interviewer: "Ravi",
      time: "09:00 AM - 10:30 AM",
    },
    {
      id: 3,
      title: "Midnight Interview",
      interviewer: "Siva",
      time: "11:30 PM - 12:30 AM",
    },
    {
      id: 4,
      title: "Short Slot",
      interviewer: "Mani",
      time: "02:00 PM - 02:15 PM",
    },
    {
      id: 5,
      title: "Back-to-Back",
      interviewer: "Anu",
      time: "03:00 PM - 04:00 PM",
    },
    {
      id: 6,
      title: "Overlap Session 1",
      interviewer: "Karthik",
      time: "06:00 PM - 07:00 PM",
    },
    {
      id: 7,
      title: "Overlap Session 2",
      interviewer: "Deepa",
      time: "06:30 PM - 07:30 PM",
    },
    {
      id: 8,
      title: "Overlap Session 3",
      interviewer: "Deesspa",
      time: "11:30 PM - 11:50 PM",
    },
  ];

  const [showPopups, setShowPopups] = useState({});

  const parseTime = (time) => {
    const [hourMinute, period] = time.split(" ");
    let [hour, minute] = hourMinute.split(":").map(Number);
    if (period === "PM" && hour !== 12) hour += 12;
    if (period === "AM" && hour === 12) hour = 0;
    return hour + minute / 60;
  };

  const getInterviewsForSlot = (time) => {
    const currentHour = parseTime(time);

    return interviewData.filter(({ time }) => {
      const [startTime, endTime] = time.split(" - ");
      const startHour = parseTime(startTime);
      const endHour = parseTime(endTime);

      if (endHour < startHour) {
        return currentHour >= startHour || currentHour < endHour;
      }

      return currentHour >= startHour && currentHour < endHour;
    });
  };

  const togglePopup = (id) => {
    setShowPopups((prev) => {
      const newPopups = Object.keys(prev).reduce((acc, key) => {
        acc[key] = false;
        return acc;
      }, {});
      return { ...newPopups, [id]: !prev[id] };
    });
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest(".popup-container")) {
        setShowPopups({});
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
                  onClick={() => togglePopup(interview.id)}
                >
                  <div className="pe-2 ps-6 py-1 border shadow-lg bg-white relative cursor-pointer">
                    <div className="absolute left-0 top-0 h-full w-[10px] bg-blue-500" />
                    <div className="absolute -top-2 -right-2 h-6 w-6 rounded-full bg-[#FFA500] flex items-center justify-center text-black text-[12px] font-semibold">
                      {interview.id}
                    </div>

                    <h3 className="text-[14px] font-semibold mb-2">
                      {interview.title}
                    </h3>
                    <p className="text-gray-600 text-[12px] mb-1">
                      Interviewer: {interview.interviewer}
                    </p>
                    <p className="text-gray-600 text-[12px] mb-1">
                      Time: {interview.time}
                    </p>
                  </div>

                  {showPopups[interview.id] && (
                    <div
                      className={`absolute left-full ${
                        idx === 0 ? "top-0" : "top-1/2"
                      } transform -translate-y-${
                        idx === 0 ? "0" : "1/2"
                      } space-y-2 z-50`}
                    >
                      <div className="w-48 p-3 border shadow-md bg-white rounded-lg">
                        <h4 className="text-sm font-semibold mb-1">
                          Candidate Info
                        </h4>
                        <p className="text-xs text-gray-600">
                          John Doe - React Dev
                        </p>
                      </div>
                      <div className="w-48 p-3 border shadow-md bg-white rounded-lg">
                        <h4 className="text-sm font-semibold mb-1">
                          Interview Status
                        </h4>
                        <p className="text-xs text-gray-600">Scheduled</p>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default DailySchedule;