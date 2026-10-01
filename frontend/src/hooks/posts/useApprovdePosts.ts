import { useCallback } from "react";
import { usePostsFetch } from "../posts/usePostsFetch";
import { getPostHome } from "../../services/posts.service";
import { type EventType } from "../../types/post.types";

export function useApprovedPosts(eventType?: EventType) {
  const fetchFn = useCallback(() => getPostHome(eventType), [eventType]);

  return usePostsFetch(fetchFn);
}
