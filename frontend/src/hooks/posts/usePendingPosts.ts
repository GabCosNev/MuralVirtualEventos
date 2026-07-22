import { usePostsFetch } from "../posts/usePostsFetch";
import { getPostPending } from "../../services/posts.service";

export function usePendingPosts() {
  return usePostsFetch(getPostPending);
}
