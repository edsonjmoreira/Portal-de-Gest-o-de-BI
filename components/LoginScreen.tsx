import React, { useState } from 'react';
import { ArrowRightOnRectangleIcon, UserPlusIcon, UserIcon, KeyIcon } from './icons';

interface LoginScreenProps {
  onLogin: (username: string, password: string) => { success: boolean, message: string };
  onRegister: (username: string, password: string) => { success: boolean, message: string };
}

const LoginScreen: React.FC<LoginScreenProps> = ({ onLogin, onRegister }) => {
  const [isLoginView, setIsLoginView] = useState(true);
  
  const [loginUsername, setLoginUsername] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  
  const [registerUsername, setRegisterUsername] = useState('');
  const [registerPassword, setRegisterPassword] = useState('');
  const [registerConfirmPassword, setRegisterConfirmPassword] = useState('');
  
  const [notification, setNotification] = useState<{ type: 'success' | 'error', message: string } | null>(null);

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setNotification(null);
    if (!loginUsername || !loginPassword) {
        setNotification({ type: 'error', message: 'Preencha todos os campos.' });
        return;
    }
    const result = onLogin(loginUsername, loginPassword);
    if (!result.success) {
        setNotification({ type: 'error', message: result.message });
    }
  };
  
  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setNotification(null);
    if (!registerUsername || !registerPassword || !registerConfirmPassword) {
        setNotification({ type: 'error', message: 'Preencha todos os campos.' });
        return;
    }
    if (registerPassword !== registerConfirmPassword) {
        setNotification({ type: 'error', message: 'As senhas não coincidem.' });
        return;
    }
    const result = onRegister(registerUsername, registerPassword);
    setNotification({ type: result.success ? 'success' : 'error', message: result.message });
    if(result.success) {
        setRegisterUsername('');
        setRegisterPassword('');
        setRegisterConfirmPassword('');
        setTimeout(() => setIsLoginView(true), 2000);
    }
  };

  const formCommonClasses = "mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm";

  return (
    <div className="flex items-center justify-center">
        <div className="max-w-md w-full bg-white p-8 rounded-xl shadow-lg border border-gray-200">
            <div>
                <div className="border-b border-gray-200">
                  <nav className="-mb-px flex space-x-6" aria-label="Tabs">
                      <button
                        onClick={() => { setIsLoginView(true); setNotification(null); }}
                        className={`${ isLoginView ? 'border-secondary text-primary' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center gap-2`}
                      >
                        <ArrowRightOnRectangleIcon className="h-5 w-5"/> Login
                      </button>
                      <button
                        onClick={() => { setIsLoginView(false); setNotification(null); }}
                        className={`${ !isLoginView ? 'border-secondary text-primary' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center gap-2`}
                      >
                        <UserPlusIcon className="h-5 w-5"/> Solicitar Acesso
                      </button>
                  </nav>
                </div>
            </div>

            <div className="mt-6">
                {notification && (
                  <div className={`p-3 rounded-md mb-4 text-sm ${notification.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    {notification.message}
                  </div>
                )}
                {isLoginView ? (
                    <form onSubmit={handleLoginSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 flex items-center gap-2"><UserIcon className="h-4 w-4"/> Nome de Usuário</label>
                            <input type="text" value={loginUsername} onChange={e => setLoginUsername(e.target.value)} className={formCommonClasses} />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 flex items-center gap-2"><KeyIcon className="h-4 w-4"/> Senha</label>
                            <input type="password" value={loginPassword} onChange={e => setLoginPassword(e.target.value)} className={formCommonClasses} />
                        </div>
                        <button type="submit" className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary">
                            Entrar
                        </button>
                    </form>
                ) : (
                    <form onSubmit={handleRegisterSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 flex items-center gap-2"><UserIcon className="h-4 w-4"/> Nome de Usuário</label>
                            <input type="text" value={registerUsername} onChange={e => setRegisterUsername(e.target.value)} className={formCommonClasses} />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 flex items-center gap-2"><KeyIcon className="h-4 w-4"/> Senha</label>
                            <input type="password" value={registerPassword} onChange={e => setRegisterPassword(e.target.value)} className={formCommonClasses} />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 flex items-center gap-2"><KeyIcon className="h-4 w-4"/> Confirmar Senha</label>
                            <input type="password" value={registerConfirmPassword} onChange={e => setRegisterConfirmPassword(e.target.value)} className={formCommonClasses} />
                        </div>
                        <button type="submit" className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-secondary hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-secondary">
                            Solicitar Cadastro
                        </button>
                    </form>
                )}
            </div>
        </div>
    </div>
  );
}

export default LoginScreen;
