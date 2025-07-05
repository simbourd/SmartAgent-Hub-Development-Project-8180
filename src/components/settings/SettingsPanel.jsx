import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useChat } from '../../contexts/ChatContext';
import { useTheme } from '../../contexts/ThemeContext';
import SafeIcon from '../../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { 
  FiX, 
  FiSettings, 
  FiBot, 
  FiPlus, 
  FiEdit3, 
  FiTrash2, 
  FiSave, 
  FiToggleLeft, 
  FiToggleRight, 
  FiGlobe, 
  FiMoon, 
  FiSun 
} = FiIcons;

const SettingsPanel = ({ onClose }) => {
  const { agents, updateAgent, addAgent } = useChat();
  const { isDark, toggleTheme } = useTheme();
  const [activeTab, setActiveTab] = useState('agents');
  const [editingAgent, setEditingAgent] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    avatar: '🤖',
    webhookUrl: '',
    active: true,
    color: '#1F2A44'
  });

  const handleEditAgent = (agent) => {
    setEditingAgent(agent.id);
    setFormData({
      name: agent.name,
      description: agent.description,
      avatar: agent.avatar,
      webhookUrl: agent.webhookUrl,
      active: agent.active,
      color: agent.color
    });
  };

  const handleSaveAgent = () => {
    if (editingAgent) {
      updateAgent(editingAgent, formData);
      setEditingAgent(null);
    } else {
      addAgent(formData);
      setShowAddForm(false);
    }
    resetForm();
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      avatar: '🤖',
      webhookUrl: '',
      active: true,
      color: '#1F2A44'
    });
  };

  const handleCancel = () => {
    setEditingAgent(null);
    setShowAddForm(false);
    resetForm();
  };

  const handleToggleActive = (agentId) => {
    const agent = agents.find(a => a.id === agentId);
    if (agent) {
      updateAgent(agentId, { active: !agent.active });
    }
  };

  const availableEmojis = ['🤖', '🛠️', '💼', '📈', '🎯', '⚡', '🔧', '📊', '💡', '🎨', '📱', '🌟'];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ duration: 0.3 }}
        className="bg-white dark:bg-neutral-800 rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-neutral-200 dark:border-neutral-700">
          <div className="flex items-center">
            <SafeIcon icon={FiSettings} className="w-6 h-6 mr-3 text-secondary-400" />
            <h2 className="text-xl font-semibold text-primary-900 dark:text-white">
              Paramètres
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-700 transition-colors"
          >
            <SafeIcon icon={FiX} className="w-5 h-5 text-neutral-600 dark:text-neutral-400" />
          </button>
        </div>

        <div className="flex h-full max-h-[calc(90vh-80px)]">
          {/* Sidebar */}
          <div className="w-64 bg-neutral-50 dark:bg-neutral-900 border-r border-neutral-200 dark:border-neutral-700">
            <nav className="p-4 space-y-2">
              <button
                onClick={() => setActiveTab('agents')}
                className={`w-full flex items-center p-3 rounded-lg text-left transition-colors ${
                  activeTab === 'agents'
                    ? 'bg-secondary-100 dark:bg-secondary-900/20 text-secondary-700 dark:text-secondary-400'
                    : 'text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800'
                }`}
              >
                <SafeIcon icon={FiBot} className="w-5 h-5 mr-3" />
                Agents IA
              </button>
              <button
                onClick={() => setActiveTab('general')}
                className={`w-full flex items-center p-3 rounded-lg text-left transition-colors ${
                  activeTab === 'general'
                    ? 'bg-secondary-100 dark:bg-secondary-900/20 text-secondary-700 dark:text-secondary-400'
                    : 'text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800'
                }`}
              >
                <SafeIcon icon={FiGlobe} className="w-5 h-5 mr-3" />
                Général
              </button>
            </nav>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto">
            {activeTab === 'agents' && (
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-primary-900 dark:text-white">
                    Gestion des Agents IA
                  </h3>
                  <button
                    onClick={() => setShowAddForm(true)}
                    className="flex items-center px-4 py-2 bg-secondary-400 hover:bg-secondary-500 text-white rounded-lg transition-colors"
                  >
                    <SafeIcon icon={FiPlus} className="w-4 h-4 mr-2" />
                    Nouvel Agent
                  </button>
                </div>

                {/* Add/Edit Form */}
                <AnimatePresence>
                  {(showAddForm || editingAgent) && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                      className="bg-neutral-50 dark:bg-neutral-900 rounded-lg p-6 mb-6"
                    >
                      <h4 className="text-lg font-medium text-primary-900 dark:text-white mb-4">
                        {editingAgent ? 'Modifier l\'agent' : 'Nouvel agent'}
                      </h4>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                            Nom
                          </label>
                          <input
                            type="text"
                            value={formData.name}
                            onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                            className="w-full px-3 py-2 border border-neutral-300 dark:border-neutral-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary-400 bg-white dark:bg-neutral-800 text-primary-900 dark:text-white"
                            placeholder="Nom de l'agent"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                            Avatar
                          </label>
                          <div className="flex items-center space-x-2">
                            <input
                              type="text"
                              value={formData.avatar}
                              onChange={(e) => setFormData(prev => ({ ...prev, avatar: e.target.value }))}
                              className="w-16 px-3 py-2 border border-neutral-300 dark:border-neutral-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary-400 bg-white dark:bg-neutral-800 text-primary-900 dark:text-white text-center"
                            />
                            <div className="flex flex-wrap gap-1">
                              {availableEmojis.map(emoji => (
                                <button
                                  key={emoji}
                                  type="button"
                                  onClick={() => setFormData(prev => ({ ...prev, avatar: emoji }))}
                                  className="p-1 hover:bg-neutral-200 dark:hover:bg-neutral-700 rounded"
                                >
                                  {emoji}
                                </button>
                              ))}
                            </div>
                          </div>
                        </div>

                        <div className="md:col-span-2">
                          <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                            Description
                          </label>
                          <textarea
                            value={formData.description}
                            onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                            rows="3"
                            className="w-full px-3 py-2 border border-neutral-300 dark:border-neutral-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary-400 bg-white dark:bg-neutral-800 text-primary-900 dark:text-white"
                            placeholder="Description de l'agent"
                          />
                        </div>

                        <div className="md:col-span-2">
                          <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                            URL Webhook n8n
                          </label>
                          <input
                            type="url"
                            value={formData.webhookUrl}
                            onChange={(e) => setFormData(prev => ({ ...prev, webhookUrl: e.target.value }))}
                            className="w-full px-3 py-2 border border-neutral-300 dark:border-neutral-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary-400 bg-white dark:bg-neutral-800 text-primary-900 dark:text-white"
                            placeholder="https://n8n.example.com/webhook/agent-name"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                            Couleur
                          </label>
                          <input
                            type="color"
                            value={formData.color}
                            onChange={(e) => setFormData(prev => ({ ...prev, color: e.target.value }))}
                            className="w-full h-10 border border-neutral-300 dark:border-neutral-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary-400"
                          />
                        </div>

                        <div className="flex items-center">
                          <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                            Actif
                          </label>
                          <button
                            type="button"
                            onClick={() => setFormData(prev => ({ ...prev, active: !prev.active }))}
                            className="ml-3 mb-2"
                          >
                            <SafeIcon 
                              icon={formData.active ? FiToggleRight : FiToggleLeft} 
                              className={`w-8 h-8 ${formData.active ? 'text-accent-500' : 'text-neutral-400'}`} 
                            />
                          </button>
                        </div>
                      </div>

                      <div className="flex justify-end space-x-3 mt-6">
                        <button
                          onClick={handleCancel}
                          className="px-4 py-2 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-neutral-700 rounded-lg transition-colors"
                        >
                          Annuler
                        </button>
                        <button
                          onClick={handleSaveAgent}
                          className="flex items-center px-4 py-2 bg-secondary-400 hover:bg-secondary-500 text-white rounded-lg transition-colors"
                        >
                          <SafeIcon icon={FiSave} className="w-4 h-4 mr-2" />
                          Sauvegarder
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Agents List */}
                <div className="space-y-4">
                  {agents.map((agent) => (
                    <motion.div
                      key={agent.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-white dark:bg-neutral-700 rounded-lg p-4 border border-neutral-200 dark:border-neutral-600"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <div
                            className="w-12 h-12 rounded-lg flex items-center justify-center mr-4"
                            style={{ backgroundColor: agent.color + '20' }}
                          >
                            <span className="text-xl">{agent.avatar}</span>
                          </div>
                          <div>
                            <h4 className="text-lg font-semibold text-primary-900 dark:text-white">
                              {agent.name}
                            </h4>
                            <p className="text-sm text-neutral-600 dark:text-neutral-400">
                              {agent.description}
                            </p>
                            <p className="text-xs text-neutral-500 dark:text-neutral-500 mt-1">
                              {agent.webhookUrl}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => handleToggleActive(agent.id)}
                            className="p-2 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-600 transition-colors"
                            title={agent.active ? 'Désactiver' : 'Activer'}
                          >
                            <SafeIcon 
                              icon={agent.active ? FiToggleRight : FiToggleLeft} 
                              className={`w-6 h-6 ${agent.active ? 'text-accent-500' : 'text-neutral-400'}`} 
                            />
                          </button>
                          <button
                            onClick={() => handleEditAgent(agent)}
                            className="p-2 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-600 transition-colors"
                            title="Modifier"
                          >
                            <SafeIcon icon={FiEdit3} className="w-5 h-5 text-neutral-600 dark:text-neutral-400" />
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'general' && (
              <div className="p-6">
                <h3 className="text-lg font-semibold text-primary-900 dark:text-white mb-6">
                  Paramètres Généraux
                </h3>
                
                <div className="space-y-6">
                  <div className="flex items-center justify-between p-4 bg-neutral-50 dark:bg-neutral-900 rounded-lg">
                    <div>
                      <h4 className="text-sm font-medium text-primary-900 dark:text-white">
                        Thème
                      </h4>
                      <p className="text-sm text-neutral-600 dark:text-neutral-400">
                        Choisir entre le mode clair et sombre
                      </p>
                    </div>
                    <button
                      onClick={toggleTheme}
                      className="flex items-center space-x-2 px-4 py-2 bg-white dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-600 rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-700 transition-colors"
                    >
                      <SafeIcon icon={isDark ? FiSun : FiMoon} className="w-4 h-4" />
                      <span className="text-sm">{isDark ? 'Clair' : 'Sombre'}</span>
                    </button>
                  </div>

                  <div className="p-4 bg-neutral-50 dark:bg-neutral-900 rounded-lg">
                    <h4 className="text-sm font-medium text-primary-900 dark:text-white mb-2">
                      Version
                    </h4>
                    <p className="text-sm text-neutral-600 dark:text-neutral-400">
                      SmartAgent Hub v1.0.0
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default SettingsPanel;