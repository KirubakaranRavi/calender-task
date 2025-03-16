export const formatDateTime = (start, end) => {
  const startDate = start ? new Date(start) : null;
  const endDate = end ? new Date(end) : null;

  // Format Date: 15 Mar 2025
  const formattedDate = startDate?.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

  // Format Time: 06 PM - 07 PM
  const formatTime = (date) =>
    date?.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });

  const startTime = formatTime(startDate);
  const endTime = formatTime(endDate);

  return { formattedDate, startTime, endTime };
};
