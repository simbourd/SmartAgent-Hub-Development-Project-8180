import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useResponsive } from '../hooks/useResponsive';
import Sidebar from '../components/layout/Sidebar';
import ChatWindow from '../components/chat/ChatWindow';
import SettingsPanel from '../components/settings/SettingsPanel';
import { useChat } from '../contexts/ChatContext';

const Dashboard = () => {
  const { t } = useTranslation();
  const { activeChat } = useChat();
  const { isMobile } = useResponsive();
  const [showSettings, setShowSettings] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleMenuClick = () => {
    setSidebarOpen(true);
  };

  const handleSidebarClose = () => {
    setSidebarOpen(false);
  };

  const handleSettingsClick = () => {
    setShowSettings(true);
    if (isMobile) {
      setSidebarOpen(false);
    }
  };

  return (
    <div className="flex h-screen bg-neutral-100 dark:bg-neutral-900">
      {/* Sidebar */}
      <Sidebar 
        onSettingsClick={handleSettingsClick}
        isOpen={sidebarOpen}
        onClose={handleSidebarClose}
      />
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {activeChat ? (
          <ChatWindow onMenuClick={handleMenuClick} />
        ) : (
          <div className="flex-1 flex flex-col bg-white dark:bg-neutral-800">
            {/* Mobile Header for empty state */}
            {isMobile && (
              <div className="lg:hidden flex items-center justify-between p-4 bg-primary-900 dark:bg-neutral-800 text-white border-b border-primary-700 dark:border-neutral-600">
                <div className="flex items-center space-x-3">
                  <button
                    onClick={handleMenuClick}
                    className="p-2 rounded-lg hover:bg-primary-800 dark:hover:bg-neutral-700 transition-colors"
                  >
                    <span className="text-lg">☰</span>
                  </button>
                  <span className="text-sm font-medium">{t('dashboard.title')}</span>
                </div>
              </div>
            )}
            
            {/* Welcome Content */}
            <div className="flex-1 flex items-center justify-center">
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="text-center"
              >
                <div className="text-6xl mb-4">🤖</div>
                <h2 className="text-2xl font-semibold text-primary-900 dark:text-white mb-2">
                  {t('dashboard.welcome')}
                </h2>
                <p className="text-neutral-600 dark:text-neutral-400 max-w-md mx-auto">
                  {t('dashboard.welcomeDesc')}
                </p>
              </motion.div>
            </div>
          </div>
        )}
      </div>

      {/* Settings Panel */}
      {showSettings && (
        <SettingsPanel onClose={() => setShowSettings(false)} />
      )}
    </div>
  );
};

export default Dashboard;