import { type Post } from "../types";
import { formatEventPeriod } from "../utils/formatDate";
import { eventTypeColor, eventTypeLabel } from "@/utils/eventCustom";

interface PostCardProps {
  post: Post;
  onClick: () => void;
}

export function PostCard({ post, onClick }: PostCardProps) {
  const badgeColor = eventTypeColor[post.eventType];

  return (
    <div
      onClick={onClick}
      className="rounded-lg shadow-md overflow-hidden cursor-pointer hover:opacity-90 transition-opacity"
    >
      {/* Badge do eventType + título, lado a lado */}
      <div className="p-4 flex items-center gap-2">
        <span
          className={`${badgeColor} text-white text-xs font-semibold px-2 py-1 rounded`}
        >
          {eventTypeLabel[post.eventType]}
        </span>
        <h3 className="text-lg font-bold">{post.title}</h3>
      </div>

      {/* Período do evento, centralizado, com borda inferior separando do conteúdo */}
      <div className="px-4 pb-3 text-center border-b border-gray-200">
        <span className="text-sm text-gray-500">
          {formatEventPeriod(post.startDate, post.endDate)}
        </span>
      </div>

      {/* Conteúdo do post, truncado em 5 linhas independente do tamanho do texto */}
      <div className="px-4 py-3">
        <p className="line-clamp-5 whitespace-pre-line text-sm text-gray-700">
          {post.content}
        </p>
      </div>
    </div>
  );
}
