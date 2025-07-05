import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../contexts/AuthContext';
import { useChat } from '../../contexts/ChatContext';
import { useTheme } from '../../contexts/ThemeContext';
import { useResponsive } from '../../hooks/useResponsive';
import { format } from 'date-fns';
import { fr, enUS } from 'date-fns/locale';
import SafeIcon from '../../common/SafeIcon';
import LanguageSelector from '../common/LanguageSelector';
import * as FiIcons from 'react-icons/fi';

const { 
  FiPlus, 
  FiSettings, 
  FiLogOut, 
  FiSun, 
  FiMoon, 
  FiTrash2, 
  FiMoreHorizontal,
  FiUser,
  FiBot,
  FiX
} = FiIcons;

const Sidebar = ({ onSettingsClick, isOpen, onClose }) => {
  const { t, i18n } = useTranslation();
  const { user, logout } = useAuth();
  const { chats, activeChat, agents, createChat, setActiveChat, deleteChat } = useChat();
  const { isDark, toggleTheme } = useTheme();
  const { isMobile } = useResponsive();
  const [showUserMenu, setShowUserMenu] = useState(false);

  const dateLocale = i18n.language === 'fr' ? fr : enUS;

  // Close sidebar when clicking outside on mobile
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isMobile && isOpen && !event.target.closest('.sidebar-content')) {
        onClose();
      }
    };

    if (isMobile && isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isMobile, isOpen, onClose]);

  // Handle escape key
  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === 'Escape' && isMobile && isOpen) {
        onClose();
      }
    };

    if (isMobile && isOpen) {
      document.addEventListener('keydown', handleEscape);
      return () => document.removeEventListener('keydown', handleEscape);
    }
  }, [isMobile, isOpen, onClose]);

  const handleCreateChat = (agentId) => {
    createChat(agentId);
    if (isMobile) {
      onClose();
    }
  };

  const handleChatClick = (chatId) => {
    setActiveChat(chatId);
    if (isMobile) {
      onClose();
    }
  };

  const handleDeleteChat = (chatId, e) => {
    e.stopPropagation();
    deleteChat(chatId);
  };

  const formatChatTime = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = (now - date) / (1000 * 60 * 60);
    
    if (diffInHours < 24) {
      return format(date, 'HH:mm');
    } else if (diffInHours < 24 * 7) {
      return format(date, 'EEEE', { locale: dateLocale });
    } else {
      return format(date, 'dd/MM', { locale: dateLocale });
    }
  };

  const getAgentName = (agentId) => {
    const agentKeys = {
      'general': 'agents.chiefAgent',
      'support': 'agents.supportAgent',
      'sales': 'agents.salesAgent',
      'marketing': 'agents.marketingAgent'
    };
    return t(agentKeys[agentId] || 'agents.chiefAgent');
  };

  const getAgentDescription = (agentId) => {
    const agentKeys = {
      'general': 'agents.chiefAgentDesc',
      'support': 'agents.supportAgentDesc',
      'sales': 'agents.salesAgentDesc',
      'marketing': 'agents.marketingAgentDesc'
    };
    return t(agentKeys[agentId] || 'agents.chiefAgentDesc');
  };

  const sidebarContent = (
    <div className="sidebar-content w-full h-full bg-primary-900 dark:bg-neutral-800 text-white flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-primary-700 dark:border-neutral-600">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-xl font-semibold flex items-center">
            <SafeIcon icon={FiBot} className="mr-2" />
            {t('dashboard.title')}
          </h1>
          <div className="flex items-center space-x-2">
            {isMobile && (
              <button
                onClick={onClose}
                className="p-2 rounded-lg hover:bg-primary-800 dark:hover:bg-neutral-700 transition-colors"
                title={t('common.close')}
              >
                <SafeIcon icon={FiX} className="w-4 h-4" />
              </button>
            )}
            {!isMobile && (
              <>
                <LanguageSelector />
                <button
                  onClick={toggleTheme}
                  className="p-2 rounded-lg hover:bg-primary-800 dark:hover:bg-neutral-700 transition-colors"
                  title={isDark ? t('dashboard.lightMode') : t('dashboard.darkMode')}
                >
                  <SafeIcon icon={isDark ? FiSun : FiMoon} className="w-4 h-4" />
                </button>
                <button
                  onClick={onSettingsClick}
                  className="p-2 rounded-lg hover:bg-primary-800 dark:hover:bg-neutral-700 transition-colors"
                  title={t('common.settings')}
                >
                  <SafeIcon icon={FiSettings} className="w-4 h-4" />
                </button>
              </>
            )}
          </div>
        </div>

        {/* New Chat Buttons */}
        <div className="space-y-2">
          <h3 className="text-sm font-medium text-neutral-300 mb-2">
            {t('dashboard.createConversation')}
          </h3>
          {agents.filter(agent => agent.active).map((agent) => (
            <button
              key={agent.id}
              onClick={() => handleCreateChat(agent.id)}
              className="w-full flex items-center p-3 rounded-lg bg-primary-800 dark:bg-neutral-700 hover:bg-primary-700 dark:hover:bg-neutral-600 transition-colors text-left"
            >
              <span className="text-2xl mr-3">{agent.avatar}</span>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium text-white truncate">
                  {getAgentName(agent.id)}
                </div>
                <div className="text-xs text-neutral-300 truncate">
                  {getAgentDescription(agent.id)}
                </div>
              </div>
              <SafeIcon icon={FiPlus} className="w-4 h-4 text-neutral-400" />
            </button>
          ))}
        </div>
      </div>

      {/* Chat List */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-4">
          <h3 className="text-sm font-medium text-neutral-300 mb-3">
            {t('dashboard.recentConversations')}
          </h3>
          <div className="space-y-2">
            {chats.length === 0 ? (
              <p className="text-sm text-neutral-400 text-center py-8">
                {t('dashboard.noConversations')}
              </p>
            ) : (
              chats.map((chat) => {
                const agent = agents.find(a => a.id === chat.agentId);
                const lastMessage = chat.messages[chat.messages.length - 1];
                
                return (
                  <motion.div
                    key={chat.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.2 }}
                    className={`group relative p-3 rounded-lg cursor-pointer transition-all duration-200 ${
                      activeChat === chat.id
                        ? 'bg-secondary-400 text-white'
                        : 'bg-primary-800 dark:bg-neutral-700 hover:bg-primary-700 dark:hover:bg-neutral-600'
                    }`}
                    onClick={() => handleChatClick(chat.id)}
                  >
                    <div className="flex items-start">
                      <span className="text-xl mr-3 mt-0.5">{agent?.avatar || '🤖'}</span>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <div className="text-sm font-medium truncate">
                            {getAgentName(chat.agentId)}
                          </div>
                          <div className="text-xs opacity-75 ml-2">
                            {formatChatTime(chat.updatedAt)}
                          </div>
                        </div>
                        {lastMessage && (
                          <div className="text-xs opacity-75 truncate mt-1">
                            {lastMessage.sender === 'user' ? `${t('dashboard.you')}: ` : ''}
                            {lastMessage.content}
                          </div>
                        )}
                      </div>
                    </div>
                    
                    {/* Delete Button */}
                    <button
                      onClick={(e) => handleDeleteChat(chat.id, e)}
                      className="absolute top-2 right-2 p-1 rounded opacity-0 group-hover:opacity-100 hover:bg-red-500 transition-all duration-200"
                      title={t('chat.deleteConversation')}
                    >
                      <SafeIcon icon={FiTrash2} className="w-3 h-3" />
                    </button>
                  </motion.div>
                );
              })
            )}
          </div>
        </div>
      </div>

      {/* User Menu */}
      <div className="p-4 border-t border-primary-700 dark:border-neutral-600">
        <div className="relative">
          <button
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="w-full flex items-center p-3 rounded-lg hover:bg-primary-800 dark:hover:bg-neutral-700 transition-colors"
          >
            <img
              src={user.avatar}
              alt={user.name}
              className="w-8 h-8 rounded-full mr-3"
            />
            <div className="flex-1 text-left">
              <div className="text-sm font-medium">{user.name}</div>
              <div className="text-xs text-neutral-300">{user.email}</div>
            </div>
            <SafeIcon icon={FiMoreHorizontal} className="w-4 h-4 text-neutral-400" />
          </button>

          <AnimatePresence>
            {showUserMenu && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                transition={{ duration: 0.2 }}
                className="absolute bottom-full left-0 right-0 mb-2 bg-primary-800 dark:bg-neutral-700 rounded-lg shadow-lg border border-primary-700 dark:border-neutral-600"
              >
                <button
                  onClick={() => {
                    setShowUserMenu(false);
                    if (isMobile) {
                      onClose();
                    }
                  }}
                  className="w-full flex items-center p-3 text-left hover:bg-primary-700 dark:hover:bg-neutral-600 transition-colors rounded-t-lg"
                >
                  <SafeIcon icon={FiUser} className="w-4 h-4 mr-3" />
                  <span className="text-sm">{t('common.profile')}</span>
                </button>
                {isMobile && (
                  <button
                    onClick={() => {
                      setShowUserMenu(false);
                      onSettingsClick();
                    }}
                    className="w-full flex items-center p-3 text-left hover:bg-primary-700 dark:hover:bg-neutral-600 transition-colors"
                  >
                    <SafeIcon icon={FiSettings} className="w-4 h-4 mr-3" />
                    <span className="text-sm">{t('common.settings')}</span>
                  </button>
                )}
                <button
                  onClick={() => {
                    setShowUserMenu(false);
                    logout();
                  }}
                  className="w-full flex items-center p-3 text-left hover:bg-primary-700 dark:hover:bg-neutral-600 transition-colors rounded-b-lg text-red-400"
                >
                  <SafeIcon icon={FiLogOut} className="w-4 h-4 mr-3" />
                  <span className="text-sm">{t('common.logout')}</span>
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );

  if (isMobile) {
    return (
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-50 lg:hidden"
          >
            {/* Backdrop */}
            <div 
              className="absolute inset-0 bg-black bg-opacity-60"
              onClick={onClose}
            />
            
            {/* Sidebar */}
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="absolute left-0 top-0 h-full w-4/5 max-w-sm"
              style={{ maxWidth: '80%' }}
            >
              {sidebarContent}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    );
  }

  return (
    <div className="hidden lg:block w-80 h-full">
      {sidebarContent}
    </div>
  );
};

export default Sidebar;