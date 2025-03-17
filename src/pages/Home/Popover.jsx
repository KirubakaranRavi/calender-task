import { useState, useRef, useEffect } from "react";

export const Popover = ({
  children,
  content,
  position: propPosition = "left",
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [position, setPosition] = useState(propPosition);
  const popoverRef = useRef(null);
  const buttonRef = useRef(null);

  const togglePopover = () => {
    if (!isOpen && !propPosition) checkPosition(); // Only check position if no prop is provided
    setIsOpen((prev) => !prev);
  };

  // Close popover on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        popoverRef.current &&
        !popoverRef.current.contains(e.target) &&
        buttonRef.current &&
        !buttonRef.current.contains(e.target)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Check space and adjust position if prop is not provided
  const checkPosition = () => {
    if (buttonRef.current) {
      const buttonRect = buttonRef.current.getBoundingClientRect();
      const spaceOnLeft = buttonRect.left;
      const spaceOnRight = window.innerWidth - buttonRect.right;

      setPosition(spaceOnLeft < 200 ? "right" : "left");
    }
  };

  return (
    <div className="relative" ref={popoverRef}>
      <button ref={buttonRef} onClick={togglePopover}>
        {children}
      </button>

      <div
        className={`absolute top-1/2 -translate-y-1/2 ${
          position === "left" ? "right-full mr-2" : "left-full ml-2"
        } min-w-[300px] max-w-auto z-50 ${
          isOpen ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
        style={{
          transition: "opacity 0.3s ease, visibility 0.3s ease",
        }}
      >
        {content}
      </div>
    </div>
  );
};
