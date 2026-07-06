import { useState } from "react";
import { createPost } from "../Services/posts.service";
import { type EventType } from "../types/";

export function useCreatePostForm() {
  const [title, setTitle] = useState("");
  const [eventType, setEventType] = useState<EventType | "">("");
  const [content, setContent] = useState("");
  const [dateStart, setDateStart] = useState("");
  const [dateEnd, setDateEnd] = useState("");
  const [timeStart, setTimeStart] = useState("");
  const [timeEnd, setTimeEnd] = useState("");

  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit() {
    setError("");
    setSuccessMessage("");
    if (!eventType) return setError("Selecione um tipo de evento");

    if (!dateStart || !dateEnd || !timeStart || !timeEnd)
      return setError("Selecione a data completa do evento");
    setIsLoading(true);
    try {
      await createPost({
        title,
        eventType,
        content,
        dateStart,
        dateEnd,
        timeStart,
        timeEnd,
      });
      setTitle("");
      setEventType("");
      setContent("");
      setDateStart("");
      setDateEnd("");
      setTimeStart("");
      setTimeEnd("");
      setSuccessMessage("Postagem enviada para avaliação!");
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
    dateStart,
    setDateStart,
    dateEnd,
    setDateEnd,
    timeStart,
    setTimeStart,
    timeEnd,
    setTimeEnd,
    error,
    successMessage,
    isLoading,
    handleSubmit,
  };
}
