import { useState, useEffect } from 'react';
import { getMe, updateMe } from '../Services/users.services';

export function useEditForm() {

  // Campos editáveis simples — sempre visíveis no formulário
  const [name, setName] = useState('');
  const [avatar, setAvatar] = useState('');

  // Bloco de senha: isChangingPassword controla se os 3 campos abaixo
  // aparecem na tela. Começam vazios pois não fazem parte da edição
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [actualPassword, setActualPassword] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const [isFetching, setIsFetching] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  useEffect(() => {
    async function fetchUser() {
      try {
        const response = await getMe();
        setName(response.data.name);
        setAvatar(response.data.avatar ?? '');
      } catch (e: unknown) {
        const err = e as { response?: { data?: { message?: string } } };
        setError(err.response?.data?.message ?? 'Erro ao carregar perfil');
      } finally {
        setIsFetching(false);
      }
    }
    fetchUser();
  }, []);

  function handleTogglePasswordChange() {
    setIsChangingPassword((prev) => !prev);
    setActualPassword('');
    setPassword('');
    setConfirmPassword('');
  }

  async function handleSubmit() {
    setError('');
    setSuccessMessage('');
    if (isChangingPassword && password !== confirmPassword) {
      return setError('As senhas não coincidem');
    }

    setIsLoading(true);
    try {
      //Dúvida
      const payload = isChangingPassword
        ? { name, avatar, actualPassword, password, confirmPassword }
        : { name, avatar };

      await updateMe(payload);
      setActualPassword('');
      setPassword('');
      setConfirmPassword('');
      setIsChangingPassword(false);
      setSuccessMessage('Perfil atualizado com sucesso!');
    } catch (e: unknown) {
      const err = e as { response?: { data?: { message?: string } } };
      setError(err.response?.data?.message ?? 'Erro ao atualizar perfil');
    } finally {
      setIsLoading(false);
    }
  }

  return {
    name, setName,
    avatar, setAvatar,
    isChangingPassword, handleTogglePasswordChange,
    actualPassword, setActualPassword,
    password, setPassword,
    confirmPassword, setConfirmPassword,
    error,
    successMessage,
    isFetching,
    isLoading,
    handleSubmit,
  };
}
