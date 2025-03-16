import { MdClose } from "react-icons/md";
import { RiEyeFill } from "react-icons/ri";
import { FiDownload } from "react-icons/fi";
import { FaVideo } from "react-icons/fa";
import React, { useEffect, useRef } from "react";

const InterviewModal = ({ isOpen, closeModal, interviewDetails = {} }) => {
  const modalRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      const previousFocus = document.activeElement;
      modalRef.current?.focus();
      return () => previousFocus?.focus();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const {
    detail = "-",
    date = "-",
    startTime = "-",
    endTime = "-",
    link = "-",
  } = interviewDetails;

  const [hour = "-"] = startTime?.split(" ")[0]?.split(":") ?? [];

  console.log(link, 'linksdass');
  

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div
        ref={modalRef}
        tabIndex="-1"
        className="bg-white w-[80%] max-w-xl rounded-lg shadow-lg relative p-2"
      >
        <button
          onClick={closeModal}
          aria-label="Close Modal"
          className="absolute -top-4 -right-4 text-2xl text-white hover:text-black bg-blue-500 rounded-full p-1 shadow-md"
        >
          <MdClose />
        </button>

        <div className="flex border-[1.5px] border-grey-500 m-2">
          <div className="w-1/2 p-4 border-r border-gray-300">
            <p className="text-sm mb-2">
              <strong>Interview With:</strong>{" "}
              {detail?.candidate?.candidate_firstName}
            </p>
            <p className="text-sm mb-2">
              <strong>Position:</strong> {detail?.job_id?.jobRequest_Title}
            </p>
            <p className="text-sm mb-2">
              <strong>Created By:</strong> {detail?.handled_by?.firstName}
            </p>
            <p className="text-sm mb-2">
              <strong>Interview Date:</strong> {date}
            </p>
            <p className="text-sm mb-2">
              {/* <strong>Interview Time:</strong> {startTime} - {endTime} */}
              <p className="text-sm mb-2">
                <strong>Interview Time:</strong> {hour} - {endTime}
              </p>
            </p>
            <p className="text-sm mb-4">
              <strong>Interview Via:</strong> Google Meet
            </p>
            {/* Resume Section */}
            <div className="border-[1.5px] border-blue-500 p-3 mb-3 rounded-md flex items-center justify-between">
              <span className="text-sm text-blue-500">Resume.docx</span>
              <div className="flex gap-3">
                <RiEyeFill size={20} className="text-blue-500 cursor-pointer" />
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
                <RiEyeFill size={20} className="text-blue-500 cursor-pointer" />
                <FiDownload
                  size={20}
                  className="text-blue-500 cursor-pointer"
                />
              </div>
            </div>
          </div>

          <div className="w-1/2 p-4 flex flex-col items-center justify-center">
            <div className="border border-grey-500 rounded-md p-3 mb-6">
              <FaVideo size={80} className="text-blue-500" />
            </div>
            <a
              href={link}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition no-underline"
            >
              Join
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InterviewModal;
