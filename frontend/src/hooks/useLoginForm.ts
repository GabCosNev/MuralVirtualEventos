import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './useAuth';
import { getMe, loginUser } from '@/Services/auth.service';

export function useLoginForm(){
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(){
    setIsLoading(true);
    try {
      const tokenResponse = await loginUser({email, password})
      const token = tokenResponse.data.access_token;
      localStorage.setItem('token', token)
      const userResponse = await getMe();
      const user = userResponse.data;
      login(token, user);
      navigate('/');
    }
    catch(e: unknown) {
    const err = e as { response?: { data?: { message?: string } } };
    setError(err.response?.data?.message ?? 'Erro ao fazer login');
  }
    finally {
    setIsLoading(false)
  }

}
  return { email, setEmail, password, setPassword, error, isLoading, handleSubmit};
}
