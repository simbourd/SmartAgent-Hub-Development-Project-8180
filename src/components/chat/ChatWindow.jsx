import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useChat } from '../../contexts/ChatContext';
import { useResponsive } from '../../hooks/useResponsive';
import MessageBubble from './MessageBubble';
import InputBox from './InputBox';
import MobileHeader from '../layout/MobileHeader';
import SafeIcon from '../../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiBot, FiMoreVertical, FiTrash2, FiCopy } = FiIcons;

const ChatWindow = ({ onMenuClick }) => {
  const { t } = useTranslation();
  const { chats, activeChat, agents, deleteChat, loading } = useChat();
  const { isMobile } = useResponsive();
  const [showMenu, setShowMenu] = useState(false);
  const messagesEndRef = useRef(null);
  const messagesContainerRef = useRef(null);

  const chat = chats.find(c => c.id === activeChat);
  const agent = agents.find(a => a.id === chat?.agentId);

  useEffect(() => {
    scrollToBottom();
  }, [chat?.messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleCopyChat = () => {
    if (!chat) return;
    
    const chatText = chat.messages.map(msg => 
      `${msg.sender === 'user' ? t('dashboard.you') : msg.agentName}: ${msg.content}`
    ).join('\n');
    
    navigator.clipboard.writeText(chatText);
    setShowMenu(false);
  };

  const handleDeleteChat = () => {
    if (!chat) return;
    deleteChat(chat.id);
    setShowMenu(false);
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

  const getSuggestions = (agentId) => {
    const suggestionKeys = {
      'general': 'chat.suggestions.general',
      'support': 'chat.suggestions.support',
      'sales': 'chat.suggestions.sales',
      'marketing': 'chat.suggestions.marketing'
    };
    return t(suggestionKeys[agentId] || 'chat.suggestions.general', { returnObjects: true });
  };

  if (!chat || !agent) {
    return (
      <div className="flex-1 flex flex-col bg-white dark:bg-neutral-800">
        {isMobile && <MobileHeader onMenuClick={onMenuClick} />}
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="text-6xl mb-4">🤖</div>
            <h3 className="text-xl font-semibold text-primary-900 dark:text-white mb-2">
              {t('dashboard.noConversation')}
            </h3>
            <p className="text-neutral-600 dark:text-neutral-400">
              {t('dashboard.noConversationDesc')}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col bg-white dark:bg-neutral-800">
      {/* Mobile Header */}
      {isMobile && <MobileHeader onMenuClick={onMenuClick} agent={agent} />}

      {/* Desktop Header */}
      {!isMobile && (
        <div className="flex items-center justify-between p-4 border-b border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800">
          <div className="flex items-center">
            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-neutral-100 dark:bg-neutral-700 mr-3">
              <span className="text-xl">{agent.avatar}</span>
            </div>
            <div>
              <h2 className="text-lg font-semibold text-primary-900 dark:text-white">
                {getAgentName(agent.id)}
              </h2>
              <p className="text-sm text-neutral-500 dark:text-neutral-400">
                {getAgentDescription(agent.id)}
              </p>
            </div>
          </div>
          
          <div className="relative">
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="p-2 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-700 transition-colors"
            >
              <SafeIcon icon={FiMoreVertical} className="w-5 h-5 text-neutral-600 dark:text-neutral-400" />
            </button>
            
            <AnimatePresence>
              {showMenu && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.1 }}
                  className="absolute right-0 top-full mt-2 w-48 bg-white dark:bg-neutral-700 rounded-lg shadow-lg border border-neutral-200 dark:border-neutral-600 z-10"
                >
                  <button
                    onClick={handleCopyChat}
                    className="w-full flex items-center p-3 text-left hover:bg-neutral-50 dark:hover:bg-neutral-600 transition-colors rounded-t-lg"
                  >
                    <SafeIcon icon={FiCopy} className="w-4 h-4 mr-3 text-neutral-600 dark:text-neutral-400" />
                    <span className="text-sm text-primary-900 dark:text-white">{t('chat.copyConversation')}</span>
                  </button>
                  <button
                    onClick={handleDeleteChat}
                    className="w-full flex items-center p-3 text-left hover:bg-neutral-50 dark:hover:bg-neutral-600 transition-colors rounded-b-lg text-red-600 dark:text-red-400"
                  >
                    <SafeIcon icon={FiTrash2} className="w-4 h-4 mr-3" />
                    <span className="text-sm">{t('chat.deleteConversation')}</span>
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      )}

      {/* Messages */}
      <div 
        ref={messagesContainerRef}
        className="flex-1 overflow-y-auto p-4 space-y-4 bg-neutral-50 dark:bg-neutral-900"
      >
        {chat.messages.length === 0 ? (
          <div className="flex-1 flex items-center justify-center">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center max-w-md mx-auto"
            >
              <div className="text-4xl mb-4">{agent.avatar}</div>
              <h3 className="text-lg font-semibold text-primary-900 dark:text-white mb-2">
                {t('chat.conversationWith', { name: getAgentName(agent.id) })}
              </h3>
              <p className="text-neutral-600 dark:text-neutral-400 mb-4">
                {getAgentDescription(agent.id)}
              </p>
              <div className="bg-white dark:bg-neutral-800 rounded-lg p-4 text-sm text-neutral-700 dark:text-neutral-300">
                <p className="mb-2">
                  <strong>{t('chat.suggestions')}</strong>
                </p>
                <ul className="list-disc list-inside space-y-1 text-left">
                  {getSuggestions(agent.id).map((suggestion, index) => (
                    <li key={index}>{suggestion}</li>
                  ))}
                </ul>
              </div>
            </motion.div>
          </div>
        ) : (
          <AnimatePresence>
            {chat.messages.map((message, index) => (
              <MessageBubble
                key={message.id}
                message={message}
                agent={agent}
                isConsecutive={
                  index > 0 && 
                  chat.messages[index - 1].sender === message.sender &&
                  new Date(message.timestamp) - new Date(chat.messages[index - 1].timestamp) < 60000
                }
              />
            ))}
          </AnimatePresence>
        )}
        
        {/* Loading indicator */}
        {loading && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="flex items-center space-x-2 p-4"
          >
            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-neutral-200 dark:bg-neutral-700">
              <span className="text-sm">{agent.avatar}</span>
            </div>
            <div className="bg-white dark:bg-neutral-800 rounded-lg p-3 shadow-sm">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-neutral-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-neutral-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                <div className="w-2 h-2 bg-neutral-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              </div>
            </div>
          </motion.div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <InputBox />
    </div>
  );
};

export default ChatWindow;