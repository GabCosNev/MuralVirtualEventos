import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useLoginForm } from "../hooks/users/useLoginForm";
import {
  buttonEffectConfirm,
  buttonRegisterLogin,
  inputStyle,
} from "../utils/styles";
import { PasswordInput } from "../components/PasswordInput";
import { TurnstileWidget } from "../components/TurnstileWidget";

const RESEND_COOLDOWN_SECONDS = 60;

export function Login() {
  const {
    email,
    setEmail,
    password,
    setPassword,
    setTurnstileToken,
    error,
    isLoading,
    viewMode,
    resendError,
    resendVerification,
    forgotPasswordError,
    handleForgotPassword,
    goToForgotPassword,
    backToLogin,
    handleSubmit,
    turnstileRef,
  } = useLoginForm();

  const [cooldown, setCooldown] = useState(0);

  useEffect(() => {
    if (cooldown === 0) return;

    const interval = setInterval(() => {
      setCooldown((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [cooldown]);

  function handleResendClick() {
    setCooldown(RESEND_COOLDOWN_SECONDS);
    void resendVerification();
  }

  if (viewMode === "emailNotVerified") {
    return (
      <div className="min-h-screen bg-[var(--color-dark)] flex items-center justify-center">
        <div className="w-full max-w-md bg-white rounded-xl shadow-lg border-2 border-white">
          <div className="bg-[var(--color-primary)] px-6 py-4 rounded-tl-xl rounded-tr-xl">
            <h1 className="text-white text-xl font-bold">
              Verifique seu e-mail
            </h1>
          </div>

          <div className="px-6 py-8 flex flex-col gap-5 items-center text-center">
            <p className="text-gray-700">
              Sua conta ainda não foi verificada. Verifique sua caixa de
              entrada, ou solicite um novo e-mail de verificação.
            </p>

            {resendError && (
              <p className="text-red-500 text-sm">{resendError}</p>
            )}

            <button
              onClick={handleResendClick}
              disabled={cooldown > 0}
              className={buttonEffectConfirm}
            >
              {cooldown > 0 ? `Reenviar (${cooldown}s)` : "Reenviar e-mail"}
            </button>

            <button onClick={backToLogin} className={buttonRegisterLogin}>
              Voltar
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (viewMode === "forgotPasswordSent") {
    return (
      <div className="min-h-screen bg-[var(--color-dark)] flex items-center justify-center">
        <div className="w-full max-w-md bg-white rounded-xl shadow-lg border-2 border-white">
          <div className="bg-[var(--color-primary)] px-6 py-4 rounded-tl-xl rounded-tr-xl">
            <h1 className="text-white text-xl font-bold">
              Verifique seu e-mail
            </h1>
          </div>

          <div className="px-6 py-8 flex flex-col gap-5 items-center text-center">
            <p className="text-gray-700">
              Se esse e-mail estiver cadastrado, enviamos um link para
              redefinição de senha. Verifique sua caixa de entrada.
            </p>

            <button onClick={backToLogin} className={buttonRegisterLogin}>
              Voltar para o login
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (viewMode === "forgotPassword") {
    return (
      <div className="min-h-screen bg-[var(--color-dark)] flex items-center justify-center">
        <div className="w-full max-w-md bg-white rounded-xl shadow-lg border-2 border-white">
          <div className="bg-[var(--color-primary)] px-6 py-4 rounded-tl-xl rounded-tr-xl">
            <h1 className="text-white text-xl font-bold">Redefinir senha</h1>
          </div>

          <div className="px-6 py-8 flex flex-col gap-5">
            <p className="text-gray-700 text-sm">
              Informe seu e-mail para receber um link de redefinição de senha.
            </p>

            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-gray-700">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={inputStyle}
              />
            </div>

            <TurnstileWidget
              ref={turnstileRef}
              siteKey={import.meta.env.VITE_TURNSTILE_SITE_KEY_FORGOT_PASSWORD}
              onSuccess={(token: string) => setTurnstileToken(token)}
              onExpire={() => setTurnstileToken(null)}
            />

            {forgotPasswordError && (
              <p className="text-red-500 text-sm">{forgotPasswordError}</p>
            )}

            <button
              onClick={handleForgotPassword}
              disabled={isLoading}
              className={buttonEffectConfirm}
            >
              {isLoading ? "Enviando..." : "Enviar link"}
            </button>

            <button
              onClick={backToLogin}
              className={`${buttonRegisterLogin} !cursor-pointer`}
            >
              Voltar para o login
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--color-dark)] flex items-center justify-center">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg border-2 border-white">
        <div className="bg-[var(--color-primary)] px-6 py-4 rounded-tl-xl rounded-tr-xl">
          <h1 className="text-white text-xl font-bold">Login</h1>
        </div>

        <div className="px-6 py-8 flex flex-col gap-5">
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={inputStyle}
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-700">Senha</label>
            <PasswordInput
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <TurnstileWidget
            ref={turnstileRef}
            siteKey={import.meta.env.VITE_TURNSTILE_SITE_KEY_LOGIN}
            onSuccess={(token: string) => setTurnstileToken(token)}
            onExpire={() => setTurnstileToken(null)}
          />

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <button
            onClick={handleSubmit}
            disabled={isLoading}
            className={buttonEffectConfirm}
          >
            {isLoading ? "Entrando..." : "Entrar"}
          </button>

          <p className="text-sm text-center text-gray-500">
            Não tem conta ?{" "}
            <Link to="/register" className={buttonRegisterLogin}>
              Cadastre-se
            </Link>
          </p>

          <p className="text-sm text-center text-gray-500">
            <button
              onClick={goToForgotPassword}
              className={`${buttonRegisterLogin} cursor-pointer`}
            >
              Esqueceu a senha?
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
