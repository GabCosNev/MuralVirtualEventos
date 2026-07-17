import { useState } from "react";
import { registerUser } from "../Services/auth.service";
import { toast } from "sonner";

export function useRegisterForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit() {
    if (password !== confirmPassword)
      return setError("As senhas não coincidem");

    setIsLoading(true);
    try {
      await registerUser({ name, email, password, confirmPassword });
      setName("");
      setEmail("");
      setPassword("");
      setConfirmPassword("");
      toast.success("Cadastro realizado com sucesso!");
    } catch (e: unknown) {
      const err = e as { response?: { data?: { message?: string } } };
      setError(err.response?.data?.message ?? "Erro ao fazer o registro");
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
    error,
    isLoading,
    handleSubmit,
  };
}
