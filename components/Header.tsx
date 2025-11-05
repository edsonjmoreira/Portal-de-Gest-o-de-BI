import React from 'react';
import { ThemeSettings } from '../types';
import { ChartBarIcon, UserIcon, ShieldCheckIcon, ArrowRightOnRectangleIcon } from './icons';

interface HeaderProps {
  isUserLoggedIn: boolean;
  isAdminLoggedIn: boolean;
  onAdminClick: () => void;
  onLogout: () => void;
  onAdminLogout: () => void;
  theme: ThemeSettings;
}

const Header: React.FC<HeaderProps> = ({ 
  isUserLoggedIn, 
  isAdminLoggedIn, 
  onAdminClick, 
  onLogout, 
  onAdminLogout, 
  theme 
}) => {

  const getButton = () => {
    const buttonClasses = "flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 bg-black bg-opacity-20 hover:bg-opacity-30 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-primary focus:ring-white";

    if (isAdminLoggedIn) {
      return (
        <button onClick={onAdminLogout} className={buttonClasses}>
          <UserIcon className="h-5 w-5" />
          <span>Sair do Modo Admin</span>
        </button>
      );
    }
    if (isUserLoggedIn) {
      return (
        <button onClick={onLogout} className={buttonClasses}>
          <ArrowRightOnRectangleIcon className="h-5 w-5 transform -scale-x-100" />
          <span>Sair</span>
        </button>
      );
    }
    return (
      <button onClick={onAdminClick} className={buttonClasses}>
        <ShieldCheckIcon className="h-5 w-5" />
        <span>Modo Admin</span>
      </button>
    );
  };

  return (
    <header className="bg-primary text-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <div className="flex items-center space-x-4">
            <div className="bg-white p-2 rounded-full shadow-sm">
              {theme.logoUrl ? (
                <img src={theme.logoUrl} alt="Logo" className="h-8 w-8 object-contain" />
              ) : (
                <ChartBarIcon className="h-8 w-8 text-primary" />
              )}
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight">{theme.headerTitle}</h1>
              <p className="text-sm sm:text-base text-gray-300">{theme.headerSubtitle}</p>
            </div>
          </div>
          {getButton()}
        </div>
      </div>
    </header>
  );
};

export default Header;
