import { type EventType } from "../types";

export const eventTypeColor: Record<EventType, string> = {
  ANNOUNCEMENT: "bg-[var(--color-announcement)]",
  LECTURE: "bg-[var(--color-lecture)]",
  CELEBRATION: "bg-[var(--color-celebration)]",
};

export const eventTypeLabel: Record<EventType, string> = {
  ANNOUNCEMENT: "Anúncio",
  LECTURE: "Palestra",
  CELEBRATION: "Celebração",
};
