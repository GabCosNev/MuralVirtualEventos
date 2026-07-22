import { usePostsFetch } from "../posts/usePostsFetch";
import { getPostHome } from "../../services/posts.service";

export function useApprovedPosts() {
  return usePostsFetch(getPostHome);
}
