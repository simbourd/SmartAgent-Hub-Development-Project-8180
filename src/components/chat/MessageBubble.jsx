import React from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { format } from 'date-fns';
import { fr, enUS } from 'date-fns/locale';
import { useAuth } from '../../contexts/AuthContext';

const MessageBubble = ({ message, agent, isConsecutive }) => {
  const { t, i18n } = useTranslation();
  const { user } = useAuth();
  const isUser = message.sender === 'user';
  
  const dateLocale = i18n.language === 'fr' ? fr : enUS;
  
  const formatTime = (timestamp) => {
    return format(new Date(timestamp), 'HH:mm', { locale: dateLocale });
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

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`flex ${isUser ? 'justify-end' : 'justify-start'} ${isConsecutive ? 'mt-1' : 'mt-4'}`}
    >
      <div className={`flex items-end space-x-2 max-w-xs lg:max-w-md ${isUser ? 'flex-row-reverse space-x-reverse' : ''}`}>
        {/* Avatar */}
        {!isConsecutive && (
          <div className="flex-shrink-0">
            {isUser ? (
              <img
                src={user.avatar}
                alt={user.name}
                className="w-8 h-8 rounded-full"
              />
            ) : (
              <div className="w-8 h-8 rounded-full bg-neutral-200 dark:bg-neutral-700 flex items-center justify-center">
                <span className="text-sm">{agent.avatar}</span>
              </div>
            )}
          </div>
        )}
        
        {/* Message Content */}
        <div className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}>
          {/* Name and Time */}
          {!isConsecutive && (
            <div className={`flex items-center space-x-2 mb-1 ${isUser ? 'flex-row-reverse space-x-reverse' : ''}`}>
              <span className="text-xs font-medium text-neutral-600 dark:text-neutral-400">
                {isUser ? t('dashboard.you') : getAgentName(agent.id)}
              </span>
              <span className="text-xs text-neutral-500 dark:text-neutral-500">
                {formatTime(message.timestamp)}
              </span>
            </div>
          )}
          
          {/* Message Bubble */}
          <div
            className={`px-4 py-2 rounded-lg ${
              isUser
                ? 'bg-secondary-400 text-white'
                : message.error
                ? 'bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-400 border border-red-200 dark:border-red-800'
                : 'bg-white dark:bg-neutral-800 text-primary-900 dark:text-white border border-neutral-200 dark:border-neutral-700'
            } ${
              isConsecutive
                ? isUser
                  ? 'rounded-tr-sm'
                  : 'rounded-tl-sm'
                : ''
            } shadow-sm`}
          >
            <p className="text-sm whitespace-pre-wrap break-words">
              {message.error ? t('chat.errorMessage') : message.content}
            </p>
          </div>
          
          {/* Time for consecutive messages */}
          {isConsecutive && (
            <span className="text-xs text-neutral-500 dark:text-neutral-500 mt-1">
              {formatTime(message.timestamp)}
            </span>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default MessageBubble;