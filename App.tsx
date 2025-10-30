import React, { useState, useEffect, useCallback } from 'react';
import { Report, User, ThemeSettings, UserStatus } from './tipos';
import Header from './componentes/Header';
import AdminDashboard from './componentes/AdminDashboard';
import UserDashboard from './componentes/UserDashboard';
import LoginScreen from './componentes/LoginScreen';
import AdminPasswordModal from './componentes/AdminPasswordModal';

const DEFAULT_THEME: ThemeSettings = {
  primaryColor: '#0b3d66',
  secondaryColor: '#00a859',
  headerTitle: 'SEFAZ Amapá',
  headerSubtitle: 'Relatórios de Gestão Power BI',
  logoUrl: '',
  footerText: 'Portal de Relatórios SEFAZ-AP',
};

const ADMIN_PASSWORD = '2345';

const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState<boolean>(false);
  const [showAdminModal, setShowAdminModal] = useState<boolean>(false);

  const [users, setUsers] = useState<User[]>(() => {
    try {
      const savedUsers = localStorage.getItem('powerbi-users');
      return savedUsers ? JSON.parse(savedUsers) : [];
    } catch (error) {
      console.error("Failed to parse users from localStorage", error);
      return [];
    }
  });

  const [reports, setReports] = useState<Report[]>(() => {
    try {
      const savedReports = localStorage.getItem('powerbi-reports');
      return savedReports ? JSON.parse(savedReports) : [];
    } catch (error) {
      console.error("Failed to parse reports from localStorage", error);
      return [];
    }
  });

  const [theme, setTheme] = useState<ThemeSettings>(() => {
    try {
      const savedTheme = localStorage.getItem('powerbi-theme');
      const parsedTheme = savedTheme ? JSON.parse(savedTheme) : DEFAULT_THEME;
      return { ...DEFAULT_THEME, ...parsedTheme };
    } catch (error) {
      console.error("Failed to parse theme from localStorage", error);
      return DEFAULT_THEME;
    }
  });

  useEffect(() => {
    localStorage.setItem('powerbi-users', JSON.stringify(users));
  }, [users]);
  
  useEffect(() => {
    localStorage.setItem('powerbi-reports', JSON.stringify(reports));
  }, [reports]);

  useEffect(() => {
    localStorage.setItem('powerbi-theme', JSON.stringify(theme));
    document.documentElement.style.setProperty('--color-primary', theme.primaryColor);
    document.documentElement.style.setProperty('--color-secondary', theme.secondaryColor);
  }, [theme]);

  const handleLogin = (username: string, password: string): { success: boolean, message: string } => {
    const user = users.find(u => u.username.toLowerCase() === username.toLowerCase() && u.password === password);
    if (!user) {
      return { success: false, message: "Nome de usuário ou senha incorretos." };
    }
    if (user.status !== 'APPROVED') {
      const statusMessage = user.status === 'PENDING' ? 'Sua conta ainda está pendente de aprovação.' : 'Sua conta está suspensa.';
      return { success: false, message: `Acesso negado. ${statusMessage}` };
    }
    setCurrentUser(user);
    return { success: true, message: 'Login bem-sucedido!' };
  };

  const handleRegister = (username: string, password: string): { success: boolean, message: string } => {
    if (users.some(u => u.username.toLowerCase() === username.toLowerCase())) {
      return { success: false, message: "Este nome de usuário já existe." };
    }
    const newUser: User = {
      id: crypto.randomUUID(),
      username,
      password,
      status: 'PENDING',
      visibleReportIds: [],
    };
    setUsers(prev => [...prev, newUser]);
    return { success: true, message: 'Cadastro solicitado! Aguarde a aprovação do administrador.' };
  };

  const handleLogout = () => {
    setCurrentUser(null);
  };
  
  const handleAdminLogin = (password: string): boolean => {
    if (password === ADMIN_PASSWORD) {
      setIsAdminAuthenticated(true);
      setShowAdminModal(false);
      setCurrentUser(null); // Log out any user when admin logs in
      return true;
    }
    return false;
  };

  const handleAdminLogout = () => {
    setIsAdminAuthenticated(false);
  };

  const updateUserStatus = (userId: string, status: UserStatus) => {
    setUsers(prev => prev.map(user => user.id === userId ? { ...user, status } : user));
  };

  const deleteUser = (userId: string) => {
    if (window.confirm('Tem certeza que deseja excluir este usuário permanentemente?')) {
      setUsers(prev => prev.filter(user => user.id !== userId));
    }
  };

  const updateUserReportAccess = (userId: string, reportId: string, hasAccess: boolean) => {
    setUsers(prevUsers => prevUsers.map(user => {
      if (user.id === userId) {
        const newVisibleIds = hasAccess
          ? [...user.visibleReportIds, reportId]
          : user.visibleReportIds.filter(id => id !== reportId);
        return { ...user, visibleReportIds: newVisibleIds };
      }
      return user;
    }));
  };

  const addReport = (title: string, userInput: string): { success: boolean, message: string } => {
    // ... existing logic ...
    let src = '';
    const trimmedInput = userInput.trim();

    if (trimmedInput.startsWith('<iframe')) {
      const srcMatch = trimmedInput.match(/src="([^"]*)"/);
      if (srcMatch && srcMatch[1]) {
        src = srcMatch[1];
      } else {
        return { success: false, message: 'Código HTML inválido. O atributo "src" do iframe não foi encontrado.' };
      }
    } else if (trimmedInput.startsWith('http')) {
       src = trimmedInput;
    } else {
      return { success: false, message: 'Formato de entrada inválido. Forneça o código de incorporação HTML, um link público do Power BI ou um link do SharePoint.' };
    }

    if (!src) {
      return { success: false, message: 'Não foi possível extrair um URL de relatório válido da sua entrada.' };
    }

    try {
      new URL(src); // Basic validation
    } catch (error) {
      return { success: false, message: 'O URL extraído da sua entrada é inválido.' };
    }

    const newReport: Report = {
      id: crypto.randomUUID(),
      title,
      src,
      isVisible: true,
    };
    setReports(prevReports => [...prevReports, newReport]);
    return { success: true, message: 'Relatório publicado com sucesso!' };
  };

  const toggleReportVisibility = useCallback((id: string) => {
    setReports(prev => prev.map(r => r.id === id ? { ...r, isVisible: !r.isVisible } : r));
  }, []);

  const deleteReport = useCallback((id: string) => {
    if (window.confirm('Tem certeza que deseja excluir este relatório permanentemente? Esta ação não pode ser desfeita.')) {
      setReports(prev => prev.filter(r => r.id !== id));
      setUsers(prev => prev.map(user => ({
        ...user,
        visibleReportIds: user.visibleReportIds.filter(reportId => reportId !== id),
      })));
    }
  }, []);

  let content;
  if (isAdminAuthenticated) {
    content = (
      <AdminDashboard
        reports={reports}
        addReport={addReport}
        toggleReportVisibility={toggleReportVisibility}
        deleteReport={deleteReport}
        theme={theme}
        setTheme={setTheme}
        users={users}
        updateUserStatus={updateUserStatus}
        deleteUser={deleteUser}
        updateUserReportAccess={updateUserReportAccess}
      />
    );
  } else if (currentUser) {
    const userVisibleReports = reports.filter(
      r => r.isVisible && currentUser.visibleReportIds.includes(r.id)
    );
    content = <UserDashboard reports={userVisibleReports} />;
  } else {
    content = <LoginScreen onLogin={handleLogin} onRegister={handleRegister} />;
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <Header
        isUserLoggedIn={!!currentUser}
        isAdminLoggedIn={isAdminAuthenticated}
        onAdminClick={() => setShowAdminModal(true)}
        onLogout={handleLogout}
        onAdminLogout={handleAdminLogout}
        theme={theme}
      />
      <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full py-8">
        {content}
      </main>
      {showAdminModal && (
        <AdminPasswordModal
          onClose={() => setShowAdminModal(false)}
          onLogin={handleAdminLogin}
        />
      )}
      <footer className="bg-gray-800 text-white text-center p-4 mt-auto">
        <a href="/" className="hover:underline text-sm">
          {theme.footerText}
        </a>
      </footer>
    </div>
  );
};

export default App;