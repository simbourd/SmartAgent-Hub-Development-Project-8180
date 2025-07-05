import React, { createContext, useContext, useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { v4 as uuidv4 } from 'uuid';
import axios from 'axios';

const ChatContext = createContext();

export const useChat = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
};

// Default agents configuration with updated colors
const defaultAgents = [
  {
    id: 'general',
    name: 'Chief Agent',
    type: 'general',
    description: 'Main agent that distributes tasks',
    avatar: '🤖',
    webhookUrl: 'https://n8n.example.com/webhook/chef-agent',
    active: true,
    color: '#1F2A44' // Primary deep blue
  },
  {
    id: 'support',
    name: 'Support Agent',
    type: 'agent',
    description: 'Technical assistance and customer support',
    avatar: '🛠️',
    webhookUrl: 'https://n8n.example.com/webhook/support-agent',
    active: true,
    color: '#3BBFD6' // Secondary teal
  },
  {
    id: 'sales',
    name: 'Sales Agent',
    type: 'agent',
    description: 'Sales and customer relations',
    avatar: '💼',
    webhookUrl: 'https://n8n.example.com/webhook/sales-agent',
    active: true,
    color: '#3DC487' // Accent green
  },
  {
    id: 'marketing',
    name: 'Marketing Agent',
    type: 'agent',
    description: 'Marketing strategy and communication',
    avatar: '📈',
    webhookUrl: 'https://n8n.example.com/webhook/marketing-agent',
    active: true,
    color: '#A0A6B1' // Medium gray
  }
];

export const ChatProvider = ({ children }) => {
  const { t } = useTranslation();
  const [chats, setChats] = useState([]);
  const [activeChat, setActiveChat] = useState(null);
  const [agents, setAgents] = useState(defaultAgents);
  const [loading, setLoading] = useState(false);

  const createChat = useCallback((agentId) => {
    const agent = agents.find(a => a.id === agentId);
    if (!agent) return null;

    const newChat = {
      id: uuidv4(),
      agentId,
      agentName: agent.name,
      type: agent.type,
      messages: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    setChats(prev => [newChat, ...prev]);
    setActiveChat(newChat.id);
    return newChat;
  }, [agents]);

  const sendMessage = useCallback(async (content, chatId = activeChat) => {
    if (!content.trim() || !chatId) return;

    const chat = chats.find(c => c.id === chatId);
    if (!chat) return;

    const agent = agents.find(a => a.id === chat.agentId);
    if (!agent) return;

    // Add user message
    const userMessage = {
      id: uuidv4(),
      sender: 'user',
      content: content.trim(),
      timestamp: new Date().toISOString()
    };

    setChats(prev => prev.map(c => 
      c.id === chatId 
        ? { ...c, messages: [...c.messages, userMessage], updatedAt: new Date().toISOString() }
        : c
    ));

    setLoading(true);

    try {
      // Simulate API call to n8n webhook
      const response = await simulateWebhookCall(agent.webhookUrl, {
        message: content,
        chatId,
        agentId: agent.id,
        timestamp: new Date().toISOString()
      }, t);

      // Add agent response
      const agentMessage = {
        id: uuidv4(),
        sender: 'agent',
        agentName: agent.name,
        content: response.message,
        timestamp: new Date().toISOString()
      };

      setChats(prev => prev.map(c => 
        c.id === chatId 
          ? { ...c, messages: [...c.messages, agentMessage], updatedAt: new Date().toISOString() }
          : c
      ));

    } catch (error) {
      console.error('Error sending message:', error);
      
      // Add error message
      const errorMessage = {
        id: uuidv4(),
        sender: 'agent',
        agentName: agent.name,
        content: t('chat.errorMessage'),
        timestamp: new Date().toISOString(),
        error: true
      };

      setChats(prev => prev.map(c => 
        c.id === chatId 
          ? { ...c, messages: [...c.messages, errorMessage], updatedAt: new Date().toISOString() }
          : c
      ));
    } finally {
      setLoading(false);
    }
  }, [chats, activeChat, agents, t]);

  const deleteChat = useCallback((chatId) => {
    setChats(prev => prev.filter(c => c.id !== chatId));
    if (activeChat === chatId) {
      setActiveChat(null);
    }
  }, [activeChat]);

  const updateAgent = useCallback((agentId, updates) => {
    setAgents(prev => prev.map(agent => 
      agent.id === agentId ? { ...agent, ...updates } : agent
    ));
  }, []);

  const addAgent = useCallback((agentData) => {
    const newAgent = {
      id: uuidv4(),
      ...agentData,
      createdAt: new Date().toISOString()
    };
    setAgents(prev => [...prev, newAgent]);
    return newAgent;
  }, []);

  const value = {
    chats,
    activeChat,
    agents,
    loading,
    setActiveChat,
    createChat,
    sendMessage,
    deleteChat,
    updateAgent,
    addAgent
  };

  return (
    <ChatContext.Provider value={value}>
      {children}
    </ChatContext.Provider>
  );
};

// Simulate webhook call for demo purposes
const simulateWebhookCall = async (webhookUrl, data, t) => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));

  // Mock responses based on agent type
  const responses = {
    'chef-agent': t('responses.chiefAgent', { returnObjects: true }),
    'support-agent': t('responses.supportAgent', { returnObjects: true }),
    'sales-agent': t('responses.salesAgent', { returnObjects: true }),
    'marketing-agent': t('responses.marketingAgent', { returnObjects: true })
  };

  const agentType = webhookUrl.includes('chef-agent') ? 'chef-agent' :
                   webhookUrl.includes('support-agent') ? 'support-agent' :
                   webhookUrl.includes('sales-agent') ? 'sales-agent' :
                   webhookUrl.includes('marketing-agent') ? 'marketing-agent' : 'chef-agent';

  const possibleResponses = responses[agentType] || responses['chef-agent'];
  const randomResponse = possibleResponses[Math.floor(Math.random() * possibleResponses.length)];

  return {
    message: randomResponse,
    success: true,
    timestamp: new Date().toISOString()
  };
};