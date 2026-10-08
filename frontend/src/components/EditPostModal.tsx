import { useState } from "react";
import { useEditPostForm } from "../hooks/posts/useEditPostForm";
import { useDeletePost } from "../hooks/posts/useDeletePost";
import { eventTypeLabel } from "../utils/eventCustom";
import { minDate, getMaxEndDate } from "../utils/formatDate";
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
  const editPost = useEditPostForm(postId);
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
    const success = await editPost.handleSubmit();
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
      <DialogContent className="sm:max-w-2xl pt-2 px-4 pb-4 max-h-[90dvh] overflow-y-auto [&_[data-slot=dialog-close]]:hidden">
        <DialogHeader>
          <div className="bg-[var(--color-primary)] rounded-lg px-6 py-3.5 -mt-1 -mx-2">
            <DialogTitle className="text-white text-left text-lg">
              {mode === "edit" ? "Editar publicação" : "Confirmar exclusão"}
            </DialogTitle>
          </div>
        </DialogHeader>

        {mode === "edit" && (
          <form
            className="min-w-0"
            onSubmit={(e) => {
              e.preventDefault();
              handleSave();
            }}
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col gap-3 min-w-0">
                <div className="flex flex-col gap-1">
                  <label htmlFor="title" className="text-sm font-medium">
                    Título
                  </label>
                  <input
                    id="title"
                    type="text"
                    value={editPost.title}
                    onChange={(e) => editPost.setTitle(e.target.value)}
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
                    value={editPost.eventType}
                    onChange={(e) =>
                      editPost.setEventType(e.target.value as EventType)
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

              <div className="flex flex-col gap-3 min-w-0">
                <div className="flex flex-col sm:flex-row gap-2">
                  <div className="flex flex-col gap-1 sm:flex-1 min-w-0">
                    <label
                      htmlFor="startDateInput"
                      className="text-sm font-medium"
                    >
                      Data de início
                    </label>
                    <input
                      id="startDateInput"
                      type="date"
                      min={minDate}
                      value={editPost.startDateInput}
                      onChange={(e) => {
                        editPost.setStartDateInput(e.target.value);
                        editPost.setEndDateInput("");
                      }}
                      className={inputStyle}
                    />
                  </div>
                  <div className="flex flex-col gap-1 sm:flex-1 min-w-0">
                    <label
                      htmlFor="startTimeInput"
                      className="text-sm font-medium"
                    >
                      Horário de início
                    </label>
                    <input
                      id="startTimeInput"
                      type="time"
                      value={editPost.startTimeInput}
                      onChange={(e) =>
                        editPost.setStartTimeInput(e.target.value)
                      }
                      className={inputStyle}
                    />
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-2">
                  <div className="flex flex-col gap-1 sm:flex-1 min-w-0">
                    <label
                      htmlFor="endDateInput"
                      className="text-sm font-medium"
                    >
                      Data de finalização
                    </label>
                    <input
                      id="endDateInput"
                      type="date"
                      disabled={!editPost.startDateInput}
                      min={editPost.startDateInput}
                      max={
                        editPost.startDateInput
                          ? getMaxEndDate(editPost.startDateInput)
                          : undefined
                      }
                      value={editPost.endDateInput}
                      onChange={(e) => editPost.setEndDateInput(e.target.value)}
                      className={inputStyle}
                    />
                  </div>
                  <div className="flex flex-col gap-1 sm:flex-1 min-w-0">
                    <label
                      htmlFor="endTimeInput"
                      className="text-sm font-medium"
                    >
                      Horário de finalização
                    </label>
                    <input
                      id="endTimeInput"
                      type="time"
                      value={editPost.endTimeInput}
                      onChange={(e) => editPost.setEndTimeInput(e.target.value)}
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
                value={editPost.content}
                onChange={(e) => editPost.setContent(e.target.value)}
                rows={4}
                className={`${inputStyle} resize-none`}
                placeholder="Descreva o evento..."
              />
            </div>

            {editPost.error && (
              <p className="text-sm text-red-500 mt-2">{editPost.error}</p>
            )}

            <div className="flex justify-end gap-2 mt-4">
              <button
                type="button"
                onClick={() => handleOpenChange(false)}
                disabled={editPost.isLoading}
                className={buttonModalReturn}
              >
                Voltar
              </button>
              <button
                type="button"
                onClick={() => setMode("confirm-delete")}
                disabled={editPost.isLoading}
                className={buttonModalDenied}
              >
                Excluir
              </button>
              <button
                type="submit"
                disabled={editPost.isLoading}
                className={buttonModalConfirm}
              >
                {editPost.isLoading ? "Salvando..." : "Salvar"}
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
        )}
      </DialogContent>
    </Dialog>
  );
}
