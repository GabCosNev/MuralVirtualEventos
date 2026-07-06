import { useState } from "react";
import { createPost } from "../Services/posts.service";
import { type EventType } from "../types/";

export function useCreatePostForm() {
  const [title, setTitle] = useState("");
  const [eventType, setEventType] = useState<EventType | "">("");
  const [content, setContent] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [startDateInput, setStartDateInput] = useState("");
  const [endDateInput, setEndDateInput] = useState("");
  const [startTimeInput, setStartTimeInput] = useState("");
  const [endTimeInput, setEndTimeInput] = useState("");

  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit() {
    setError("");
    setSuccessMessage("");
    if (!eventType) return setError("Selecione um tipo de evento");

    if (!startDateInput || !endDateInput || !startTimeInput || !endTimeInput)
      return setError("Selecione a data completa do evento");

    setIsLoading(true);
    try {
      await createPost({
        title,
        eventType,
        content,
        startDate,
        endDate,
      });
      setTitle("");
      setEventType("");
      setContent("");
      setStartDate("");
      setStartDateInput("");
      setEndDateInput("");
      setStartTimeInput("");
      setEndTimeInput("");
      setEndDate("");
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
    startDate,
    setStartDate,
    endDate,
    setEndDate,
    error,
    successMessage,
    isLoading,
    handleSubmit,
  };
}
