import { type Post } from "../types";
import { formatEventPeriod, isEventFinished } from "../utils/formatDate";
import { eventTypeColor, eventTypeLabel } from "../utils/eventCustom";

interface PostCardProps {
  post: Post;
  onClick: () => void;
}

export function PostCard({ post, onClick }: PostCardProps) {
  const badgeColor = eventTypeColor[post.eventType];
  const finished = isEventFinished(post.endDate);

  return (
    <div
      onClick={onClick}
      className={`${
        finished ? "bg-gray-200" : "bg-white"
      } rounded-lg shadow-md overflow-hidden cursor-pointer hover:opacity-90 transition-opacity`}
    >
      {/* Badge centralizado + título centralizado, ambos compactos */}
      <div className="px-3 pt-3 pb-2 flex flex-col items-center gap-1">
        <span
          className={`${badgeColor} text-white text-xs font-semibold px-2 py-1 rounded`}
        >
          {eventTypeLabel[post.eventType]}
        </span>
        <h3 className="text-base font-bold text-gray-900 text-center">
          {post.title}
        </h3>
      </div>

      {/* Período do evento, centralizado, com borda inferior separando do conteúdo */}
      <div className="px-3 pb-2 text-center border-b border-gray-200">
        <span className="text-sm text-gray-500">
          {formatEventPeriod(post.startDate, post.endDate)}
        </span>
      </div>

      {/* Conteúdo do post, truncado em 5 linhas independente do tamanho do texto */}
      <div className="px-3 py-5">
        <p className="line-clamp-5 whitespace-pre-line text-sm text-gray-700">
          {post.content}
        </p>
      </div>
    </div>
  );
}
