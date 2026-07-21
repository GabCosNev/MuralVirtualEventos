import { usePostsFetch } from "./usePostsFetch";
import { getPostPending } from "../Services/posts.service";

export function usePendingPosts() {
  return usePostsFetch(getPostPending);
}
