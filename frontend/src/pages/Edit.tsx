import { Loader2 } from "lucide-react";
import { useEditUserForm } from "../hooks/users/useEditUserForm";
import { buttonEffectConfirm } from "../utils/styles";
import { PasswordInput } from "../components/PasswordInput";
import { useAuth } from "../hooks/auth/useAuth";
import { DeleteAccountView } from "../components/DeleteAccountView";

export function Edit() {
  const {
    name,
    setName,
    avatar,
    setAvatar,
    isChangingPassword,
    handleTogglePasswordChange,
    actualPassword,
    setActualPassword,
    password,
    setPassword,
    confirmPassword,
    setConfirmPassword,
    error,
    isFetching,
    isLoading,
    handleSubmit,
    view,
    deletePassword,
    setDeletePassword,
    deleteError,
    isDeleting,
    openDeleteView,
    cancelDelete,
    handleDelete,
  } = useEditUserForm();

  const { isAdmin } = useAuth();

  if (isFetching) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="animate-spin text-white w-8 h-8" />
      </div>
    );
  }

  if (view === "confirmDelete") {
    return (
      <DeleteAccountView
        password={deletePassword}
        onPasswordChange={setDeletePassword}
        error={deleteError}
        isLoading={isDeleting}
        onConfirm={handleDelete}
        onCancel={cancelDelete}
      />
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-full max-w-lg bg-white rounded-xl shadow-lg border-2 border-white">
        <div className="bg-[var(--color-primary)] px-6 py-4 rounded-tl-xl rounded-tr-xl">
          <h1 className="text-white text-xl font-bold">Editar Perfil</h1>
        </div>

        <div className="px-6 py-8 flex flex-col gap-5">
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-700">Nome</label>

            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-700">
              Avatar (URL)
            </label>

            <input
              type="text"
              value={avatar}
              onChange={(e) => setAvatar(e.target.value)}
              placeholder="https://..."
              className="border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
            />
          </div>

          <button
            type="button"
            onClick={handleTogglePasswordChange}
            className="text-sm text-[var(--color-primary)] font-medium cursor-pointer hover:underline text-left"
          >
            {isChangingPassword ? "Cancelar troca de senha" : "Alterar senha"}
          </button>

          {isChangingPassword && (
            <div className="flex flex-col gap-5">
              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium text-gray-700">
                  Senha atual
                </label>

                <PasswordInput
                  value={actualPassword}
                  onChange={(e) => setActualPassword(e.target.value)}
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium text-gray-700">
                  Nova senha
                </label>

                <PasswordInput
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium text-gray-700">
                  Confirmar nova senha
                </label>

                <PasswordInput
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </div>
            </div>
          )}

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <button
            type="button"
            onClick={handleSubmit}
            disabled={isLoading}
            className={buttonEffectConfirm}
          >
            {isLoading ? "Salvando..." : "Salvar alterações"}
          </button>

          {!isAdmin && (
            <button
              type="button"
              onClick={openDeleteView}
              className="text-sm text-red-600 font-medium cursor-pointer hover:underline text-center"
            >
              Excluir minha conta
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
