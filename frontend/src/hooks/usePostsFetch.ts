import { useState, useEffect, useCallback } from "react";
import { type Post } from "../types";

export function usePostsFetch(fetchFn: () => Promise<{ data: Post[] }>) {
  const [posts, setPosts] = useState<Post[]>([]);
  const [isFetching, setIsFetching] = useState(true);
  const [error, setError] = useState("");

  const fetchPosts = useCallback(async () => {
    setIsFetching(true);
    try {
      const response = await fetchFn();
      setPosts(response.data);
    } catch (e: unknown) {
      const err = e as { response?: { data?: { message?: string } } };
      setError(err.response?.data?.message ?? "Erro ao carregar publicações");
    } finally {
      setIsFetching(false);
    }
  }, [fetchFn]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchPosts();
  }, [fetchPosts]);

  return { posts, isFetching, error, refetch: fetchPosts };
}
