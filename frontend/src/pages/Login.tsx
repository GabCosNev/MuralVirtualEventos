
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
  return (
  <div className="min-h-screen bg-[var(--color-dark)] flex items-center justify-center">
    <div className="w-full max-w-md bg-white rounded-xl shadow-lg border-2 border-white">

      {/* Barra do título */}
      <div className="bg-[var(--color-primary)] px-6 py-4 rounded-tl-xl rounded-tr-xl">
        <h1 className="text-white text-xl font-bold">Login</h1>
      </div>

      {/* Formulário */}
      <div className="px-6 py-8 flex flex-col gap-5">

        {/* Campo email */}
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-gray-700">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
          />
        </div>

        {/* Campo senha */}
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-gray-700">Senha</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
          />
        </div>

        {/* Mensagem de erro */}
        {error && <p className="text-red-500 text-sm">{error}</p>}

        {/* Botão de submit */}
        <button
          onClick={HandleSubmit}
          disabled={isLoading}
          className="w-full bg-[var(--color-secondary)] text-white font-semibold py-2 rounded-lg hover:opacity-90 transition disabled:opacity-50">
          {isLoading ? 'Entrando...' : 'Entrar'}
        </button>

        {/* Link para registro */}
        <p className="text-sm text-center text-gray-500">
          Não tem conta?{' '}
          <Link to="/register" className="text-[var(--color-primary)] font-medium hover:underline">
            Cadastre-se
          </Link>
        </p>

      </div>
    </div>
  </div>
);
}
