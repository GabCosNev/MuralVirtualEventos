import { Link } from "react-router-dom";
import { useVerifyEmail } from "../hooks/auth/useVerifyEmail";
import { buttonRegisterLogin } from "../utils/styles";

export function VerifyEmail() {
  const { status } = useVerifyEmail();

  return (
    <div className="min-h-screen bg-[var(--color-dark)] flex items-center justify-center">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg border-2 border-white">
        {/* Barra do título */}
        <div className="bg-[var(--color-primary)] px-6 py-4 rounded-tl-xl rounded-tr-xl">
          <h1 className="text-white text-xl font-bold">
            Verificação de e-mail
          </h1>
        </div>

        {/* Conteúdo */}
        <div className="px-6 py-8 flex flex-col gap-5 items-center text-center">
          {status === "loading" && (
            <p className="text-gray-700">Verificando seu e-mail...</p>
          )}

          {status === "expired" && (
            <p className="text-gray-700">
              Este link expirou. Solicite um novo e-mail de verificação.
            </p>
          )}

          {status === "invalid" && (
            <p className="text-gray-700">
              Este link é inválido ou já foi utilizado.
            </p>
          )}

          {status !== "loading" && (
            <Link to="/login" className={buttonRegisterLogin}>
              Voltar para o login
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
