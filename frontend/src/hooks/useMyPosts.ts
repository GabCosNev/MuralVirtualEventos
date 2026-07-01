import { useState, useEffect } from "react";
import { getPostMine } from "../Services/posts.service";
import { type Post } from "../types";

export function useMyPosts() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [isFetching, setIsFetching] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchPosts() {
      try {
        const response = await getPostMine();
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
