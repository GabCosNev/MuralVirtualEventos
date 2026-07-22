import { useCreatePostForm } from "../hooks/posts/useCreatePostForm";
import { eventTypeLabel } from "../utils/eventCustom";
import type { EventType } from "../types";
import { inputStyle } from "../utils/styles";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "./ui/dialog";

interface CreatePostModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CreatePostModal({ open, onOpenChange }: CreatePostModalProps) {
  const form = useCreatePostForm();

  function handleOpenChange(nextOpen: boolean) {
    if (!nextOpen) {
      form.resetForm();
    }
    onOpenChange(nextOpen);
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-2xl pt-2 px-4 pb-4 [&_[data-slot=dialog-close]]:hidden">
        <DialogHeader>
          <div className="bg-[var(--color-primary)] rounded-lg px-6 py-3.5 -mt-1 -mx-2">
            <DialogTitle className="text-white text-left text-lg">
              Criar publicação
            </DialogTitle>
          </div>

          <DialogDescription className="mt-1">
            Preencha os dados abaixo. Sua publicação será enviada para
            aprovação.
          </DialogDescription>
        </DialogHeader>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            form.handleSubmit();
          }}
        >
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-3">
              {/* Title */}
              <div className="flex flex-col gap-1">
                <label htmlFor="title" className="text-sm font-medium">
                  Título
                </label>
                <input
                  id="title"
                  type="text"
                  value={form.title}
                  onChange={(e) => form.setTitle(e.target.value)}
                  className={inputStyle}
                  placeholder="Título da publicação"
                />
              </div>

              {/* Event type */}
              <div className="flex flex-col gap-1">
                <label htmlFor="eventType" className="text-sm font-medium">
                  Tipo de evento
                </label>
                <select
                  id="eventType"
                  value={form.eventType}
                  onChange={(e) =>
                    form.setEventType(e.target.value as EventType)
                  }
                  className={inputStyle}
                >
                  <option value="" disabled>
                    Selecione um tipo
                  </option>
                  {Object.entries(eventTypeLabel).map(([value, label]) => (
                    <option key={value} value={value}>
                      {label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex flex-col gap-3">
              {/* Data e horário de início */}
              <div className="flex gap-2">
                <div className="flex flex-col gap-1 flex-1">
                  <label
                    htmlFor="startDateInput"
                    className="text-sm font-medium"
                  >
                    Data de início
                  </label>
                  <input
                    id="startDateInput"
                    type="date"
                    value={form.startDateInput}
                    onChange={(e) => form.setStartDateInput(e.target.value)}
                    className={inputStyle}
                  />
                </div>
                <div className="flex flex-col gap-1 flex-1">
                  <label
                    htmlFor="startTimeInput"
                    className="text-sm font-medium"
                  >
                    Horário de início
                  </label>
                  <input
                    id="startTimeInput"
                    type="time"
                    value={form.startTimeInput}
                    onChange={(e) => form.setStartTimeInput(e.target.value)}
                    className={inputStyle}
                  />
                </div>
              </div>

              {/* Data e horário de finalização */}
              <div className="flex gap-2">
                <div className="flex flex-col gap-1 flex-1">
                  <label htmlFor="endDateInput" className="text-sm font-medium">
                    Data de finalização
                  </label>
                  <input
                    id="endDateInput"
                    type="date"
                    value={form.endDateInput}
                    onChange={(e) => form.setEndDateInput(e.target.value)}
                    className={inputStyle}
                  />
                </div>
                <div className="flex flex-col gap-1 flex-1">
                  <label htmlFor="endTimeInput" className="text-sm font-medium">
                    Horário de finalização
                  </label>
                  <input
                    id="endTimeInput"
                    type="time"
                    value={form.endTimeInput}
                    onChange={(e) => form.setEndTimeInput(e.target.value)}
                    className={inputStyle}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Content, fora do grid, largura total */}
          <div className="flex flex-col gap-1 mt-4">
            <label htmlFor="content" className="text-sm font-medium">
              Conteúdo
            </label>
            <textarea
              id="content"
              value={form.content}
              onChange={(e) => form.setContent(e.target.value)}
              rows={4}
              className={`${inputStyle} resize-none`}
              placeholder="Descreva o evento..."
            />
          </div>

          {/* Erro, condicional */}
          {form.error && (
            <p className="text-sm text-red-500 mt-2">{form.error}</p>
          )}

          {/* Botões, alinhados à direita */}
          <div className="flex justify-end gap-2 mt-4">
            <button
              type="button"
              onClick={() => handleOpenChange(false)}
              className="bg-black/10 text-gray-900 px-4 py-2 rounded-md text-sm
           hover:bg-black/20 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={form.isLoading}
              className="bg-green-600 text-white px-4 py-2 rounded-md text-sm
                         disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {form.isLoading ? "Enviando..." : "Enviar"}
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
