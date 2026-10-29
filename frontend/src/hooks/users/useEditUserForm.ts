import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  getMe,
  updateMe,
  deleteAccount,
  uploadAvatar,
} from "../../services/users.services";
import { useAuth } from "../auth/useAuth";
import { cropImageToFile, type CropArea } from "../../utils/cropImage";
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

  const [avatarError, setAvatarError] = useState("");
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const [cropSrc, setCropSrc] = useState<string | null>(null);

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

  useEffect(() => {
    return () => {
      if (cropSrc) URL.revokeObjectURL(cropSrc);
    };
  }, [cropSrc]);

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
        ? { name, actualPassword, password, confirmPassword }
        : { name };

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

  async function handleAvatarChange(file: File): Promise<boolean> {
    setAvatarError("");
    setIsUploadingAvatar(true);
    try {
      const result = await uploadAvatar(file);
      setAvatar(result.avatar);
      updateUser(await getMe());
      toast.success("Foto atualizada");
      return true;
    } catch (e: unknown) {
      const err = e as {
        response?: { data?: { message?: string | string[] } };
      };
      const message = err.response?.data?.message;
      setAvatarError(
        Array.isArray(message)
          ? message[0]
          : (message ?? "Erro ao enviar a imagem"),
      );
      return false;
    } finally {
      setIsUploadingAvatar(false);
    }
  }

  function openCrop(file: File) {
    setAvatarError("");
    setCropSrc(URL.createObjectURL(file));
  }

  function cancelCrop() {
    setAvatarError("");
    setCropSrc(null);
  }

  async function confirmCrop(area: CropArea) {
    if (!cropSrc) return;

    let file: File;
    try {
      file = await cropImageToFile(cropSrc, area);
    } catch {
      setAvatarError("Não foi possível processar a imagem");
      return;
    }

    const ok = await handleAvatarChange(file);
    if (ok) setCropSrc(null);
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
    avatarError,
    isUploadingAvatar,
    cropSrc,
    openCrop,
    cancelCrop,
    confirmCrop,
  };
}
