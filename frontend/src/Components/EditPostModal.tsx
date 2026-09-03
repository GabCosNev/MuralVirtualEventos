import { useState } from "react";
import { useEditPostForm } from "../hooks/posts/useEditPostForm";
import { useDeletePost } from "../hooks/posts/useDeletePost";
import { eventTypeLabel } from "../utils/eventCustom";
import {
  inputStyle,
  buttonModalReturn,
  buttonModalConfirm,
  buttonModalDenied,
} from "../utils/styles";
import type { EventType } from "../types";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";

interface EditPostModalProps {
  postId: number | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  refetch: () => void;
}

export function EditPostModal({
  postId,
  open,
  onOpenChange,
  refetch,
}: EditPostModalProps) {
  const [mode, setMode] = useState<"edit" | "confirm-delete">("edit");
  const form = useEditPostForm(postId);
  const {
    remove,
    isLoading: isDeleting,
    error: deleteError,
    resetError,
  } = useDeletePost();

  function handleBack() {
    setMode("edit");
    resetError();
  }

  function handleOpenChange(nextOpen: boolean) {
    if (!nextOpen) {
      setMode("edit");
    }
    onOpenChange(nextOpen);
  }

  async function handleSave() {
    const success = await form.handleSubmit();
    if (success) onOpenChange(false);
  }

  async function handleConfirmDelete() {
    if (postId === null) return;
    const success = await remove(postId);
    if (success) {
      refetch();
      onOpenChange(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-2xl pt-2 px-4 pb-4 [&_[data-slot=dialog-close]]:hidden">
        <DialogHeader>
          <div className="bg-[var(--color-primary)] rounded-lg px-6 py-3.5 -mt-1 -mx-2">
            <DialogTitle className="text-white text-left text-lg">
              {mode === "edit" ? "Editar publicação" : "Confirmar exclusão"}
            </DialogTitle>
          </div>
        </DialogHeader>
        {mode === "edit" && (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSave();
            }}
          >
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-3">
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

                <div className="flex gap-2">
                  <div className="flex flex-col gap-1 flex-1">
                    <label
                      htmlFor="endDateInput"
                      className="text-sm font-medium"
                    >
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
                    <label
                      htmlFor="endTimeInput"
                      className="text-sm font-medium"
                    >
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

            {form.error && (
              <p className="text-sm text-red-500 mt-2">{form.error}</p>
            )}

            <div className="flex justify-end gap-2 mt-4">
              <button
                type="button"
                onClick={() => handleOpenChange(false)}
                disabled={form.isLoading}
                className={buttonModalReturn}
              >
                Voltar
              </button>
              <button
                type="button"
                onClick={() => setMode("confirm-delete")}
                disabled={form.isLoading}
                className={buttonModalDenied}
              >
                Excluir
              </button>
              <button
                type="submit"
                disabled={form.isLoading}
                className={buttonModalConfirm}
              >
                {form.isLoading ? "Salvando..." : "Salvar"}
              </button>
            </div>
          </form>
        )}
        {mode === "confirm-delete" && (
          <div className="flex flex-col gap-3">
            <p className="text-sm text-gray-700">
              Tem certeza que deseja excluir esta publicação? Essa ação não pode
              ser desfeita.
            </p>

            {deleteError && (
              <p className="text-sm text-red-500">{deleteError}</p>
            )}

            <div className="flex justify-end gap-2 mt-2">
              <button
                type="button"
                onClick={handleBack}
                disabled={isDeleting}
                className={buttonModalReturn}
              >
                Voltar
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                disabled={isDeleting}
                className={buttonModalConfirm}
              >
                {isDeleting ? "Excluindo..." : "Confirmar"}
              </button>
            </div>
          </div>
        )}{" "}
      </DialogContent>
    </Dialog>
  );
}
