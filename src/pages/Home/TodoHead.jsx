import React, { useState } from "react";
import { AiOutlinePlus } from "react-icons/ai";
import { useFormik } from "formik";
import * as Yup from "yup";

const Header = ({ getUserPosts }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const toggleModal = () => {
    if (isOpen) {
      setIsOpen(false);
      setTimeout(() => setShowModal(false), 300);
    } else {
      setShowModal(true);
      setTimeout(() => setIsOpen(true), 10);
    }
  };

  // Create a new post
  const createPost = async (values) => {
    const payload = {
      id: Date.now(),
      summary: values.summary || "Round Summary",
      desc: values.desc || "Round Description",
      start: values.start,
      end: values.end,
      attendees: values.attendees || null,
      status: values.status || null,
      comment: values.comment || "",
      score: {
        P: values.score || 0,
      },
      link: values.link,
      is_deleted: false,
      user_det: [
        {
          id: values.userId || 1,
          question_score: values.questionScore || null,
          status: values.userStatus || null,
          candidate: {
            id: values.candidateId || 1,
            candidate_firstName: values.firstName,
            candidate_lastName: values.lastName || "",
            candidateGender: values.candidateGender || "",
            candidateComment: values.candidateComment || "",
            candidate_email: values.candidateEmail || "",
          },
          handled_by: {
            id: values.handlerId || 3,
            last_login: values.handlerLastLogin || null,
            userEmail: values.handlerEmail || "",
            username: values.handlerUsername || "",
            firstName: values.handlerFirstName || "",
            lastName: values.handlerLastName || "",
            userRole: values.handlerRole || "",
          },
          job_id: {
            id: values.jobId || 11,
            jobRequest_Title: values.position,
            jobRequest_Role: values.jobRole || "",
            jobRequest_KeySkills: values.jobSkills || "",
            jobRequest_Description: values.jobDescription || "",
          },
        },
      ],
      job_id: {
        id: values.jobId || 11,
        jobRequest_Title: values.position,
        jobRequest_Role: values.jobRole || "",
        jobRequest_KeySkills: values.jobSkills || "",
        jobRequest_Description: values.jobDescription || "",
      },
    };

    // Store in localStorage
    const existingPosts = JSON.parse(localStorage.getItem("posts")) || [];
    existingPosts.push(payload);
    localStorage.setItem("posts", JSON.stringify(existingPosts));

    toggleModal();
    formik.handleReset();
    getUserPosts();
  };

  // Convert local datetime to ISO 8601 format with timezone (preserve local time)
  const toISOWithTimezone = (localDateTime) => {
    const date = new Date(localDateTime);

    // Extract date and time components
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");

    return `${year}-${month}-${day}T${hours}:${minutes}${getTimeZoneOffset()}`;
  };

  // Helper to get timezone offset in "+05:30" format
  const getTimeZoneOffset = () => {
    const offset = -new Date().getTimezoneOffset();
    const hours = String(Math.floor(Math.abs(offset) / 60)).padStart(2, "0");
    const minutes = String(Math.abs(offset) % 60).padStart(2, "0");
    return offset >= 0 ? `+${hours}:${minutes}` : `-${hours}:${minutes}`;
  };

  // Formik configuration
  const formik = useFormik({
    initialValues: {
      firstName: "",
      lastName: "",
      candidateGender: "",
      candidateEmail: "",
      candidateComment: "",
      position: "",
      jobRole: "",
      jobSkills: "",
      jobDescription: "",
      start: "",
      end: "",
      link: "",
      summary: "",
      desc: "",
      attendees: "",
      status: "",
      comment: "",
      score: "",
      userId: "",
      questionScore: "",
      userStatus: "",
      handlerId: "",
      handlerLastLogin: "",
      handlerEmail: "",
      handlerUsername: "",
      handlerFirstName: "",
      handlerLastName: "",
      handlerRole: "",
      jobId: "",
    },
    validationSchema: Yup.object({
      firstName: Yup.string().required("First name is required"),
      position: Yup.string().required("Position is required"),
      start: Yup.string().required("Start date and time is required"),
      end: Yup.string().required("End date and time is required"),
      link: Yup.string().required("Link is required"),
    }),
    onSubmit: (values) => {
      const payload = {
        ...values,
        start: toISOWithTimezone(values.start),
        end: toISOWithTimezone(values.end, values.start),
      };
      console.log("Form values:", payload);
      createPost(payload);
    },
  });

  return (
    <>
      <div className="flex justify-between items-center w-full px-5 my-3">
        <p className="mb-0 text-lg font-semibold">Kiruba's Todo List</p>
        <button
          onClick={toggleModal}
          className="bg-white text-indigo-600 px-4 py-2 rounded-lg shadow flex items-center gap-2 group transition-transform duration-300 hover:scale-105"
        >
          <AiOutlinePlus className="text-xl" /> Create Schedule
        </button>
      </div>

      {showModal && (
        <div
          className={`fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50 transition-opacity duration-300 ${
            isOpen ? "opacity-100" : "opacity-0"
          }`}
        >
          <div
            className={`bg-white rounded-lg p-6 w-full max-w-md h-[80vh] shadow-xl transform transition-transform duration-300 ${
              isOpen ? "scale-100" : "scale-95"
            }`}
          >
            <h2 className="text-xl font-semibold mb-4">
              Create a New Schedule
            </h2>
            <form onSubmit={formik.handleSubmit} className="flex flex-col">
              <div className="h-[55vh] overflow-y-auto flex-grow px-2">
                {[
                  { label: "First Name", name: "firstName" },
                  { label: "Last Name", name: "lastName" },
                  { label: "Candidate Gender", name: "candidateGender" },
                  { label: "Candidate Email", name: "candidateEmail" },
                  { label: "Candidate Comment", name: "candidateComment" },
                  { label: "Position", name: "position" },
                  { label: "Job Role", name: "jobRole" },
                  { label: "Job Skill", name: "jobSkills" },
                  { label: "Job Description", name: "jobDescription" },
                  {
                    label: "Start (Date & Time)",
                    name: "start",
                    type: "datetime-local",
                  },
                  {
                    label: "End (Date & Time)",
                    name: "end",
                    type: "datetime-local",
                  },
                  { label: "Link", name: "link" },
                  { label: "Summary", name: "summary" },
                  { label: "Description", name: "desc" },
                  { label: "Handler Email", name: "handlerEmail" },
                  { label: "Handler Username", name: "handlerUsername" },
                  { label: "Handler FirstName", name: "handlerFirstName" },
                  { label: "Handler LastName", name: "handlerLastName" },
                  { label: "Handler Role", name: "handlerRole" },
                ].map(({ label, name, type = "text" }) => (
                  <div key={name} className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {label}
                    </label>
                    <input
                      type={type}
                      name={name}
                      value={formik.values[name]}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600"
                    />
                    {formik.touched[name] && formik.errors[name] && (
                      <p className="text-red-500 text-sm mt-1">
                        {formik.errors[name]}
                      </p>
                    )}
                  </div>
                ))}
              </div>

              <div className="flex justify-end gap-4 sticky bottom-0 bg-white py-4">
                <button
                  type="button"
                  onClick={toggleModal}
                  className="px-4 py-2 text-gray-600 bg-gray-200 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-white bg-indigo-600 rounded-lg"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default Header;
