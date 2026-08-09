import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../auth/useAuth";
import { loginUser } from "../../services/auth.service";
import { getMe } from "../../services/users.services";

export function useLoginForm() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit() {
    if (!turnstileToken)
      return setError(
        "Verificação de segurança pendente. Aguarde ou recarregue a página.",
      );

    setIsLoading(true);
    setError("");

    try {
      const { access_token } = await loginUser({
        email,
        password,
        turnstileToken,
      });

      localStorage.setItem("token", access_token);

      const user = await getMe();

      login(access_token, user);
      navigate("/");
    } catch (e: unknown) {
      const err = e as { response?: { data?: { message?: string } } };
      setError(err.response?.data?.message ?? "Erro ao fazer login");
      setTurnstileToken(null);
    } finally {
      setIsLoading(false);
    }
  }

  return {
    email,
    setEmail,
    password,
    setPassword,
    setTurnstileToken,
    error,
    isLoading,
    handleSubmit,
  };
}
