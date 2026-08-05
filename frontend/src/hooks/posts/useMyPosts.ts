import { usePostsFetch } from "../posts/usePostsFetch";
import { getPostMine } from "../../services/posts.service";

export function useMyPosts() {
  return usePostsFetch(getPostMine);
}
