import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  getMe,
  updateMe,
  deleteAccount,
  uploadAvatar,
  removeAvatar,
} from "../../services/users.services";
import { useAuth } from "../auth/useAuth";
import { cropImageToFile, type CropArea } from "../../utils/cropImage";
import { toast } from "sonner";

function getErrorMessage(e: unknown, fallback: string): string {
  const err = e as {
    response?: { data?: { message?: string | string[] } };
  };
  const message = err.response?.data?.message;
  return Array.isArray(message) ? message[0] : (message ?? fallback);
}

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
  const [cropSrc, setCropSrc] = useState<string | null>(null);
  const [pendingAvatarFile, setPendingAvatarFile] = useState<File | null>(null);
  const [pendingAvatarPreview, setPendingAvatarPreview] = useState<
    string | null
  >(null);
  const [pendingRemoveAvatar, setPendingRemoveAvatar] = useState(false);

  const { updateUser, clearSession, isAdmin } = useAuth();
  const navigate = useNavigate();

  const avatarPreview = pendingRemoveAvatar
    ? ""
    : (pendingAvatarPreview ?? avatar);

  useEffect(() => {
    async function fetchUser() {
      try {
        const response = await getMe();
        setName(response.name);
        setAvatar(response.avatar ?? "");
      } catch (e: unknown) {
        setError(getErrorMessage(e, "Erro ao carregar perfil"));
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

  useEffect(() => {
    return () => {
      if (pendingAvatarPreview) URL.revokeObjectURL(pendingAvatarPreview);
    };
  }, [pendingAvatarPreview]);

  function clearPendingAvatar() {
    setPendingAvatarFile(null);
    setPendingAvatarPreview(null);
    setPendingRemoveAvatar(false);
  }

  function handleTogglePasswordChange() {
    setIsChangingPassword((prev) => !prev);
    setActualPassword("");
    setPassword("");
    setConfirmPassword("");
  }

  async function handleSubmit() {
    setError("");
    setAvatarError("");

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
    } catch (e: unknown) {
      setError(getErrorMessage(e, "Erro ao atualizar perfil"));
      setIsLoading(false);
      return;
    }

    try {
      if (pendingAvatarFile) {
        const result = await uploadAvatar(pendingAvatarFile);
        setAvatar(result.avatar);
        clearPendingAvatar();
        updateUser(await getMe());
      } else if (pendingRemoveAvatar) {
        await removeAvatar();
        setAvatar("");
        clearPendingAvatar();
        updateUser(await getMe());
      }
      toast.success("Perfil atualizado com sucesso!");
    } catch (e: unknown) {
      setAvatarError(
        `Perfil salvo, mas a foto não foi atualizada: ${getErrorMessage(e, "erro ao enviar a imagem")}`,
      );
    } finally {
      setIsLoading(false);
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

    try {
      const file = await cropImageToFile(cropSrc, area);
      setPendingAvatarFile(file);
      setPendingAvatarPreview(URL.createObjectURL(file));
      setPendingRemoveAvatar(false);
      setCropSrc(null);
    } catch {
      setAvatarError("Não foi possível processar a imagem");
    }
  }

  function handleRemoveAvatar() {
    setAvatarError("");
    setPendingAvatarFile(null);
    setPendingAvatarPreview(null);
    setPendingRemoveAvatar(avatar !== "");
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
      setDeleteError(getErrorMessage(e, "Erro ao excluir conta"));
      setIsDeleting(false);
    }
  }

  return {
    name,
    setName,
    avatarPreview,
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
    cropSrc,
    openCrop,
    cancelCrop,
    confirmCrop,
    handleRemoveAvatar,
  };
}
