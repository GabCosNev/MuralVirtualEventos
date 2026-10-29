import { useRef, type ChangeEvent } from "react";
import { Loader2, User as UserIcon } from "lucide-react";
import { useEditUserForm } from "../hooks/users/useEditUserForm";
import { buttonEffectConfirm } from "../utils/styles";
import { PasswordInput } from "../components/PasswordInput";
import { useAuth } from "../hooks/auth/useAuth";
import { DeleteAccountView } from "../components/DeleteAccountView";
import { AvatarCropModal } from "../components/AvatarCropModal";

export function Edit() {
  const {
    name,
    setName,
    avatar,
    avatarError,
    isUploadingAvatar,
    cropSrc,
    openCrop,
    cancelCrop,
    confirmCrop,
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
  const fileInputRef = useRef<HTMLInputElement>(null);

  function onFileSelected(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) openCrop(file);
    e.target.value = "";
  }

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
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-4">
              {avatar ? (
                <img
                  src={avatar}
                  alt="Sua foto de perfil"
                  className="w-20 h-20 rounded-full object-cover border border-gray-300"
                />
              ) : (
                <div className="w-20 h-20 rounded-full bg-gray-200 flex items-center justify-center">
                  <UserIcon className="w-10 h-10 text-gray-500" />
                </div>
              )}

              <div className="flex flex-row flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isUploadingAvatar || isAdmin}
                  className="bg-[var(--color-primary)] text-white text-sm font-medium rounded-lg px-4 py-2 cursor-pointer hover:opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Trocar foto
                </button>

                {/* Visual apenas: ainda sem funcionalidade */}
                {avatar && (
                  <button
                    type="button"
                    disabled={isUploadingAvatar || isAdmin}
                    className="bg-red-600 text-white text-sm font-medium rounded-lg px-4 py-2 cursor-pointer hover:bg-red-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Remover foto
                  </button>
                )}
              </div>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={onFileSelected}
                className="hidden"
              />
            </div>

            {!cropSrc && avatarError && (
              <p className="text-red-500 text-sm">{avatarError}</p>
            )}
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-700">Nome</label>

            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
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

      {cropSrc && (
        <AvatarCropModal
          imageSrc={cropSrc}
          isLoading={isUploadingAvatar}
          error={avatarError}
          onConfirm={confirmCrop}
          onCancel={cancelCrop}
        />
      )}
    </div>
  );
}
