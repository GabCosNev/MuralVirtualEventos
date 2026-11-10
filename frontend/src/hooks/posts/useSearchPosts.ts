import { useState } from "react";
import { isAxiosError } from "axios";
import { searchPosts } from "../../services/posts.service";
import { type Post } from "../../types";

function getSearchErrorMessage(error: unknown): string {
  if (isAxiosError(error)) {
    if (error.code === "ECONNABORTED") {
      return "O assistente demorou para responder. Tente novamente.";
    }

    switch (error.response?.status) {
      case 400:
        return "Digite uma pergunta de até 300 caracteres.";
      case 429:
        return "Muitas perguntas em pouco tempo. Aguarde um minuto e tente de novo.";
      case 503:
        return "O assistente está indisponível no momento. Tente novamente em instantes.";
    }
  }

  return "Não foi possível processar sua pergunta.";
}

export function useSearchPosts() {
  const [answer, setAnswer] = useState<string | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function search(question: string) {
    setIsSearching(true);
    setError(null);

    try {
      const result = await searchPosts(question);
      setAnswer(result.answer);
      setPosts(result.posts);
    } catch (err) {
      setAnswer(null);
      setPosts([]);
      setError(getSearchErrorMessage(err));
    } finally {
      setIsSearching(false);
    }
  }

  function clear() {
    setAnswer(null);
    setPosts([]);
    setError(null);
  }

  return { answer, posts, isSearching, error, search, clear };
}
