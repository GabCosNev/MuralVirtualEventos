import { useState } from "react";
import { deletePost } from "../../services/posts.service";
import { toast } from "sonner";

export function useDeletePost() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  async function remove(id: number): Promise<boolean> {
    setIsLoading(true);
    setError("");

    try {
      await deletePost(id);
      toast.success("Publicação excluída!");
      return true;
    } catch (e: unknown) {
      const err = e as { response?: { data?: { message?: string } } };
      setError(err.response?.data?.message ?? "Erro ao excluir publicação");
      return false;
    } finally {
      setIsLoading(false);
    }
  }

  return { isLoading, error, remove };
}
