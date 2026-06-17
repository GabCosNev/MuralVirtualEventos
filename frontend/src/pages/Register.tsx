import { Link } from 'react-router-dom';
import { useRegisterForm } from '../hooks/useRegisterForm';

export default function Register() {
  const {
    name, setName,
    email, setEmail,
    password, setPassword,
    confirmPassword, setConfirmPassword,
    error,
    successMessage,
    isLoading,
    handleSubmit,
  } = useRegisterForm();

  return (
    <div className="min-h-screen bg-[var(--color-dark)] flex items-center justify-center">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg border-2 border-white">

        {/* Barra do título */}
        <div className="bg-[var(--color-primary)] px-6 py-4 rounded-tl-xl rounded-tr-xl">
          <h1 className="text-white text-xl font-bold">Cadastro</h1>
        </div>

        {/* Formulário */}
        <div className="px-6 py-8 flex flex-col gap-5">

          {/* Campo nome */}
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-700">Nome</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
            />
          </div>

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

          {/* Campo confirmar senha */}
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-700">Confirmar Senha</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
            />
          </div>

          {/* Mensagens de erro e sucesso */}
          {error && <p className="text-red-500 text-sm">{error}</p>}
          {successMessage && <p className="text-green-600 text-sm">{successMessage}</p>}

          {/* Botão de submit */}
          <button
            onClick={handleSubmit}
            disabled={isLoading}
            className="w-full bg-[var(--color-secondary)] text-white font-semibold py-2 rounded-lg hover:opacity-90 transition disabled:opacity-50">
            {isLoading ? 'Cadastrando...' : 'Cadastrar'}
          </button>

          {/* Link para login */}
          <p className="text-sm text-center text-gray-500">
            Tem conta ? {' '}
            <Link to="/login" className="text-[var(--color-primary)] font-medium hover:underline">
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
