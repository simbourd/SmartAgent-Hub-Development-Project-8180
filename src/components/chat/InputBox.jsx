import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useChat } from '../../contexts/ChatContext';
import SafeIcon from '../../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiSend } = FiIcons;

const InputBox = () => {
  const { t } = useTranslation();
  const { sendMessage, loading } = useChat();
  const [message, setMessage] = useState('');
  const textareaRef = useRef(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!message.trim() || loading) return;
    
    const messageToSend = message.trim();
    setMessage('');
    
    // Reset textarea height
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
    
    await sendMessage(messageToSend);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const handleTextareaChange = (e) => {
    setMessage(e.target.value);
    
    // Auto-resize textarea
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`;
    }
  };

  return (
    <div className="border-t border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 p-4">
      <form onSubmit={handleSubmit} className="flex items-end space-x-3">
        {/* Message Input */}
        <div className="flex-1 relative">
          <textarea
            ref={textareaRef}
            value={message}
            onChange={handleTextareaChange}
            onKeyPress={handleKeyPress}
            placeholder={t('chat.typePlaceholder')}
            className="w-full px-4 py-3 bg-neutral-50 dark:bg-neutral-700 border border-neutral-300 dark:border-neutral-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary-400 focus:border-transparent resize-none text-primary-900 dark:text-white placeholder-neutral-500 dark:placeholder-neutral-400"
            rows="1"
            style={{ minHeight: '48px', maxHeight: '120px' }}
            disabled={loading}
          />
        </div>
        
        {/* Send Button */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          type="submit"
          disabled={!message.trim() || loading}
          className={`flex-shrink-0 p-3 rounded-lg transition-all duration-200 ${
            message.trim() && !loading
              ? 'bg-secondary-400 hover:bg-secondary-500 text-white shadow-lg hover:shadow-xl'
              : 'bg-neutral-300 dark:bg-neutral-600 text-neutral-500 dark:text-neutral-400 cursor-not-allowed'
          }`}
        >
          {loading ? (
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          ) : (
            <SafeIcon icon={FiSend} className="w-5 h-5" />
          )}
        </motion.button>
      </form>
      
      {/* Hint */}
      <div className="flex items-center justify-between mt-2 text-xs text-neutral-500 dark:text-neutral-400">
        <span>{t('chat.sendHint')}</span>
        <span className="hidden sm:inline">
          {t('chat.characterCount', { count: message.length })}
        </span>
      </div>
    </div>
  );
};

export default InputBox;