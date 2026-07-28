import { useState } from "react";
import { useEditPostForm } from "../hooks/posts/useEditPostForm";
import { useDeletePost } from "../hooks/posts/useDeletePost";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";

interface EditPostModalProps {
  postId: number | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  refetch?: () => void;
}

export function EditPostModal({
  postId,
  open,
  onOpenChange,
  refetch,
}: EditPostModalProps) {
  const [mode, setMode] = useState<"edit" | "confirm-delete">("edit");

  if (postId === null) return null;

  const form = useEditPostForm(postId);
  const deletePost = useDeletePost(refetch);
}
