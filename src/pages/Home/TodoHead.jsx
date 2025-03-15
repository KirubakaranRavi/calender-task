import React, { useState } from "react";
import { AiOutlinePlus } from "react-icons/ai";
import { useFormik } from "formik";
import * as Yup from "yup";

const Header = () => {
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

  const formik = useFormik({
    initialValues: {
      firstName: "",
      position: "",
      createdBy: "",
      interviewDate: "",
      interviewTime: "",
      interviewVia: "Google Meet",
      link: "",
    },
    validationSchema: Yup.object({
      firstName: Yup.string().required("First name is required"),
      position: Yup.string().required("Position is required"),
      interviewDate: Yup.string().required("Interview date is required"),
      interviewTime: Yup.string().required("Interview time is required"),
      link: Yup.string().required("Link is required"),
    }),
    onSubmit: (values) => {
      localStorage.setItem("interviewData", JSON.stringify(values));
      alert("Data saved successfully!");
      toggleModal();
    },
  });

  return (
    <>
      <div className="flex justify-between items-center w-full px-5 mb-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-lg shadow-lg py-3 hover:shadow-xl transition-shadow duration-300">
        <p className="mb-0 text-lg font-semibold">Kiruba's Todo List</p>
        <button
          onClick={toggleModal}
          className="bg-white text-indigo-600 px-4 py-2 rounded-lg shadow relative overflow-hidden flex items-center gap-2 group"
        >
          <span className="absolute inset-0 bg-indigo-600 scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-500 ease-out"></span>
          <span className="relative flex items-center gap-2 group-hover:text-white">
            <AiOutlinePlus className="text-xl" /> Create Schedule
          </span>
        </button>
      </div>

      {showModal && (
        <div
          className={`fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50 transition-opacity duration-300 ease-in-out ${
            isOpen ? "opacity-100" : "opacity-0"
          }`}
        >
          <div
            className={`bg-white rounded-lg p-6 w-full max-w-md h-[80vh] shadow-xl transform transition-transform duration-300 ease-in-out ${
              isOpen ? "scale-100" : "scale-95"
            }`}
          >
            <h2 className="text-xl font-semibold mb-4">
              Create a New Schedule
            </h2>
            <form
              onSubmit={formik.handleSubmit}
              className="flex flex-col"
            >
              <div className="h-[65vh] overflow-y-auto flex-grow">
                {[
                  { label: "First Name", name: "firstName", required: true },
                  { label: "Position", name: "position", required: true },
                  { label: "Created By", name: "createdBy", required: false },
                  {
                    label: "Interview Date",
                    name: "interviewDate",
                    required: true,
                    type: "date",
                  },
                  {
                    label: "Interview Time",
                    name: "interviewTime",
                    required: true,
                    type: "time",
                  },
                  { label: "Link", name: "link", required: true },
                ].map(({ label, name, required, type = "text" }) => (
                  <div key={name} className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {label}{" "}
                      {required && <span className="text-red-500">*</span>}
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

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Interview Via
                  </label>
                  <select
                    name="interviewVia"
                    value={formik.values.interviewVia}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600"
                  >
                    <option value="Google Meet">Google Meet</option>
                    <option value="Zoom">Zoom</option>
                  </select>
                </div>

                <div className="flex justify-end gap-4 sticky bottom-0 bg-white py-4">
                  <button
                    type="button"
                    onClick={toggleModal}
                    className="px-4 py-2 text-gray-600 bg-gray-200 rounded-lg hover:bg-gray-300"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 text-white bg-indigo-600 rounded-lg hover:bg-indigo-700"
                  >
                    Save
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default Header;
