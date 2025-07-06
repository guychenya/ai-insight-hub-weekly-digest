import React from 'react';
import { useAuth } from '../hooks/useAuth';
import { IconGitHub, IconLogOut } from './IconComponents';

const Auth: React.FC = () => {
  const { user, login, logout, loading } = useAuth();

  if (loading) {
    return <div className="w-24 h-10 bg-gray-700 rounded-lg animate-pulse" />;
  }

  if (user) {
    return (
      <div className="flex items-center gap-3">
        <span className="text-sm font-medium text-gray-300 hidden sm:inline">
          Welcome, {user.name}
        </span>
        <img
          src={user.avatarUrl}
          alt={user.name}
          className="w-8 h-8 rounded-full border-2 border-gray-600"
        />
        <button
          onClick={logout}
          aria-label="Logout"
          className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg transition-colors"
        >
          <IconLogOut className="w-5 h-5" />
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={login}
      className="inline-flex items-center gap-2 px-4 py-2 text-sm font-bold text-white bg-gray-800 border border-gray-700 rounded-lg hover:bg-gray-700 transition-colors"
    >
      <IconGitHub className="w-5 h-5" />
      <span>Login with GitHub</span>
    </button>
  );
};

export default Auth;
