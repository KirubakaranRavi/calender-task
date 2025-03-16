import React, { useEffect, useState } from "react";
import { FaAngleRight, FaAngleLeft } from "react-icons/fa6";
import dayjs from "dayjs";
import { motion, AnimatePresence } from "framer-motion";
import Header from "./TodoHead";
import DailySchedule from "./DailySchedule";
import WeeklySchedule from "./WeeklySchedule";
import MonthlyCalendar from "./Monthly";
import YearlyCalendar from "./Yearly";
import { interviewData } from "./data";

const Index = () => {
  const [selectedView, setSelectedView] = useState("Day");
  const [currentDate, setCurrentDate] = useState(dayjs());
  const [direction, setDirection] = useState(1); // 1 for right, -1 for left
  const [localStorageData, setLocalStorageData] = useState({});

  // Function to get the date suffix
  const getDateSuffix = (day) => {
    day = Number(day); // Ensure it's a number
    if (day >= 11 && day <= 13) return "th";
    switch (day % 10) {
      case 1:
        return "st";
      case 2:
        return "nd";
      case 3:
        return "rd";
      default:
        return "th";
    }
  };

  // Function to handle left navigation
  const handlePrevious = () => {
    if (selectedView === "Day") {
      setDirection(-1);
      setCurrentDate((prev) => prev.subtract(1, "day"));
    } else if (selectedView === "Week") {
      setDirection(-1);
      setCurrentDate((prev) => prev.subtract(7, "day"));
    } else if (selectedView === "Month") {
      setDirection(-1);
      setCurrentDate((prev) => prev.subtract(1, "month"));
    } else if (selectedView === "Year") {
      setDirection(-1);
      setCurrentDate((prev) => prev.subtract(1, "year"));
    }
  };

  // Function to handle right navigation
  const handleNext = () => {
    if (selectedView === "Day") {
      setDirection(1);
      setCurrentDate((prev) => prev.add(1, "day"));
    } else if (selectedView === "Week") {
      setDirection(1);
      setCurrentDate((prev) => prev.add(7, "day"));
    } else if (selectedView === "Month") {
      setDirection(1);
      setCurrentDate((prev) => prev.add(1, "month"));
    } else if (selectedView === "Year") {
      setDirection(1);
      setCurrentDate((prev) => prev.add(1, "year"));
    }
  };

  // Function to format the date based on the selected view
  const getFormattedDate = () => {
    if (selectedView === "Day") {
      return currentDate.format("DD");
    } else if (selectedView === "Week") {
      const startOfWeek = currentDate.startOf("week").add(1, "day");
      const endOfWeek = currentDate.endOf("week").add(1, "day");
      return (
        <>
          {startOfWeek.format("DD")}
          <sup>{getDateSuffix(startOfWeek.date())}</sup>{" "}
          {startOfWeek.format("MMMM")} to {endOfWeek.format("DD")}
          <sup>{getDateSuffix(endOfWeek.date())}</sup>{" "}
          {endOfWeek.format("MMMM, YYYY")}
        </>
      );
    } else if (selectedView === "Month") {
      return currentDate.format("MMMM, YYYY");
    } else if (selectedView === "Year") {
      return currentDate.format("YYYY");
    }
    return "";
  };

  const getUserPosts = () => {
    const posts = JSON.parse(localStorage.getItem("posts")) || [];
    const userPosts = posts.filter((post) => post.is_deleted === false);
    console.log("User Posts:", userPosts);
    setLocalStorageData([...interviewData, ...userPosts]);
  };

  useEffect(() => {
    getUserPosts();
  }, []);

  console.log(localStorageData, "localStorageData");

  return (
    <>
      <div>
        <Header getUserPosts={getUserPosts} />
      </div>
      <div className="flex justify-between items-center w-full px-5">
        {/* Left Navigation */}
        <div className="flex items-center space-x-3">
          <motion.div
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            className="group cursor-pointer border border-blue-300 rounded-lg p-2 shadow-sm bg-white transition-all"
            onClick={handlePrevious}
          >
            <FaAngleLeft
              size={20}
              className="text-gray-500 transition-colors group-hover:text-black"
            />
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            className="group cursor-pointer border border-blue-300 rounded-lg p-2 shadow-sm bg-white transition-all"
            onClick={handleNext}
          >
            <FaAngleRight
              size={20}
              className="text-gray-500 transition-colors group-hover:text-black"
            />
          </motion.div>
        </div>

        {/* Center Date Display */}
        <div className="text-lg font-semibold relative w-[400px] flex justify-center items-center">
          <div className="flex items-center">
            <AnimatePresence mode="wait">
              {selectedView === "Day" ? (
                <motion.span
                  key={currentDate.format("YYYY-MM-DD")}
                  initial={{ opacity: 0, y: -direction * 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: direction * 15 }}
                  transition={{ duration: 0.3 }}
                  className="absolute"
                >
                  {getFormattedDate()}
                </motion.span>
              ) : (
                <span key={currentDate.format("YYYY-MM")}>
                  {getFormattedDate()}
                </span>
              )}
            </AnimatePresence>
            {selectedView === "Day" ? (
              <span className="ml-6">{currentDate.format("MMMM, YYYY")}</span>
            ) : null}
          </div>
        </div>

        {/* View Options */}
        <div className="flex items-center space-x-6">
          {["Day", "Week", "Month", "Year"].map((view) => (
            <motion.div
              key={view}
              className="relative cursor-pointer"
              onClick={() => setSelectedView(view)}
            >
              <p
                className={`transition-colors ${
                  selectedView === view
                    ? "text-blue-500 font-bold"
                    : "text-gray-700"
                }`}
              >
                {view}
              </p>

              {selectedView === view && (
                <motion.div
                  layoutId="underline"
                  className="absolute left-0 bottom-0 h-[2px] bg-blue-500"
                  initial={{ width: 0 }}
                  animate={{ width: "100%" }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                />
              )}
            </motion.div>
          ))}
        </div>
      </div>
      {selectedView === "Day" && (
        <DailySchedule
          currentDate={currentDate}
          localStorageData={localStorageData}
          getUserPosts={getUserPosts}
        />
      )}
      {selectedView === "Week" && (
        <WeeklySchedule
          currentDate={currentDate}
          localStorageData={localStorageData}
          getUserPosts={getUserPosts}
        />
      )}
      {selectedView === "Month" && (
        <MonthlyCalendar
          currentDate={currentDate}
          localStorageData={localStorageData}
          getUserPosts={getUserPosts}
        />
      )}
      {selectedView === "Year" && (
        <YearlyCalendar
          currentDate={currentDate}
          localStorageData={localStorageData}
        />
      )}
    </>
  );
};

export default Index;
