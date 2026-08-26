import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../auth/useAuth";
import { loginUser } from "../../services/auth.service";
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

  function backToLogin() {
    setViewMode("login");
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
    backToLogin,
    handleSubmit,
  };
}
