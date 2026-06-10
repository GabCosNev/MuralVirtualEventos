import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export default function Navbar() {
  const { user, isAdmin, logout } = useAuth();
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  function handleLogout() {
    logout();
    navigate('/login');
  }

  return (
    <nav className="w-full bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between">

      <Link to="/" className="flex items-center gap-2">
        <span className="text-xl font-bold text-blue-600">MuralVirtual</span>
      </Link>

      <div className="flex items-center gap-6">
        <Link to="/" className="text-sm text-gray-600 hover:text-blue-600 transition">
          Home
        </Link>
        <Link to="/my-posts" className="text-sm text-gray-600 hover:text-blue-600 transition">
          Meus Posts
        </Link>
        {isAdmin && (
          <Link to="/admin" className="text-sm text-gray-600 hover:text-blue-600 transition">
            Admin
          </Link>
        )}
      </div>

      <div className="flex items-center gap-4 relative">
        <span className="text-sm text-gray-700 font-medium">{user?.name}</span>

        <button onClick={() => setDropdownOpen(!dropdownOpen)} className="focus:outline-none">
          {user?.avatar ? (
            <img src={user.avatar} alt="Avatar" className="w-8 h-8 rounded-full object-cover" />
          ) : (
            <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white text-sm font-bold cursor-pointer">
              {user?.name?.charAt(0).toUpperCase()}
            </div>
          )}
        </button>

        {dropdownOpen && (
          <div className="absolute right-0 top-10 w-40 bg-white border border-gray-200 rounded-xl shadow-lg py-2 z-50">
            <Link to="/config" onClick={() => setDropdownOpen(false)} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
              Editar perfil
            </Link>
            <button onClick={handleLogout} className="w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-gray-50">
              Sair
            </button>
          </div>
        )}
      </div>

    </nav>
  );
}
