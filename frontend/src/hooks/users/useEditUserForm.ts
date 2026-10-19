import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getMe, updateMe, deleteAccount } from "../../services/users.services";
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

  const [view, setView] = useState<"edit" | "confirmDelete">("edit");
  const [deletePassword, setDeletePassword] = useState("");
  const [deleteError, setDeleteError] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  const { updateUser, clearSession, isAdmin } = useAuth();
  const navigate = useNavigate();

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

  function openDeleteView() {
    setDeletePassword("");
    setDeleteError("");
    setView("confirmDelete");
  }

  function cancelDelete() {
    setDeletePassword("");
    setDeleteError("");
    setView("edit");
  }

  async function handleDelete() {
    if (!deletePassword) {
      return setDeleteError("Digite sua senha");
    }

    setDeleteError("");
    setIsDeleting(true);
    try {
      await deleteAccount(deletePassword);
      clearSession();
      toast.success("Conta excluída");
      navigate("/login", { replace: true });
    } catch (e: unknown) {
      const err = e as {
        response?: { data?: { message?: string | string[] } };
      };
      const message = err.response?.data?.message;
      setDeleteError(
        Array.isArray(message)
          ? message[0]
          : (message ?? "Erro ao excluir conta"),
      );
      setIsDeleting(false);
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
    isAdmin,
    view,
    deletePassword,
    setDeletePassword,
    deleteError,
    isDeleting,
    openDeleteView,
    cancelDelete,
    handleDelete,
  };
}
