import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../auth/useAuth";
import {
  loginUser,
  resendVerificationEmail,
  forgotPassword,
} from "../../services/auth.service";
import type { TurnstileInstance } from "@marsidev/react-turnstile";
import type { LoginViewMode } from "../../types/auth.types";

export function useLoginForm() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [viewMode, setViewMode] = useState<LoginViewMode>("login");
  const [resendError, setResendError] = useState("");
  const [forgotPasswordError, setForgotPasswordError] = useState("");
  const turnstileRef = useRef<TurnstileInstance>(null);

  async function handleSubmit() {
    if (!turnstileToken)
      return setError(
        "Verificação de segurança pendente. Aguarde ou recarregue a página.",
      );

    setIsLoading(true);
    setError("");

    try {
      const { user } = await loginUser({ email, password, turnstileToken });

      login(user);
      navigate("/");
    } catch (e: unknown) {
      const err = e as {
        response?: { data?: { message?: string; errorCode?: string } };
      };

      if (err.response?.data?.errorCode === "EMAIL_NOT_VERIFIED") {
        setViewMode("emailNotVerified");
        setTurnstileToken(null);
        turnstileRef.current?.reset();
        return;
      }

      setError(err.response?.data?.message ?? "Erro ao fazer login");
      setTurnstileToken(null);
      turnstileRef.current?.reset();
    } finally {
      setIsLoading(false);
    }
  }

  async function resendVerification() {
    setResendError("");

    try {
      await resendVerificationEmail(email);
    } catch {
      setResendError("Verificação de e-mail fora do ar, tente mais tarde.");
    }
  }

  async function handleForgotPassword() {
    if (!turnstileToken)
      return setForgotPasswordError(
        "Verificação de segurança pendente. Aguarde ou recarregue a página.",
      );

    setIsLoading(true);
    setForgotPasswordError("");

    try {
      await forgotPassword({ email, turnstileToken });
      setViewMode("forgotPasswordSent");
    } catch {
      setForgotPasswordError(
        "Não foi possível processar sua solicitação, tente novamente.",
      );
      setTurnstileToken(null);
      turnstileRef.current?.reset();
    } finally {
      setIsLoading(false);
    }
  }

  function goToForgotPassword() {
    setViewMode("forgotPassword");
    setError("");
    setForgotPasswordError("");
    setTurnstileToken(null);
  }

  function backToLogin() {
    setViewMode("login");
    setResendError("");
    setForgotPasswordError("");
    setTurnstileToken(null);
  }

  return {
    email,
    setEmail,
    password,
    setPassword,
    setTurnstileToken,
    turnstileRef,
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
  };
}
