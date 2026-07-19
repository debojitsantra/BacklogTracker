export function getLocalDateString(offsetDays = 0, date = new Date()) {
  const localDate = new Date(date);
  if (offsetDays !== 0) {
    localDate.setDate(localDate.getDate() + offsetDays);
  }

  const year = localDate.getFullYear();
  const month = String(localDate.getMonth() + 1).padStart(2, '0');
  const day = String(localDate.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
}

export function parseLocalDate(dateString: string) {
  const [year, month, day] = dateString.split('-').map(Number);
  return new Date(year, month - 1, day);
}

export function getCalendarDaysDifference(startDateString: string, endDateString: string) {
  const start = parseLocalDate(startDateString);
  const end = parseLocalDate(endDateString);

  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) {
    return 0;
  }

  // Use calendar dates rather than local midnight timestamps. The latter are 23 or
  // 25 hours apart around daylight-saving transitions.
  const startUtc = Date.UTC(start.getFullYear(), start.getMonth(), start.getDate());
  const endUtc = Date.UTC(end.getFullYear(), end.getMonth(), end.getDate());
  return Math.max(0, Math.round((endUtc - startUtc) / (1000 * 60 * 60 * 24)));
}
