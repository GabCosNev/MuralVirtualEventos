import { useState } from "react";
import { registerUser } from "../../services/auth.service";
import { toast } from "sonner";

export function useRegisterForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit() {
    if (password !== confirmPassword)
      return setError("As senhas não coincidem");

    if (!turnstileToken)
      return setError(
        "Verificação de segurança pendente. Aguarde ou recarregue a página.",
      );

    setIsLoading(true);
    try {
      await registerUser({
        name,
        email,
        password,
        confirmPassword,
        turnstileToken,
      });
      setName("");
      setEmail("");
      setPassword("");
      setConfirmPassword("");
      setTurnstileToken(null);
      toast.success("Cadastro realizado! Verifique seu e-mail.");
    } catch (e: unknown) {
      const err = e as { response?: { data?: { message?: string } } };
      setError(err.response?.data?.message ?? "Erro ao fazer o registro");
      setTurnstileToken(null);
    } finally {
      setIsLoading(false);
    }
  }
  return {
    name,
    setName,
    email,
    setEmail,
    password,
    setPassword,
    confirmPassword,
    setConfirmPassword,
    turnstileToken,
    setTurnstileToken,
    error,
    isLoading,
    handleSubmit,
  };
}
