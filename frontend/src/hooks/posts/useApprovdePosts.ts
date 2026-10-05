import { useCallback } from "react";
import { usePostsFetch } from "../posts/usePostsFetch";
import { getPostHome } from "../../services/posts.service";
import { type EventType, type Periodo } from "../../types/post.types";

export function useApprovedPosts(eventType?: EventType, periodo?: Periodo) {
  const fetchFn = useCallback(
    () => getPostHome(eventType, periodo),
    [eventType, periodo],
  );

  return usePostsFetch(fetchFn);
}
