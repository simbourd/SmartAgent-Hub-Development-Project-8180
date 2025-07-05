import React from 'react';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../../contexts/ThemeContext';
import SafeIcon from '../../common/SafeIcon';
import LanguageSelector from '../common/LanguageSelector';
import * as FiIcons from 'react-icons/fi';

const { FiMenu, FiSun, FiMoon, FiBot } = FiIcons;

const MobileHeader = ({ onMenuClick, agent }) => {
  const { t } = useTranslation();
  const { isDark, toggleTheme } = useTheme();

  return (
    <div className="lg:hidden flex items-center justify-between p-4 bg-primary-900 dark:bg-neutral-800 text-white border-b border-primary-700 dark:border-neutral-600">
      <div className="flex items-center space-x-3">
        <button
          onClick={onMenuClick}
          className="p-2 rounded-lg hover:bg-primary-800 dark:hover:bg-neutral-700 transition-colors"
          title={t('common.menu')}
        >
          <SafeIcon icon={FiMenu} className="w-5 h-5" />
        </button>
        
        {agent ? (
          <div className="flex items-center space-x-2">
            <span className="text-lg">{agent.avatar}</span>
            <span className="text-sm font-medium truncate">{agent.name}</span>
          </div>
        ) : (
          <div className="flex items-center space-x-2">
            <SafeIcon icon={FiBot} className="w-5 h-5" />
            <span className="text-sm font-medium">{t('dashboard.title')}</span>
          </div>
        )}
      </div>
      
      <div className="flex items-center space-x-2">
        <LanguageSelector />
        <button
          onClick={toggleTheme}
          className="p-2 rounded-lg hover:bg-primary-800 dark:hover:bg-neutral-700 transition-colors"
          title={isDark ? t('dashboard.lightMode') : t('dashboard.darkMode')}
        >
          <SafeIcon icon={isDark ? FiSun : FiMoon} className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default MobileHeader;