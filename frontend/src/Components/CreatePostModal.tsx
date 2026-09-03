import { useCreatePostForm } from "../hooks/posts/useCreatePostForm";
import { eventTypeLabel } from "../utils/eventCustom";
import type { EventType } from "../types";
import {
  inputStyle,
  buttonModalConfirm,
  buttonModalReturn,
} from "../utils/styles";
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
  const createPost = useCreatePostForm();

  function handleOpenChange(nextOpen: boolean) {
    if (!nextOpen) {
      createPost.resetForm();
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
            createPost.handleSubmit();
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
                  value={createPost.title}
                  onChange={(e) => createPost.setTitle(e.target.value)}
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
                  value={createPost.eventType}
                  onChange={(e) =>
                    createPost.setEventType(e.target.value as EventType)
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
                    value={createPost.startDateInput}
                    onChange={(e) =>
                      createPost.setStartDateInput(e.target.value)
                    }
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
                    value={createPost.startTimeInput}
                    onChange={(e) =>
                      createPost.setStartTimeInput(e.target.value)
                    }
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
                    value={createPost.endDateInput}
                    onChange={(e) => createPost.setEndDateInput(e.target.value)}
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
                    value={createPost.endTimeInput}
                    onChange={(e) => createPost.setEndTimeInput(e.target.value)}
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
              value={createPost.content}
              onChange={(e) => createPost.setContent(e.target.value)}
              rows={4}
              className={`${inputStyle} resize-none`}
              placeholder="Descreva o evento..."
            />
          </div>

          {/* Erro, condicional */}
          {createPost.error && (
            <p className="text-sm text-red-500 mt-2">{createPost.error}</p>
          )}

          {/* Botões, alinhados à direita */}
          <div className="flex justify-end gap-2 mt-4">
            <button
              type="button"
              onClick={() => handleOpenChange(false)}
              className={buttonModalReturn}
            >
              Voltar
            </button>
            <button
              type="submit"
              disabled={createPost.isLoading}
              className={buttonModalConfirm}
            >
              {createPost.isLoading ? "Enviando..." : "Enviar"}
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
