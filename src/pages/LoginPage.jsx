import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import SafeIcon from '../common/SafeIcon';
import LanguageSelector from '../components/common/LanguageSelector';
import * as FiIcons from 'react-icons/fi';

const { FiMail, FiLock, FiEye, FiEyeOff, FiSun, FiMoon, FiBot } = FiIcons;

const LoginPage = () => {
  const { t } = useTranslation();
  const { user, login, resetPassword } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [showReset, setShowReset] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [resetLoading, setResetLoading] = useState(false);
  const [resetSuccess, setResetSuccess] = useState(false);

  // Redirect if already logged in
  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.email) {
      newErrors.email = t('auth.emailRequired');
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = t('auth.emailInvalid');
    }
    
    if (!formData.password) {
      newErrors.password = t('auth.passwordRequired');
    } else if (formData.password.length < 6) {
      newErrors.password = t('auth.passwordMinLength');
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      // Gentle shake animation
      const form = e.target;
      form.classList.add('animate-bounce-gentle');
      setTimeout(() => form.classList.remove('animate-bounce-gentle'), 600);
      return;
    }

    setLoading(true);
    setErrors({});

    try {
      const result = await login(formData.email, formData.password, formData.rememberMe);
      
      if (!result.success) {
        setErrors({ general: result.error || t('auth.invalidCredentials') });
        // Gentle shake animation
        const form = e.target;
        form.classList.add('animate-bounce-gentle');
        setTimeout(() => form.classList.remove('animate-bounce-gentle'), 600);
      }
    } catch (error) {
      setErrors({ general: t('auth.loginError') });
    } finally {
      setLoading(false);
    }
  };

  const handleReset = async (e) => {
    e.preventDefault();
    
    if (!resetEmail || !/\S+@\S+\.\S+/.test(resetEmail)) {
      setErrors({ reset: t('auth.validEmailRequired') });
      return;
    }

    setResetLoading(true);
    setErrors({});

    try {
      const result = await resetPassword(resetEmail);
      
      if (result.success) {
        setResetSuccess(true);
        setTimeout(() => {
          setShowReset(false);
          setResetSuccess(false);
          setResetEmail('');
        }, 3000);
      } else {
        setErrors({ reset: result.error || t('auth.resetError') });
      }
    } catch (error) {
      setErrors({ reset: t('auth.loginError') });
    } finally {
      setResetLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-neutral-50 to-secondary-50 dark:from-neutral-900 dark:to-primary-900 px-4 sm:px-6 lg:px-8">
      {/* Top Controls */}
      <div className="fixed top-4 right-4 flex items-center space-x-2 z-10">
        <LanguageSelector />
        <button
          onClick={toggleTheme}
          className="p-3 rounded-full bg-white dark:bg-neutral-800 shadow-lg hover:shadow-xl transition-all duration-300"
        >
          <SafeIcon 
            icon={isDark ? FiSun : FiMoon} 
            className="w-5 h-5 text-neutral-600 dark:text-neutral-300" 
          />
        </button>
      </div>

      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <div className="flex items-center justify-center mb-4">
            <div className="bg-primary-900 p-3 rounded-full">
              <SafeIcon icon={FiBot} className="w-8 h-8 text-white" />
            </div>
          </div>
          <h2 className="text-3xl font-bold text-primary-900 dark:text-white">
            {t('auth.title')}
          </h2>
          <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-400">
            {t('auth.subtitle')}
          </p>
        </motion.div>

        {/* Login Form */}
        {!showReset ? (
          <motion.form 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            onSubmit={handleSubmit}
            className="bg-white dark:bg-neutral-800 py-8 px-6 shadow-xl rounded-xl space-y-6"
          >
            {errors.general && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 px-4 py-3 rounded-lg text-sm"
              >
                {errors.general}
              </motion.div>
            )}

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                {t('auth.email')}
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <SafeIcon icon={FiMail} className="h-5 w-5 text-neutral-400" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`block w-full pl-10 pr-3 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary-400 focus:border-transparent transition-all duration-200 ${
                    errors.email 
                      ? 'border-red-300 dark:border-red-600 bg-red-50 dark:bg-red-900/20' 
                      : 'border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-700'
                  } text-primary-900 dark:text-white placeholder-neutral-500 dark:placeholder-neutral-400`}
                  placeholder="votre@email.com"
                />
              </div>
              {errors.email && (
                <motion.p 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-2 text-sm text-red-600 dark:text-red-400"
                >
                  {errors.email}
                </motion.p>
              )}
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                {t('auth.password')}
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <SafeIcon icon={FiLock} className="h-5 w-5 text-neutral-400" />
                </div>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  value={formData.password}
                  onChange={handleChange}
                  className={`block w-full pl-10 pr-12 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary-400 focus:border-transparent transition-all duration-200 ${
                    errors.password 
                      ? 'border-red-300 dark:border-red-600 bg-red-50 dark:bg-red-900/20' 
                      : 'border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-700'
                  } text-primary-900 dark:text-white placeholder-neutral-500 dark:placeholder-neutral-400`}
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  <SafeIcon 
                    icon={showPassword ? FiEyeOff : FiEye} 
                    className="h-5 w-5 text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300 transition-colors" 
                  />
                </button>
              </div>
              {errors.password && (
                <motion.p 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-2 text-sm text-red-600 dark:text-red-400"
                >
                  {errors.password}
                </motion.p>
              )}
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="rememberMe"
                  type="checkbox"
                  checked={formData.rememberMe}
                  onChange={handleChange}
                  className="h-4 w-4 text-secondary-400 focus:ring-secondary-400 border-neutral-300 dark:border-neutral-600 rounded"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-neutral-700 dark:text-neutral-300">
                  {t('auth.rememberMe')}
                </label>
              </div>

              <button
                type="button"
                onClick={() => setShowReset(true)}
                className="text-sm text-secondary-400 hover:text-secondary-500 dark:text-secondary-400 dark:hover:text-secondary-300 transition-colors"
              >
                {t('auth.forgotPassword')}
              </button>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-primary-900 hover:bg-primary-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 hover:shadow-lg"
            >
              {loading ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  {t('auth.connecting')}
                </div>
              ) : (
                t('auth.login')
              )}
            </button>

            <div className="text-center">
              <p className="text-sm text-neutral-600 dark:text-neutral-400">
                {t('auth.noAccount')}{' '}
                <button
                  type="button"
                  className="text-secondary-400 hover:text-secondary-500 dark:text-secondary-400 dark:hover:text-secondary-300 font-medium transition-colors"
                >
                  {t('auth.createAccount')}
                </button>
              </p>
            </div>
          </motion.form>
        ) : (
          /* Reset Password Form */
          <motion.form 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            onSubmit={handleReset}
            className="bg-white dark:bg-neutral-800 py-8 px-6 shadow-xl rounded-xl space-y-6"
          >
            <div className="text-center">
              <h3 className="text-lg font-medium text-primary-900 dark:text-white mb-2">
                {t('auth.resetPassword')}
              </h3>
              <p className="text-sm text-neutral-600 dark:text-neutral-400">
                {t('auth.resetPasswordDesc')}
              </p>
            </div>

            {resetSuccess ? (
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-accent-50 dark:bg-accent-900/20 border border-accent-200 dark:border-accent-800 text-accent-700 dark:text-accent-400 px-4 py-3 rounded-lg text-sm text-center"
              >
                {t('auth.emailSent')}
              </motion.div>
            ) : (
              <>
                {errors.reset && (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 px-4 py-3 rounded-lg text-sm"
                  >
                    {errors.reset}
                  </motion.div>
                )}

                <div>
                  <label htmlFor="resetEmail" className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                    {t('auth.email')}
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <SafeIcon icon={FiMail} className="h-5 w-5 text-neutral-400" />
                    </div>
                    <input
                      id="resetEmail"
                      name="resetEmail"
                      type="email"
                      autoComplete="email"
                      value={resetEmail}
                      onChange={(e) => setResetEmail(e.target.value)}
                      className="block w-full pl-10 pr-3 py-3 border border-neutral-300 dark:border-neutral-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary-400 focus:border-transparent bg-white dark:bg-neutral-700 text-primary-900 dark:text-white placeholder-neutral-500 dark:placeholder-neutral-400"
                      placeholder="votre@email.com"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={resetLoading}
                  className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-primary-900 hover:bg-primary-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                >
                  {resetLoading ? (
                    <div className="flex items-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      {t('auth.sending')}
                    </div>
                  ) : (
                    t('auth.sendInstructions')
                  )}
                </button>
              </>
            )}

            <button
              type="button"
              onClick={() => {
                setShowReset(false);
                setResetEmail('');
                setErrors({});
                setResetSuccess(false);
              }}
              className="w-full text-sm text-neutral-600 hover:text-neutral-500 dark:text-neutral-400 dark:hover:text-neutral-300 transition-colors"
            >
              {t('auth.backToLogin')}
            </button>
          </motion.form>
        )}
      </div>
    </div>
  );
};

export default LoginPage;