import { Loader2 } from "lucide-react";
import { useEditForm } from "../hooks/useEditForm";

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
    successMessage,
    isFetching,
    isLoading,
    handleSubmit,
  } = useEditForm();

  if (isFetching) {
    return (
      <div className="min-h-screen bg-[var(--color-dark)] flex items-center justify-center">
        <Loader2 className="animate-spin text-white w-8 h-8" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--color-dark)] flex items-center justify-center">
      <div className="w-full max-w-lg bg-white rounded-xl shadow-lg border-2 border-white">
        {/* Barra do título */}
        <div className="bg-[var(--color-primary)] px-6 py-4 rounded-tl-xl rounded-tr-xl">
          <h1 className="text-white text-xl font-bold">Editar Perfil</h1>
        </div>

        {/* Formulário  */}
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
          {/* Campo avatar */}
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
          {/* Botão toggle de senha */}
          <button
            type="button"
            onClick={handleTogglePasswordChange}
            className="text-sm text-[var(--color-primary)] font-medium hover:underline text-left"
          >
            {isChangingPassword ? "Cancelar troca de senha" : "Alterar senha"}
          </button>

          {/* Campos de senha — só aparecem quando toggle está ativo */}
          {isChangingPassword && (
            <div className="flex flex-col gap-5">
              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium text-gray-700">
                  Senha atual
                </label>
                <input
                  type="password"
                  value={actualPassword}
                  onChange={(e) => setActualPassword(e.target.value)}
                  className="border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium text-gray-700">
                  Nova senha
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium text-gray-700">
                  Confirmar nova senha
                </label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                />
              </div>
            </div>
          )}
          {/* Mensagem de erro */}
          {error && <p className="text-red-500 text-sm">{error}</p>}

          {/* Mensagem de sucesso */}
          {successMessage && (
            <p className="text-green-500 text-sm">{successMessage}</p>
          )}

          {/* Botão de submit */}
          <button
            type="button"
            onClick={handleSubmit}
            disabled={isLoading}
            className="w-full bg-[var(--color-secondary)] text-white font-semibold py-2 rounded-lg hover:opacity-90 transition disabled:opacity-50"
          >
            {isLoading ? "Salvando..." : "Salvar alterações"}
          </button>
        </div>
      </div>
    </div>
  );
}
