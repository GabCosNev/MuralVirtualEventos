import { useState, useEffect } from "react";
import { getMe, updateMe } from "../../services/users.services";
import { useAuth } from "../auth/useAuth";
import { toast } from "sonner";

export function useEditUserForm() {
  const [name, setName] = useState("");
  const [avatar, setAvatar] = useState("");

  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [actualPassword, setActualPassword] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [error, setError] = useState("");
  const [isFetching, setIsFetching] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const { updateUser } = useAuth();

  useEffect(() => {
    async function fetchUser() {
      try {
        const response = await getMe();
        setName(response.name);
        setAvatar(response.avatar ?? "");
      } catch (e: unknown) {
        const err = e as { response?: { data?: { message?: string } } };
        setError(err.response?.data?.message ?? "Erro ao carregar perfil");
      } finally {
        setIsFetching(false);
      }
    }
    fetchUser();
  }, []);

  function handleTogglePasswordChange() {
    setIsChangingPassword((prev) => !prev);
    setActualPassword("");
    setPassword("");
    setConfirmPassword("");
  }

  async function handleSubmit() {
    setError("");

    if (isChangingPassword && password !== confirmPassword) {
      return setError("As senhas não coincidem");
    }

    setIsLoading(true);
    try {
      const payload = isChangingPassword
        ? { name, avatar, actualPassword, password, confirmPassword }
        : { name, avatar };

      const response = await updateMe(payload);
      updateUser(response);

      setActualPassword("");
      setPassword("");
      setConfirmPassword("");
      setIsChangingPassword(false);
      toast.success("Perfil atualizado com sucesso!");
    } catch (e: unknown) {
      const err = e as { response?: { data?: { message?: string } } };
      setError(err.response?.data?.message ?? "Erro ao atualizar perfil");
    } finally {
      setIsLoading(false);
    }
  }

  return {
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
    isFetching,
    isLoading,
    handleSubmit,
  };
}
