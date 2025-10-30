import React, { useState } from 'react';
import { Report, ThemeSettings, User, UserStatus } from '../types';
import { 
  TrashIcon, DocumentAddIcon, EyeIcon, EyeOffIcon, CogIcon, ColorSwatchIcon, 
  PencilIcon, PhotographIcon, ChatBubbleBottomCenterTextIcon, UserGroupIcon, 
  CheckCircleIcon, BanIcon, XCircleIcon, ChevronDownIcon 
} from './icons';

interface AdminDashboardProps {
  reports: Report[];
  addReport: (title: string, userInput: string) => { success: boolean, message: string };
  toggleReportVisibility: (id: string) => void;
  deleteReport: (id: string) => void;
  theme: ThemeSettings;
  setTheme: (theme: ThemeSettings) => void;
  users: User[];
  updateUserStatus: (userId: string, status: UserStatus) => void;
  deleteUser: (userId: string) => void;
  updateUserReportAccess: (userId: string, reportId: string, hasAccess: boolean) => void;
}

const ThemeCustomizer: React.FC<{ theme: ThemeSettings, setTheme: (theme: ThemeSettings) => void }> = ({ theme, setTheme }) => {
    // ... Omitted for brevity: The component content is identical to the original file
  const [localTheme, setLocalTheme] = useState<ThemeSettings>(theme);
  const [notification, setNotification] = useState<string | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setLocalTheme(prev => ({ ...prev, [name]: value }));
  };
  
  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
        const reader = new FileReader();
        reader.onloadend = () => {
            setLocalTheme(prev => ({...prev, logoUrl: reader.result as string}));
        };
        reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    setTheme(localTheme);
    setNotification('Tema atualizado com sucesso!');
    setTimeout(() => setNotification(null), 3000);
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
      <h2 className="text-2xl font-bold text-primary mb-4 flex items-center">
        <CogIcon className="h-7 w-7 mr-3" />
        Personalização do Layout
      </h2>
      {notification && (
        <div className="p-3 rounded-md mb-4 text-sm bg-green-100 text-green-800">
          {notification}
        </div>
      )}
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
              <PencilIcon className="h-4 w-4 mr-2" /> Título Principal
            </label>
            <input type="text" name="headerTitle" value={localTheme.headerTitle} onChange={handleInputChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
              <PencilIcon className="h-4 w-4 mr-2" /> Subtítulo
            </label>
            <input type="text" name="headerSubtitle" value={localTheme.headerSubtitle} onChange={handleInputChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm" />
          </div>
        </div>
        <div>
            <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
              <ChatBubbleBottomCenterTextIcon className="h-4 w-4 mr-2" /> Texto do Rodapé
            </label>
            <input type="text" name="footerText" value={localTheme.footerText} onChange={handleInputChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
            <PhotographIcon className="h-4 w-4 mr-2" /> Logo do Cabeçalho (Imagem)
          </label>
           <input 
            type="file" 
            name="logoUrl" 
            accept="image/*"
            onChange={handleLogoChange} 
            className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-white hover:file:opacity-90 cursor-pointer" 
          />
           {localTheme.logoUrl && <img src={localTheme.logoUrl} alt="Pré-visualização do Logo" className="mt-2 h-10 w-auto bg-gray-100 p-1 rounded" />}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
              <ColorSwatchIcon className="h-4 w-4 mr-2" /> Cor Primária
            </label>
            <input type="color" name="primaryColor" value={localTheme.primaryColor} onChange={handleInputChange} className="mt-1 h-10 w-full block border border-gray-300 rounded-md cursor-pointer" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
              <ColorSwatchIcon className="h-4 w-4 mr-2" /> Cor Secundária
            </label>
            <input type="color" name="secondaryColor" value={localTheme.secondaryColor} onChange={handleInputChange} className="mt-1 h-10 w-full block border border-gray-300 rounded-md cursor-pointer" />
          </div>
        </div>
        <div>
          <button onClick={handleSave} className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-secondary hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-secondary">
            Salvar Alterações do Tema
          </button>
        </div>
      </div>
    </div>
  );
}

const ReportManager: React.FC<Pick<AdminDashboardProps, 'reports' | 'addReport' | 'toggleReportVisibility' | 'deleteReport'>> = ({ reports, addReport, toggleReportVisibility, deleteReport }) => {
  const [title, setTitle] = useState('');
  const [reportInput, setReportInput] = useState('');
  const [notification, setNotification] = useState<{ type: 'success' | 'error', message: string } | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !reportInput.trim()) {
      setNotification({ type: 'error', message: 'Por favor, preencha o título e o código/link do relatório.' });
      return;
    }
    const result = addReport(title, reportInput);
    setNotification({ type: result.success ? 'success' : 'error', message: result.message });
    
    if (result.success) {
      setTitle('');
      setReportInput('');
    }

    setTimeout(() => setNotification(null), 5000);
  };
  return (
    <div className="space-y-8">
      <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
        <h2 className="text-2xl font-bold text-primary mb-4 flex items-center">
          <DocumentAddIcon className="h-7 w-7 mr-3" />
          Publicar Novo Relatório
        </h2>
        
        {notification && (
          <div className={`p-3 rounded-md mb-4 text-sm ${notification.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
            {notification.message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700">
              Título do Relatório
            </label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
              placeholder="Ex: Relatório Financeiro Trimestral"
            />
          </div>
          <div>
            <label htmlFor="reportInput" className="block text-sm font-medium text-gray-700">
              Código de Incorporação ou Link (Público / SharePoint)
            </label>
            <p className="mt-1 text-xs text-gray-500">
              Cole aqui o código HTML <strong>&lt;iframe...&gt;</strong>, o link de <strong>Publicar na Web (público)</strong> ou o link de incorporação do <strong>SharePoint</strong>.
            </p>
            <textarea
              id="reportInput"
              rows={4}
              value={reportInput}
              onChange={(e) => setReportInput(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm font-mono"
              placeholder="Cole o código HTML ou o link do seu relatório Power BI aqui..."
            />
          </div>
          <div>
            <button
              type="submit"
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
            >
              Publicar Relatório
            </button>
          </div>
        </form>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
        <h2 className="text-2xl font-bold text-primary mb-4">Relatórios Publicados</h2>
        {reports.length > 0 ? (
          <ul className="divide-y divide-gray-200">
            {reports.map((report) => (
              <li key={report.id} className="py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <span className={`text-gray-800 font-medium ${!report.isVisible && 'line-through text-gray-400'}`}>{report.title}</span>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <button
                    onClick={() => toggleReportVisibility(report.id)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 ${report.isVisible ? 'text-gray-600 bg-gray-100 hover:bg-gray-200 focus:ring-gray-500' : 'text-green-600 bg-green-100 hover:bg-green-200 focus:ring-green-500'}`}
                    aria-label={report.isVisible ? `Ocultar relatório: ${report.title}` : `Exibir relatório: ${report.title}`}
                  >
                    {report.isVisible ? <EyeOffIcon className="h-4 w-4" /> : <EyeIcon className="h-4 w-4" />}
                    <span className="hidden sm:inline">{report.isVisible ? 'Ocultar' : 'Publicar'}</span>
                  </button>
                  <button
                    onClick={() => deleteReport(report.id)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 text-red-600 bg-red-100 hover:bg-red-200 focus:ring-red-500"
                    aria-label={`Excluir relatório: ${report.title}`}
                  >
                    <TrashIcon className="h-4 w-4" />
                     <span className="hidden sm:inline">Excluir</span>
                  </button>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-center text-gray-500 py-4">Nenhum relatório publicado ainda.</p>
        )}
      </div>
    </div>
  )
}

const UserManagement: React.FC<Pick<AdminDashboardProps, 'users' | 'reports' | 'updateUserStatus' | 'deleteUser' | 'updateUserReportAccess'>> = ({ users, reports, updateUserStatus, deleteUser, updateUserReportAccess }) => {
  const [expandedUserId, setExpandedUserId] = useState<string | null>(null);

  const getStatusBadge = (status: UserStatus) => {
    switch (status) {
      case 'APPROVED': return <span className="px-2 py-1 text-xs font-medium text-green-800 bg-green-100 rounded-full">Aprovado</span>;
      case 'PENDING': return <span className="px-2 py-1 text-xs font-medium text-yellow-800 bg-yellow-100 rounded-full">Pendente</span>;
      case 'SUSPENDED': return <span className="px-2 py-1 text-xs font-medium text-red-800 bg-red-100 rounded-full">Suspenso</span>;
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
      <h2 className="text-2xl font-bold text-primary mb-4 flex items-center"><UserGroupIcon className="h-7 w-7 mr-3" /> Gerenciamento de Usuários</h2>
       {users.length > 0 ? (
          <div className="divide-y divide-gray-200">
            {users.map(user => (
              <div key={user.id} className="py-4">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <span className="font-medium text-gray-800">{user.username}</span>
                    {getStatusBadge(user.status)}
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    {user.status === 'PENDING' && (
                      <button onClick={() => updateUserStatus(user.id, 'APPROVED')} className="p-2 text-green-600 hover:text-green-800 transition-colors"><CheckCircleIcon className="h-5 w-5"/></button>
                    )}
                    {user.status === 'APPROVED' && (
                      <button onClick={() => updateUserStatus(user.id, 'SUSPENDED')} className="p-2 text-yellow-600 hover:text-yellow-800 transition-colors"><BanIcon className="h-5 w-5"/></button>
                    )}
                    {user.status === 'SUSPENDED' && (
                      <button onClick={() => updateUserStatus(user.id, 'APPROVED')} className="p-2 text-green-600 hover:text-green-800 transition-colors"><CheckCircleIcon className="h-5 w-5"/></button>
                    )}
                    <button onClick={() => deleteUser(user.id)} className="p-2 text-red-600 hover:text-red-800 transition-colors"><XCircleIcon className="h-5 w-5"/></button>
                    <button onClick={() => setExpandedUserId(expandedUserId === user.id ? null : user.id)} className="p-2 text-gray-500 hover:text-gray-800 transition-colors">
                      <ChevronDownIcon className={`h-5 w-5 transition-transform ${expandedUserId === user.id ? 'rotate-180' : ''}`} />
                    </button>
                  </div>
                </div>
                {expandedUserId === user.id && (
                  <div className="mt-4 pl-4 border-l-2 border-primary">
                    <h4 className="font-semibold text-gray-700 mb-2">Acesso aos Relatórios:</h4>
                    {reports.length > 0 ? (
                      <div className="space-y-2">
                        {reports.map(report => (
                          <label key={report.id} className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
                            <input
                              type="checkbox"
                              className="h-4 w-4 rounded border-gray-300 text-secondary focus:ring-secondary"
                              checked={user.visibleReportIds.includes(report.id)}
                              onChange={(e) => updateUserReportAccess(user.id, report.id, e.target.checked)}
                            />
                            {report.title}
                          </label>
                        ))}
                      </div>
                    ) : <p className="text-sm text-gray-500">Nenhum relatório publicado para gerenciar o acesso.</p>}
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-500 py-4">Nenhum usuário registrado ainda.</p>
        )}
    </div>
  )
}


const AdminDashboard: React.FC<AdminDashboardProps> = (props) => {
  const [activeTab, setActiveTab] = useState<'reports' | 'users' | 'theme'>('reports');

  const tabs = [
    { id: 'reports', name: 'Relatórios', icon: DocumentAddIcon },
    { id: 'users', name: 'Usuários', icon: UserGroupIcon },
    { id: 'theme', name: 'Layout', icon: CogIcon },
  ];

  return (
    <div className="space-y-8">
      <div>
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-6" aria-label="Tabs">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`${
                  activeTab === tab.id
                    ? 'border-secondary text-primary'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center gap-2`}
                aria-current={activeTab === tab.id ? 'page' : undefined}
              >
                <tab.icon className="h-5 w-5"/>
                {tab.name}
              </button>
            ))}
          </nav>
        </div>
      </div>
      
      {activeTab === 'reports' && <ReportManager {...props} />}
      {activeTab === 'users' && <UserManagement {...props} />}
      {activeTab === 'theme' && <ThemeCustomizer theme={props.theme} setTheme={props.setTheme} />}
    </div>
  );
};

export default AdminDashboard;
