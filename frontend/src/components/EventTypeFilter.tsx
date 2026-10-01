import { type EventType } from "../types/post.types";

interface EventTypeFilterProps {
  filtroAtivo: EventType | undefined;
  onChange: (eventType: EventType | undefined) => void;
}

const filtros: { label: string; value: EventType | undefined }[] = [
  { label: "Todos", value: undefined },
  { label: "Avisos", value: "ANNOUNCEMENT" },
  { label: "Palestras", value: "LECTURE" },
  { label: "Comemorações", value: "CELEBRATION" },
];

export function EventTypeFilter({
  filtroAtivo,
  onChange,
}: EventTypeFilterProps) {
  return (
    <div className="flex flex-wrap gap-2 mb-4 justify-center">
      {filtros.map((filtro) => (
        <button
          key={filtro.label}
          onClick={() => onChange(filtro.value)}
          className={`px-3 py-1 rounded-md text-sm transition-colors ${
            filtro.value === filtroAtivo
              ? "bg-white/20 font-semibold text-white"
              : "hover:bg-white/10 text-white"
          }`}
        >
          {filtro.label}
        </button>
      ))}
    </div>
  );
}
