export function dateTimeCombine(
  startDateInput: string,
  startTimeInput: string,
  endDateInput: string,
  endTimeInput: string,
): { startDate: string; endDate: string } {
  const [yearStart, monthStart, dayStart] = startDateInput
    .split("-")
    .map(Number);
  const [hoursStart, minutesStart] = startTimeInput.split(":").map(Number);
  const dateStartTransform = new Date(
    yearStart,
    monthStart - 1,
    dayStart,
    hoursStart,
    minutesStart,
  );
  const startDate = dateStartTransform.toISOString();

  const [yearEnd, monthEnd, dayEnd] = endDateInput.split("-").map(Number);
  const [hoursEnd, minutesEnd] = endTimeInput.split(":").map(Number);
  const dateEndTransform = new Date(
    yearEnd,
    monthEnd - 1,
    dayEnd,
    hoursEnd,
    minutesEnd,
  );
  const endDate = dateEndTransform.toISOString();

  return { startDate, endDate };
}

export function formatEventPeriod(startDate: string, endDate: string): string {
  const start = new Date(startDate);
  const end = new Date(endDate);

  const startDateFormatted = start.toLocaleDateString("pt-BR");
  const startTimeFormatted = start.toLocaleTimeString("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
  });

  const endDateFormatted = end.toLocaleDateString("pt-BR");
  const endTimeFormatted = end.toLocaleTimeString("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
  });

  const sameDay = startDateFormatted === endDateFormatted;

  if (sameDay) {
    return `${startDateFormatted}, ${startTimeFormatted} às ${endTimeFormatted}`;
  }

  return `${startDateFormatted} ${startTimeFormatted} até ${endDateFormatted} ${endTimeFormatted}`;
}
