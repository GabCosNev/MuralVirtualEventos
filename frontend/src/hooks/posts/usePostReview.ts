import { useState } from "react";
import { reviewPost } from "../../services/posts.service";
import { toast } from "sonner";
import type { PostStatus } from "../../types";

export function usePostReview() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  async function review(
    id: number,
    status: PostStatus,
    message: string,
    rejectedReason?: string,
  ): Promise<boolean> {
    setIsLoading(true);
    setError("");

    try {
      await reviewPost({ status, rejectedReason }, id);
      toast.success(message);
      return true;
    } catch (e: unknown) {
      const err = e as { response?: { data?: { message?: string } } };
      setError(err.response?.data?.message ?? "Erro ao revisar publicação");
      return false;
    } finally {
      setIsLoading(false);
    }
  }

  function approvePost(id: number) {
    return review(id, "APPROVED", "Publicação aprovada!");
  }

  function rejectPost(id: number, reason: string) {
    if (reason.trim().length < 10) {
      setError("O motivo da rejeição deve ter no mínimo 10 caracteres.");
      return Promise.resolve(false);
    }

    return review(id, "REJECTED", "Publicação rejeitada!", reason);
  }

  function resetError() {
    setError("");
  }

  return { isLoading, error, approvePost, rejectPost, resetError };
}
