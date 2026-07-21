import { usePostsFetch } from "./usePostsFetch";
import { getPostHome } from "../Services/posts.service";

export function useApprovedPosts() {
  return usePostsFetch(getPostHome);
}
