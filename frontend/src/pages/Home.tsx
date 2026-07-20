import { useState } from "react";
import { useApprovedPosts } from "../hooks/useApprovdePosts";
import { useAuth } from "../hooks/useAuth";
import {
  getTotalPages,
  getPageItems,
  getPageWindow,
} from "../utils/pagination";
import { PostCard } from "../components/PostCard";
import { CreatePostCard } from "../components/CreatePostCard";
import { CreatePostModal } from "../components/CreatePostModal";

const paginationButton =
  "px-2 py-1 rounded-md text-sm text-white bg-[var(--color-dark)] disabled:opacity-30 disabled:cursor-not-allowed hover:bg-white/10 transition-colors";

export default function Home() {
  const { posts, isFetching, error } = useApprovedPosts();
  const { isAdmin } = useAuth();
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);

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
            {currentPage === 1 && !isAdmin && (
              <CreatePostCard onClick={() => setIsModalOpen(true)} />
            )}

            {postsOnPage.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}

            {postsOnPage.length === 0 && !(currentPage === 1 && !isAdmin) && (
              <p className="text-center text-white/60 col-span-full">
                Nenhuma publicação encontrada.
              </p>
            )}
          </div>

          {totalPages > 0 && (
            <div className="fixed bottom-0 left-0 w-full flex justify-center items-center gap-2 py-4 bg-[var(--color-dark)]">
              {/* Ir para primeira página */}
              <button
                onClick={() => setCurrentPage(1)}
                disabled={currentPage === 1}
                className={paginationButton}
              >
                {"<<"}
              </button>

              {/* Página anterior */}
              <button
                onClick={() => setCurrentPage((page) => page - 1)}
                disabled={currentPage === 1}
                className={paginationButton}
              >
                {"<"}
              </button>

              {/* Números da janela deslizante */}
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

              {/* Próxima página */}
              <button
                onClick={() => setCurrentPage((page) => page + 1)}
                disabled={currentPage === totalPages}
                className={paginationButton}
              >
                {">"}
              </button>

              {/* Ir para última página */}
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

      <CreatePostModal open={isModalOpen} onOpenChange={setIsModalOpen} />
    </div>
  );
}
