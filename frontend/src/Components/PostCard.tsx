import { type Post } from "../types";

interface PostCardProps {
  post: Post;
  onEdit?: () => void;
  onDelete?: () => void;
  onApprove?: () => void;
  onReject?: () => void;
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
