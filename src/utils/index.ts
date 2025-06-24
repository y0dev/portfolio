export function formatDate(date: string | number): string {
  if (!date) return "";

  const parsedDate = typeof date === "number" ? new Date(date) : new Date(Date.parse(date));
  
  if (isNaN(parsedDate.getTime())) return String(date); // fallback if invalid

  return parsedDate.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}
