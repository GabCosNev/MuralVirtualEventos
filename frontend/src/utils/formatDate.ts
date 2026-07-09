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
