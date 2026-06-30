import { useState, useEffect } from "react";
import { getPostById, updatePost } from "../Services/posts.service";
import { type EventType, type UpdatePost } from "../types";

export function useEditPostForm(postId: number) {
  const [title, setTitle] = useState("");
  const [eventType, setEventType] = useState<EventType | "">("");
  const [content, setContent] = useState("");
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isFetching, setIsFetching] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    async function fetchPost() {
      try {
        const response = await getPostById(postId);
        setTitle(response.data.title);
        setEventType(response.data.eventType);
        setContent(response.data.content);
      } catch (e: unknown) {
        const err = e as { response?: { data?: { message?: string } } };
        setError(err.response?.data?.message ?? "Erro ao carregar post");
      } finally {
        setIsFetching(false);
      }
    }
    fetchPost();
  }, [postId]);

  async function handleSubmit() {
    setError("");
    setSuccessMessage("");
    setIsLoading(true);

    try {
      const payload: UpdatePost = {
        title,
        content,
        ...(eventType ? { eventType } : {}),
      };
      await updatePost(payload, postId);
      setSuccessMessage("Post enviado para verificação");
    } catch (e: unknown) {
      const err = e as { response?: { data?: { message?: string } } };
      setError(err.response?.data?.message ?? "Erro ao atualizar post");
    } finally {
      setIsLoading(false);
    }
  }
  return {
    title,
    setTitle,
    eventType,
    setEventType,
    content,
    setContent,
    error,
    successMessage,
    isFetching,
    isLoading,
    handleSubmit,
  };
}
