import { useState, useEffect } from "react";
import { getPostById, updatePost } from "../Services/posts.service";
import { type EventType, type UpdatePost } from "../types";
import { dateTimeCombine } from "@/utils/formatDate";

export function useEditPostForm(postId: number) {
  const [title, setTitle] = useState("");
  const [eventType, setEventType] = useState<EventType | "">("");
  const [content, setContent] = useState("");
  const [startDateInput, setStartDateInput] = useState("");
  const [endDateInput, setEndDateInput] = useState("");
  const [startTimeInput, setStartTimeInput] = useState("");
  const [endTimeInput, setEndTimeInput] = useState("");
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

        const dataStart = new Date(response.data.startDate);
        const yearStart = dataStart.getFullYear();
        const mounthStart = String(dataStart.getMonth() + 1).padStart(2, "0");
        const dayStart = String(dataStart.getDate()).padStart(2, "0");
        const hourStart = String(dataStart.getHours()).padStart(2, "0");
        const minuteStart = String(dataStart.getMinutes()).padStart(2, "0");

        setStartDateInput(`${yearStart}-${mounthStart}-${dayStart}`);
        setStartTimeInput(`${hourStart}:${minuteStart}`);

        const dataEnd = new Date(response.data.endDate);
        const yearEnd = dataEnd.getFullYear();
        const mounthEnd = String(dataEnd.getMonth() + 1).padStart(2, "0");
        const dayEnd = String(dataEnd.getDate()).padStart(2, "0");
        const hourEnd = String(dataEnd.getHours()).padStart(2, "0");
        const minuteEnd = String(dataEnd.getMinutes()).padStart(2, "0");

        setEndDateInput(`${yearEnd}-${mounthEnd}-${dayEnd}`);
        setEndTimeInput(`${hourEnd}:${minuteEnd}`);
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

    if (!startDateInput || !startTimeInput || !endDateInput || !endTimeInput)
      return setError("Todas as datas precisam estar preenchidas");

    const { startDate, endDate } = dateTimeCombine(
      startDateInput,
      startTimeInput,
      endDateInput,
      endTimeInput,
    );

    setIsLoading(true);

    try {
      const payload: UpdatePost = {
        title,
        content,
        startDate,
        endDate,
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
    isFetching,
    isLoading,
    handleSubmit,
  };
}
