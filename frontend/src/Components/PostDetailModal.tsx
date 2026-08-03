import { useState } from "react";
import { type Post } from "../types";
import { usePostReview } from "../hooks/posts/usePostReview";
import { useRejectForm } from "../hooks/posts/useRejectForm";
import { eventTypeColor, eventTypeLabel } from "../utils/eventCustom";
import { formatEventPeriod } from "../utils/formatDate";
import { inputStyle } from "../utils/styles";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";

interface PostDetailModalProps {
  post: Post | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  refetch?: () => void;
  isAdmin?: boolean;
}

export function PostDetailModal({
  post,
  open,
  onOpenChange,
  refetch,
  isAdmin,
}: PostDetailModalProps) {
  const [mode, setMode] = useState<"view" | "reject">("view");
  const rejectForm = useRejectForm();
  const {
    approvePost,
    rejectPost,
    resetError,
    isLoading: isReviewing,
    error: reviewError,
  } = usePostReview();

  function handleBack() {
    setMode("view");
    rejectForm.resetForm();
    resetError();
  }

  function handleOpenChange(nextOpen: boolean) {
    if (!nextOpen) {
      handleBack();
    }
    onOpenChange(nextOpen);
  }

  async function handleApprove() {
    if (!post) return;
    const success = await approvePost(post.id);
    if (success) {
      refetch?.();
      onOpenChange(false);
    }
  }

  async function handleConfirmReject() {
    if (!post) return;
    if (!rejectForm.validate()) return;

    const success = await rejectPost(post.id, rejectForm.reason);
    if (success) {
      refetch?.();
      onOpenChange(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-2xl pt-2 px-4 pb-4 [&_[data-slot=dialog-close]]:hidden">
        <DialogHeader>
          <div className="bg-[var(--color-primary)] rounded-lg px-6 py-3.5 -mt-1 -mx-2">
            <DialogTitle className="text-white text-left text-lg">
              {mode === "view"
                ? "Detalhes da publicação"
                : "Motivo da Rejeição"}
            </DialogTitle>
          </div>
        </DialogHeader>

        {mode === "view" && post && (
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-2">
              <span
                className={`${eventTypeColor[post.eventType]} text-white text-xs font-semibold px-2 py-1 rounded`}
              >
                {eventTypeLabel[post.eventType]}
              </span>
              <h3 className="text-lg font-bold">{post.title}</h3>
            </div>

            <p className="text-sm text-gray-500 text-center border-b border-gray-200 pb-3">
              {formatEventPeriod(post.startDate, post.endDate)}
            </p>

            <p className="whitespace-pre-line text-sm text-gray-700">
              {post.content}
            </p>

            {reviewError && (
              <p className="text-sm text-red-500">{reviewError}</p>
            )}

            <div className="flex justify-end gap-2 mt-2">
              <button
                type="button"
                onClick={() => handleOpenChange(false)}
                disabled={isReviewing}
                className="bg-black/10 text-gray-900 px-4 py-2 rounded-md text-sm
                           hover:bg-black/20 transition-colors
                           disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancelar
              </button>

              {isAdmin && (
                <>
                  <button
                    type="button"
                    onClick={() => setMode("reject")}
                    disabled={isReviewing}
                    className="bg-red-600 text-white px-4 py-2 rounded-md text-sm
                               disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Rejeitar
                  </button>
                  <button
                    type="button"
                    onClick={handleApprove}
                    disabled={isReviewing}
                    className="bg-green-600 text-white px-4 py-2 rounded-md text-sm
                               disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isReviewing ? "Enviando..." : "Aprovar"}
                  </button>
                </>
              )}
            </div>
          </div>
        )}

        {mode === "reject" && (
          <div className="flex flex-col gap-3">
            <div className="flex flex-col gap-1">
              <label htmlFor="rejectReason" className="text-sm font-medium">
                Motivo
              </label>
              <textarea
                id="rejectReason"
                value={rejectForm.reason}
                onChange={(e) => rejectForm.setReason(e.target.value)}
                rows={4}
                className={`${inputStyle} resize-none`}
                placeholder="Explique o motivo da rejeição..."
              />
            </div>

            {rejectForm.error && (
              <p className="text-sm text-red-500">{rejectForm.error}</p>
            )}

            {reviewError && (
              <p className="text-sm text-red-500">{reviewError}</p>
            )}

            <div className="flex justify-end gap-2 mt-2">
              <button
                type="button"
                onClick={handleBack}
                disabled={isReviewing}
                className="bg-black/10 text-gray-900 px-4 py-2 rounded-md text-sm
                           hover:bg-black/20 transition-colors
                           disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Voltar
              </button>
              <button
                type="button"
                onClick={handleConfirmReject}
                disabled={isReviewing}
                className="bg-red-600 text-white px-4 py-2 rounded-md text-sm
                           disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isReviewing ? "Enviando..." : "Confirmar"}
              </button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
