import { type EventType } from "../types/post.types";

interface EventTypeFilterProps {
  filtroEvento: EventType | undefined;
  onChange: (eventType: EventType | undefined) => void;
}

const filtros: { label: string; value: EventType | undefined }[] = [
  { label: "Todos os Eventos", value: undefined },
  { label: "Avisos", value: "ANNOUNCEMENT" },
  { label: "Palestras", value: "LECTURE" },
  { label: "Celebrações", value: "CELEBRATION" },
];

export function EventTypeFilter({
  filtroEvento,
  onChange,
}: EventTypeFilterProps) {
  return (
    <div className="flex flex-wrap gap-2 mb-4 justify-center">
      {filtros.map((filtro) => (
        <button
          key={filtro.label}
          onClick={() => onChange(filtro.value)}
          className={`px-4 py-2 rounded-full text-sm cursor-pointer transition-colors ${
            filtro.value === filtroEvento
              ? "bg-[var(--color-primary)] font-semibold text-white"
              : "hover:bg-white/10 text-white"
          }`}
        >
          {filtro.label}
        </button>
      ))}
    </div>
  );
}
