import { useState } from "react";
import { createPost } from "../Services/posts.service";
import { type EventType } from "../types/";
import { dateTimeCombine } from "../utils/formatDate";

export function useCreatePostForm() {
  const [title, setTitle] = useState("");
  const [eventType, setEventType] = useState<EventType | "">("");
  const [content, setContent] = useState("");
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

    const { startDate, endDate } = dateTimeCombine(
      startDateInput,
      startTimeInput,
      endDateInput,
      endTimeInput,
    );

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
      setStartDateInput("");
      setEndDateInput("");
      setStartTimeInput("");
      setEndTimeInput("");
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
    startDateInput,
    setStartDateInput,
    endDateInput,
    setEndDateInput,
    startTimeInput,
    setStartTimeInput,
    endTimeInput,
    setEndTimeInput,
    error,
    successMessage,
    isLoading,
    handleSubmit,
  };
}
