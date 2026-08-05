import { useState } from "react";
import { useMyPosts } from "../hooks/posts/useMyPosts";
import {
  getTotalPages,
  getPageItems,
  getPageWindow,
} from "../utils/pagination";
import { PostCard } from "../components/PostCard";
import { EditPostModal } from "../components/EditPostModal";
import { paginationButton } from "../utils/styles";

export function MyPosts() {
  const { posts, isFetching, error, refetch } = useMyPosts();
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedPostId, setSelectedPostId] = useState<number | null>(null);
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
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4">
            {postsOnPage.map((post) => (
              <PostCard
                key={post.id}
                post={post}
                onClick={() => setSelectedPostId(post.id)}
              />
            ))}

            {postsOnPage.length === 0 && (
              <p className="text-center text-white/60 col-span-full">
                Você ainda não publicou nada.
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

      <EditPostModal
        postId={selectedPostId}
        open={selectedPostId !== null}
        onOpenChange={(isOpen) => {
          if (!isOpen) setSelectedPostId(null);
        }}
        refetch={refetch}
      />
    </div>
  );
}
