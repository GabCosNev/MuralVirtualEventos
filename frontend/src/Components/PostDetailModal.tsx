import { useState } from "react";
import { type Post } from "../types";
import { usePostReview } from "../hooks/posts/usePostReview";
import { useRejectForm } from "../hooks/posts/useRejectForm";
import { eventTypeColor, eventTypeLabel } from "../utils/eventCustom";
import { formatEventPeriod } from "../utils/formatDate";
import {
  inputStyle,
  buttonModalConfirm,
  buttonModalDenied,
  buttonModalReturn,
} from "../utils/styles";
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
  const [displayPost, setDisplayPost] = useState<Post | null>(post);

  if (post && post !== displayPost) {
    setDisplayPost(post);
  }

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
    if (!displayPost) return;
    const success = await approvePost(displayPost.id);
    if (success) {
      refetch?.();
      onOpenChange(false);
    }
  }

  async function handleConfirmReject() {
    if (!displayPost) return;
    if (!rejectForm.validate()) return;

    const success = await rejectPost(displayPost.id, rejectForm.reason);
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

        {mode === "view" && displayPost && (
          <div className="flex flex-col gap-3">
            <div className="flex flex-col items-center gap-2">
              <span
                className={`${eventTypeColor[displayPost.eventType]} text-white text-xs font-semibold px-2 py-1 rounded w-fit`}
              >
                {eventTypeLabel[displayPost.eventType]}
              </span>
              <h3 className="text-lg font-bold">{displayPost.title}</h3>
            </div>

            <p className="text-sm text-gray-500 text-center border-b border-gray-200 pb-3">
              {formatEventPeriod(displayPost.startDate, displayPost.endDate)}
            </p>

            <p className="whitespace-pre-line text-sm text-gray-700">
              {displayPost.content}
            </p>

            {reviewError && (
              <p className="text-sm text-red-500">{reviewError}</p>
            )}

            <div className="flex justify-end gap-2 mt-2">
              <button
                type="button"
                onClick={() => handleOpenChange(false)}
                disabled={isReviewing}
                className={buttonModalReturn}
              >
                Voltar
              </button>

              {isAdmin && (
                <>
                  <button
                    type="button"
                    onClick={() => setMode("reject")}
                    disabled={isReviewing}
                    className={buttonModalDenied}
                  >
                    Rejeitar
                  </button>
                  <button
                    type="button"
                    onClick={handleApprove}
                    disabled={isReviewing}
                    className={buttonModalConfirm}
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
                className={buttonModalReturn}
              >
                Voltar
              </button>
              <button
                type="button"
                onClick={handleConfirmReject}
                disabled={isReviewing}
                className={buttonModalConfirm}
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
