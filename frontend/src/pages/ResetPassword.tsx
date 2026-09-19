import { Link } from "react-router-dom";
import { useResetPassword } from "../hooks/auth/useResetPassword";
import {
  buttonEffectConfirm,
  buttonRegisterLogin,
  inputStyle,
} from "../utils/styles";

export function ResetPassword() {
  const {
    status,
    newPassword,
    setNewPassword,
    confirmPassword,
    setConfirmPassword,
    error,
    isLoading,
    handleSubmit,
  } = useResetPassword();

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg border-2 border-white">
        <div className="bg-[var(--color-primary)] px-6 py-4 rounded-tl-xl rounded-tr-xl">
          <h1 className="text-white text-xl font-bold">Redefinir senha</h1>
        </div>

        {status !== "form" && (
          <div className="px-6 py-8 flex flex-col gap-5 items-center text-center">
            {status === "expired" && (
              <p className="text-gray-700">
                Este link expirou. Solicite um novo link de redefinição de
                senha.
              </p>
            )}

            {status === "invalid" && (
              <p className="text-gray-700">
                Este link é inválido ou já foi utilizado.
              </p>
            )}

            <Link to="/login" className={buttonRegisterLogin}>
              Voltar para o login
            </Link>
          </div>
        )}

        {status === "form" && (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSubmit();
            }}
            className="px-6 py-8 flex flex-col gap-5"
          >
            <div className="flex flex-col gap-1">
              <label
                htmlFor="newPassword"
                className="text-sm font-medium text-gray-700"
              >
                Nova senha
              </label>

              <input
                id="newPassword"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className={inputStyle}
              />
            </div>

            <div className="flex flex-col gap-1">
              <label
                htmlFor="confirmPassword"
                className="text-sm font-medium text-gray-700"
              >
                Confirmar nova senha
              </label>

              <input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className={inputStyle}
              />
            </div>

            {error && <p className="text-sm text-red-500">{error}</p>}

            <button
              type="submit"
              disabled={isLoading}
              className={buttonEffectConfirm}
            >
              {isLoading ? "Salvando..." : "Redefinir senha"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
