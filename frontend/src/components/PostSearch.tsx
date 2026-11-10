import { useState, type SyntheticEvent } from "react";
interface PostSearchProps {
  isSearching: boolean;
  hasSearch: boolean;
  error: string | null;
  onSearch: (question: string) => void;
  onClear: () => void;
}

export function PostSearch({
  isSearching,
  hasSearch,
  error,
  onSearch,
  onClear,
}: PostSearchProps) {
  const [question, setQuestion] = useState("");

  function handleSubmit(event: SyntheticEvent<HTMLFormElement>) {
    event.preventDefault();
    const trimmed = question.trim();
    if (!trimmed || isSearching) return;
    onSearch(trimmed);
  }

  function handleClear() {
    setQuestion("");
    onClear();
  }

  return (
    <div className="mb-6">
      <form onSubmit={handleSubmit} className="flex gap-2 max-w-2xl mx-auto">
        <input
          type="text"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          maxLength={300}
          placeholder="Encontre aqui eventos específicos de acordo com o que você procura!"
          className="flex-1 px-3 py-2 rounded-md text-sm bg-white/10 text-white placeholder:text-white/50 outline-none focus:bg-white/20"
        />
        <button
          type="submit"
          disabled={isSearching || !question.trim()}
          className="px-4 py-2 rounded-md text-sm bg-primary font-semibold text-white hover:bg-primary/80 transition-colors disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed"
        >
          {isSearching ? "Buscando..." : "Buscar"}
        </button>
        {hasSearch && (
          <button
            type="button"
            onClick={handleClear}
            disabled={isSearching}
            className="px-3 py-2 rounded-md text-sm text-white hover:bg-white/10 transition-colors disabled:opacity-50 cursor-pointer"
          >
            Limpar
          </button>
        )}
      </form>

      {error && (
        <p className="text-center text-red-500 text-sm mt-2">{error}</p>
      )}
    </div>
  );
}
