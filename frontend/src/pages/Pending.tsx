import { useState } from "react";
import { type Post } from "../types";
import { usePendingPosts } from "../hooks/posts/usePendingPosts";
import { useAuth } from "../hooks/auth/useAuth";
import {
  getTotalPages,
  getPageItems,
  getPageWindow,
} from "../utils/pagination";
import { PostCard } from "../components/PostCard";
import { PostDetailModal } from "../components/PostDetailModal";
import { paginationButton } from "../utils/styles";

export function Pending() {
  const { posts, isFetching, error, refetch } = usePendingPosts();
  const { isAdmin } = useAuth();
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);

  const totalPages = getTotalPages(posts.length);
  const postsOnPage = getPageItems(posts, currentPage);
  const pageWindow = getPageWindow(currentPage, totalPages);

  return (
    <div className="p-6 pb-20">
      {isFetching && (
        <p className="text-center text-white/60">Carregando publicações...</p>
      )}

      {error && <p className="text-center text-red-500">{error}</p>}

      {!isFetching && !error && (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {postsOnPage.map((post) => (
              <PostCard
                key={post.id}
                post={post}
                onClick={() => setSelectedPost(post)}
              />
            ))}

            {postsOnPage.length === 0 && (
              <p className="text-center text-white/60 col-span-full">
                Nenhuma publicação pendente encontrada.
              </p>
            )}
          </div>

          {totalPages > 0 && (
            <div className="fixed bottom-0 left-0 w-full flex justify-center items-center gap-2 py-4 bg-[var(--color-dark)]">
              <button
                onClick={() => setCurrentPage(1)}
                disabled={currentPage === 1}
                className={paginationButton}
              >
                {"<<"}
              </button>

              <button
                onClick={() => setCurrentPage((page) => page - 1)}
                disabled={currentPage === 1}
                className={paginationButton}
              >
                {"<"}
              </button>

              {pageWindow.map((page) => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`px-3 py-1 rounded-md text-sm transition-colors ${
                    page === currentPage
                      ? "bg-white/20 font-semibold text-white"
                      : "hover:bg-white/10 text-white"
                  }`}
                >
                  {page}
                </button>
              ))}

              <button
                onClick={() => setCurrentPage((page) => page + 1)}
                disabled={currentPage === totalPages}
                className={paginationButton}
              >
                {">"}
              </button>

              <button
                onClick={() => setCurrentPage(totalPages)}
                disabled={currentPage === totalPages}
                className={paginationButton}
              >
                {">>"}
              </button>
            </div>
          )}
        </>
      )}

      <PostDetailModal
        post={selectedPost}
        open={selectedPost !== null}
        onOpenChange={(isOpen) => {
          if (!isOpen) setSelectedPost(null);
        }}
        refetch={refetch}
        isAdmin={isAdmin}
      />
    </div>
  );
}
