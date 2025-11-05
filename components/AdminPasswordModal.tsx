import React, { useState, useEffect, useRef } from 'react';
import { XIcon, ShieldCheckIcon } from './icons';

interface AdminPasswordModalProps {
  onClose: () => void;
  onLogin: (password: string) => boolean;
}

const AdminPasswordModal: React.FC<AdminPasswordModalProps> = ({ onClose, onLogin }) => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
    
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleEsc);
    return () => {
      window.removeEventListener('keydown', handleEsc);
    };
  }, [onClose]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const success = onLogin(password);
    if (!success) {
      setError('Senha incorreta. Tente novamente.');
      setPassword('');
      inputRef.current?.focus();
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4"
         role="dialog" aria-modal="true" aria-labelledby="admin-modal-title">
        <div className="bg-white rounded-lg shadow-2xl w-full max-w-sm" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
                <h2 id="admin-modal-title" className="text-lg font-bold text-primary flex items-center gap-2">
                    <ShieldCheckIcon className="h-6 w-6"/> Acesso Restrito
                </h2>
                <button
                    onClick={onClose}
                    className="p-2 rounded-full text-gray-400 hover:bg-gray-200 hover:text-gray-600 transition-colors focus:outline-none focus:ring-2 focus:ring-primary"
                    aria-label="Fechar"
                >
                    <XIcon className="h-5 w-5" />
                </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
                <p className="text-sm text-gray-600">
                    Por favor, insira a senha de administrador para continuar.
                </p>
                <div>
                    <label htmlFor="admin-password" className="sr-only">Senha de Administrador</label>
                    <input
                        ref={inputRef}
                        id="admin-password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                        placeholder="••••••••"
                    />
                </div>
                {error && <p className="text-sm text-red-600">{error}</p>}
                <button
                    type="submit"
                    className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                >
                    Confirmar
                </button>
            </form>
        </div>
    </div>
  );
};

export default AdminPasswordModal;
