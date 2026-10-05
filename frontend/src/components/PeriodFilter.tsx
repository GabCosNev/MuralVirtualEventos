import { type Periodo } from "../types/post.types";

interface PeriodFilterProps {
  filtroPeriodo: Periodo | undefined;
  onChange: (periodo: Periodo | undefined) => void;
}

const periodos: { label: string; value: Periodo | undefined }[] = [
  { label: "Todos os Dias", value: undefined },
  { label: "Hoje", value: "HOJE" },
  { label: "Semana", value: "SEMANA" },
  { label: "Mês", value: "MES" },
];

export function PeriodFilter({ filtroPeriodo, onChange }: PeriodFilterProps) {
  return (
    <div className="flex flex-wrap gap-2 mb-4 justify-center">
      {periodos.map((periodo) => (
        <button
          key={periodo.label}
          onClick={() => onChange(periodo.value)}
          className={`px-4 py-2 rounded-full text-sm cursor-pointer transition-colors ${
            periodo.value === filtroPeriodo
              ? "bg-[var(--color-primary)] font-semibold text-white"
              : "hover:bg-white/10 text-white"
          }`}
        >
          {periodo.label}
        </button>
      ))}
    </div>
  );
}
