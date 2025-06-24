export function formatDate(date: string | number): string {
  if (!date) return "";

  let parsedDate: Date;

  if (typeof date === "string" && /^\d+$/.test(date)) {
    parsedDate = new Date(Number(date));
  } else if (typeof date === "number") {
    parsedDate = new Date(date);
  } else {
    parsedDate = new Date(Date.parse(date));
  }

  if (isNaN(parsedDate.getTime())) return String(date);

  return parsedDate.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric"
  });
}

export function parseDate(date: string | number): number {
  if (!date) return 0;
  if (typeof date === 'string' && /^\d+$/.test(date)) return Number(date); // timestamp string
  if (typeof date === 'number') return date; // numeric timestamp
  const parsed = Date.parse(date);
  return isNaN(parsed) ? 0 : parsed; // fallback
}