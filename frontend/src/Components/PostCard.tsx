import { type Post } from "../types";
import { formatEventPeriod } from "../utils/formatDate";
import { eventTypeColor, eventTypeLabel } from "@/utils/eventCustom";

const positiveAction = "bg-green-600 text-white";
const destructiveAction = "bg-red-600 text-white";

interface PostCardProps {
  post: Post;
  onEdit?: () => void;
  onDelete?: () => void;
  onApprove?: () => void;
  onReject?: () => void;
}

export function PostCard({
  post,
  onEdit,
  onDelete,
  onApprove,
  onReject,
}: PostCardProps) {
  const badgeColor = eventTypeColor[post.eventType];

  return (
    <div className="rounded-lg shadow-md overflow-hidden">
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

      {/* Barra de ações do dono do post (MyPosts) */}
      {(onEdit || onDelete) && (
        <div className="flex justify-end gap-2 bg-gray-100 p-3">
          {onEdit && (
            <button
              onClick={onEdit}
              className={`${positiveAction} px-3 py-1 rounded`}
            >
              Editar
            </button>
          )}
          {onDelete && (
            <button
              onClick={onDelete}
              className={`${destructiveAction} px-3 py-1 rounded`}
            >
              Excluir
            </button>
          )}
        </div>
      )}

      {/* Barra de ações do admin (Pending/Admin) */}
      {(onApprove || onReject) && (
        <div className="flex justify-end gap-2 bg-gray-100 p-3">
          {onApprove && (
            <button
              onClick={onApprove}
              className={`${positiveAction} px-3 py-1 rounded`}
            >
              Aprovar
            </button>
          )}
          {onReject && (
            <button
              onClick={onReject}
              className={`${destructiveAction} px-3 py-1 rounded`}
            >
              Rejeitar
            </button>
          )}
        </div>
      )}
    </div>
  );
}
