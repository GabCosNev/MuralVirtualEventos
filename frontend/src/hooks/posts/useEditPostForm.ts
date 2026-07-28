import { useState, useEffect } from "react";
import { getPostById, updatePost } from "../../services/posts.service";
import { type EventType, type UpdatePost } from "../../types";
import { dateTimeCombine } from "../../utils/formatDate";
import { toast } from "sonner";

export function useEditPostForm(postId: number) {
  const [title, setTitle] = useState("");
  const [eventType, setEventType] = useState<EventType | "">("");
  const [content, setContent] = useState("");
  const [startDateInput, setStartDateInput] = useState("");
  const [endDateInput, setEndDateInput] = useState("");
  const [startTimeInput, setStartTimeInput] = useState("");
  const [endTimeInput, setEndTimeInput] = useState("");
  const [error, setError] = useState("");
  const [isFetching, setIsFetching] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    async function fetchPost() {
      try {
        const response = await getPostById(postId);
        setTitle(response.title);
        setEventType(response.eventType);
        setContent(response.content);

        const dataStart = new Date(response.startDate);
        const yearStart = dataStart.getFullYear();
        const mounthStart = String(dataStart.getMonth() + 1).padStart(2, "0");
        const dayStart = String(dataStart.getDate()).padStart(2, "0");
        const hourStart = String(dataStart.getHours()).padStart(2, "0");
        const minuteStart = String(dataStart.getMinutes()).padStart(2, "0");

        setStartDateInput(`${yearStart}-${mounthStart}-${dayStart}`);
        setStartTimeInput(`${hourStart}:${minuteStart}`);

        const dataEnd = new Date(response.endDate);
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

  async function handleSubmit(): Promise<boolean> {
    setError("");

    if (!startDateInput || !startTimeInput || !endDateInput || !endTimeInput) {
      setError("Todas as datas precisam estar preenchidas");
      return false;
    }

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
      toast.success("Postagem enviada para avaliação!");
      return true;
    } catch (e: unknown) {
      const err = e as { response?: { data?: { message?: string } } };
      setError(err.response?.data?.message ?? "Erro ao atualizar post");
      return false;
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
    isFetching,
    isLoading,
    handleSubmit,
  };
}
