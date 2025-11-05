
import React, { useState, useEffect, useCallback } from 'react';
import { Report, User, ThemeSettings, UserStatus } from './types';
import Header from './components/Header';
import AdminDashboard from './components/AdminDashboard';
import UserDashboard from './components/UserDashboard';
import LoginScreen from './components/LoginScreen';
import AdminPasswordModal from './components/AdminPasswordModal';
import { db } from './firebase';
import { ref, onValue, set, update, remove, DataSnapshot } from 'firebase/database';

const DEFAULT_THEME: ThemeSettings = {
  primaryColor: '#0b3d66',
  secondaryColor: '#00a859',
  headerTitle: 'SEFAZ Amapá',
  headerSubtitle: 'Relatórios de Gestão Power BI',
  logoUrl: '',
  footerText: 'Portal de Relatórios SEFAZ-AP',
};

const ADMIN_PASSWORD = '2345';

// Verifica se as variáveis de ambiente do Firebase estão configuradas
const isFirebaseConfigured = import.meta.env.VITE_FIREBASE_API_KEY && import.meta.env.VITE_FIREBASE_DATABASE_URL;

const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState<boolean>(false);
  const [showAdminModal, setShowAdminModal] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);

  const [users, setUsers] = useState<User[]>([]);
  const [reports, setReports] = useState<Report[]>([]);
  const [theme, setTheme] = useState<ThemeSettings>(DEFAULT_THEME);

  useEffect(() => {
    if (!isFirebaseConfigured) {
      setLoading(false);
      return;
    }

    let usersLoaded = false;
    let reportsLoaded = false;
    let themeLoaded = false;

    const checkAllDataLoaded = () => {
      if (usersLoaded && reportsLoaded && themeLoaded) {
        setLoading(false);
      }
    };

    const usersRef = ref(db, 'users');
    onValue(usersRef, (snapshot: DataSnapshot) => {
      const data = snapshot.val();
      const loadedUsers = data ? Object.values(data) : [];
      setUsers(loadedUsers as User[]);
      usersLoaded = true;
      checkAllDataLoaded();
    });

    const reportsRef = ref(db, 'reports');
    onValue(reportsRef, (snapshot: DataSnapshot) => {
      const data = snapshot.val();
      const loadedReports = data ? Object.values(data) : [];
      setReports(loadedReports as Report[]);
      reportsLoaded = true;
      checkAllDataLoaded();
    });

    const themeRef = ref(db, 'theme');
    onValue(themeRef, (snapshot: DataSnapshot) => {
      const data = snapshot.val();
      setTheme(data || DEFAULT_THEME);
      themeLoaded = true;
      checkAllDataLoaded();
    });
  }, []);

  useEffect(() => {
    document.documentElement.style.setProperty('--color-primary', theme.primaryColor);
    document.documentElement.style.setProperty('--color-secondary', theme.secondaryColor);
  }, [theme]);
  
  if (!isFirebaseConfigured) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="max-w-2xl p-8 text-center bg-white rounded-lg shadow-md border border-red-200">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Erro de Configuração</h1>
          <p className="text-gray-700">
            A conexão com o banco de dados não foi configurada corretamente.
          </p>
          <p className="mt-2 text-gray-600">
            Por favor, crie um arquivo <strong>.env.local</strong> na raiz do projeto e adicione suas credenciais do Firebase, conforme as instruções.
          </p>
        </div>
      </div>
    );
  }

  if (loading) {
     return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="text-center">
                <p className="text-lg font-semibold text-primary">Carregando...</p>
                <div className="w-16 h-16 border-4 border-dashed rounded-full animate-spin border-secondary mx-auto mt-4"></div>
            </div>
        </div>
    );
  }


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
    const newUserId = crypto.randomUUID();
    const newUser: User = {
      id: newUserId,
      username,
      password,
      status: 'PENDING',
      visibleReportIds: [],
    };
    set(ref(db, 'users/' + newUserId), newUser);
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
    update(ref(db, `users/${userId}`), { status });
  };

  const deleteUser = (userId: string) => {
    if (window.confirm('Tem certeza que deseja excluir este usuário permanentemente?')) {
      remove(ref(db, `users/${userId}`));
    }
  };

  const updateUserReportAccess = (userId: string, reportId: string, hasAccess: boolean) => {
    const user = users.find(u => u.id === userId);
    if (user) {
      const currentVisibleIds = user.visibleReportIds || [];
      const newVisibleIds = hasAccess
        ? [...currentVisibleIds, reportId]
        : currentVisibleIds.filter(id => id !== reportId);
      update(ref(db, `users/${userId}`), { visibleReportIds: newVisibleIds });
    }
  };

  const addReport = (title: string, userInput: string): { success: boolean, message: string } => {
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

    const newReportId = crypto.randomUUID();
    const newReport: Report = {
      id: newReportId,
      title,
      src,
      isVisible: true,
    };
    set(ref(db, `reports/${newReportId}`), newReport);
    return { success: true, message: 'Relatório publicado com sucesso!' };
  };

  const toggleReportVisibility = useCallback((id: string) => {
    const report = reports.find(r => r.id === id);
    if (report) {
        update(ref(db, `reports/${id}`), { isVisible: !report.isVisible });
    }
  }, [reports]);

  const deleteReport = useCallback((id: string) => {
    if (window.confirm('Tem certeza que deseja excluir este relatório permanentemente? Esta ação não pode ser desfeita.')) {
      remove(ref(db, `reports/${id}`));
      users.forEach(user => {
        if (user.visibleReportIds?.includes(id)) {
          const newVisibleIds = user.visibleReportIds.filter(reportId => reportId !== id);
          update(ref(db, `users/${user.id}`), { visibleReportIds: newVisibleIds });
        }
      });
    }
  }, [users]);

  const handleThemeUpdate = (newTheme: ThemeSettings) => {
    set(ref(db, 'theme'), newTheme);
  };

  let content;
  if (isAdminAuthenticated) {
    content = (
      <AdminDashboard
        reports={reports}
        addReport={addReport}
        toggleReportVisibility={toggleReportVisibility}
        deleteReport={deleteReport}
        theme={theme}
        setTheme={handleThemeUpdate}
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