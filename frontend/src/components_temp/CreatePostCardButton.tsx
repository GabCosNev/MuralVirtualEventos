import { Plus } from "lucide-react";

interface CreatePostCardProps {
  onClick: () => void;
}

export function CreatePostCard({ onClick }: CreatePostCardProps) {
  return (
    <button
      onClick={onClick}
      aria-label="Criar nova publicação"
      className="flex items-center justify-center h-full min-h-[150px] w-full
                 rounded-lg border-2 border-dashed border-white/20
                 bg-white/5 hover:bg-white/10 cursor-pointer transition-colors
                 focus:outline-none focus:ring-2 focus:ring-white/30"
    >
      <Plus className="w-10 h-10 text-white/40" />
    </button>
  );
}
