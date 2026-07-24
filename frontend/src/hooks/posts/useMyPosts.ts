import { usePostsFetch } from "../posts/usePostsFetch";
import { getPostMine } from "../../services/posts.service";

export function usePendingPosts() {
  return usePostsFetch(getPostMine);
}
