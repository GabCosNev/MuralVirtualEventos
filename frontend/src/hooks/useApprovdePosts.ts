import { useState, useEffect } from "react";
import { getPostHome } from "../Services/posts.service";
import { type Post } from "../types";

export function useApprovedPosts() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [isFetching, setIsFetching] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchPosts() {
      try {
        const response = await getPostHome();
        setPosts(response.data);
      } catch (e: unknown) {
        const err = e as { response?: { data?: { message?: string } } };
        setError(err.response?.data?.message ?? "Erro ao carregar publicações");
      } finally {
        setIsFetching(false);
      }
    }
    fetchPosts();
  }, []);

  return { posts, isFetching, error };
}
