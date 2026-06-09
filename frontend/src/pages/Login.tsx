import { useState, type SubmitEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import api from '../Services/api';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: SubmitEvent) {
      e.preventDefault();
      setError('');
      setLoading(true);

      try {
        const { data } = await api.post('/auth/login', { email, password });
        login(data.token, data.user);
        navigate('/');
      } catch {
        setError('E-mail ou senha inválidos.');
      } finally {
        setLoading(false);
      }
    }
  return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-md p-8">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Entrar</h1>
          <p className="text-sm text-gray-500 mb-6">Acesse o mural de eventos</p>
        </div>
      </div>
    );
}
