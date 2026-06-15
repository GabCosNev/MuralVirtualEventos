
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { loginUser } from '../Services/auth.service';
import { getMe } from '../Services/auth.service';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  async function HandleSubmit(){
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
}
