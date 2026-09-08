import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "sonner";
import { resetPassword } from "../../services/auth.service";

export type ResetPasswordStatus = "form" | "invalid" | "expired";

export function useResetPassword() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get("token");

  const [status, setStatus] = useState<ResetPasswordStatus>(
    token ? "form" : "invalid",
  );
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit() {
    setError("");

    if (!token) {
      setStatus("invalid");
      return;
    }

    if (newPassword !== confirmPassword) {
      return setError("As senhas não coincidem");
    }

    setIsLoading(true);

    try {
      await resetPassword({ token, newPassword, confirmPassword });
      toast.success("Senha redefinida! Faça login com sua nova senha.");
      navigate("/login", { replace: true });
    } catch (e: unknown) {
      const err = e as {
        response?: { data?: { message?: string; errorCode?: string } };
      };
      const errorCode = err.response?.data?.errorCode;

      if (errorCode === "TOKEN_EXPIRED") {
        setStatus("expired");
      } else if (errorCode === "INVALID_TOKEN") {
        setStatus("invalid");
      } else {
        setError(err.response?.data?.message ?? "Erro ao redefinir senha");
      }
    } finally {
      setIsLoading(false);
    }
  }

  return {
    status,
    newPassword,
    setNewPassword,
    confirmPassword,
    setConfirmPassword,
    error,
    isLoading,
    handleSubmit,
  };
}
