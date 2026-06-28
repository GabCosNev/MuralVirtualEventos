import { useState } from "react";
import { createPost } from "../Services/posts.service";
import { type EventType } from "../types/";

export function useCreatePostForm() {
  const [title, setTitle] = useState("");
  const [eventType, setEventType] = useState<EventType | "">("");
  const [content, setContent] = useState("");
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit() {
    setError("");
    setSuccessMessage("");
    if (!eventType) return setError("Selecione um tipo de evento");
    setIsLoading(true);
    try {
      await createPost({ title, eventType, content });
      setTitle("");
      setEventType("");
      setContent("");
      setSuccessMessage("Postagem criada com sucesso!");
    } catch (e: unknown) {
      const err = e as { response?: { data?: { message?: string } } };
      setError(err.response?.data?.message ?? "Erro ao fazer a publicação");
    } finally {
      setIsLoading(false);
    }
  }
  return {
    title,
    setTitle,
    content,
    setContent,
    eventType,
    setEventType,
    error,
    successMessage,
    isLoading,
    handleSubmit,
  };
}
