import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { motion } from 'framer-motion';
import { Loader2, Leaf, Eye, EyeOff, Check, Chrome } from 'lucide-react';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
  const { login, loginWithGoogle, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/scheduler', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      await login(email, password);
      const from = location.state?.from?.pathname || '/scheduler';
      navigate(from, { replace: true });
    } catch (err: any) {
      setError(err.message || 'Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDemoLogin = () => {
    setEmail('admin@ecopulse.ai');
    setPassword('password123');
  };

  const handleGoogleLogin = async () => {
    setError('');
    setIsLoading(true);

    try {
      const googleEmail = (email.trim() || window.prompt('Enter your Google email', 'google.user@ecopulse.ai') || '').trim().toLowerCase();
      if (!googleEmail) {
        setError('Google login was cancelled.');
        return;
      }

      const displayName = googleEmail.split('@')[0];
      await loginWithGoogle(googleEmail, displayName);
      navigate('/scheduler', { replace: true });
    } catch (err: any) {
      setError(err.message || 'Google sign-in failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(201,122,29,0.15),_transparent_28%),radial-gradient(circle_at_bottom_right,_rgba(217,166,26,0.12),_transparent_30%),linear-gradient(180deg,#fffaf2_0%,#ffffff_45%,#fffdf9_100%)] flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-24 -right-24 w-80 h-80 rounded-full bg-eco-primary/15 blur-3xl"></div>
        <div className="absolute -bottom-24 -left-24 w-72 h-72 rounded-full bg-eco-primary-glow/10 blur-3xl"></div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="w-full max-w-md relative z-10"
      >
        <div className="bg-white/95 backdrop-blur-xl rounded-[2rem] border border-eco-border shadow-[0_28px_70px_-35px_rgba(201,122,29,0.45)] p-8 md:p-10">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="text-center mb-8"
          >
            <div className="inline-flex items-center justify-center gap-3 px-4 py-3 rounded-full bg-eco-primary/10 text-eco-primary mb-4 ring-1 ring-eco-primary/20">
              <div className="flex items-center justify-center w-11 h-11 rounded-full bg-eco-primary text-white shadow-[0_12px_30px_rgba(201,122,29,0.25)]">
                <Leaf className="w-6 h-6" />
              </div>
              <span className="text-xs font-semibold uppercase tracking-[0.45em]">EcoPulse AI</span>
            </div>
            <h1 className="text-3xl font-semibold text-eco-dark tracking-tight">Welcome back</h1>
            <p className="text-sm text-eco-muted mt-2">Sign in to access the saffron-gold sustainability dashboard.</p>
          </motion.div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-eco-text mb-2">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 bg-white border border-eco-border rounded-2xl text-eco-text placeholder-eco-muted focus:outline-none focus:ring-2 focus:ring-eco-primary/30 focus:border-eco-primary transition-all duration-200 shadow-sm"
                placeholder="admin@ecopulse.ai"
                required
                disabled={isLoading}
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-eco-text mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 bg-white border border-eco-border rounded-2xl text-eco-text placeholder-eco-muted focus:outline-none focus:ring-2 focus:ring-eco-primary/30 focus:border-eco-primary transition-all duration-200 pr-12 shadow-sm"
                  placeholder="••••••••"
                  required
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-eco-muted hover:text-eco-text transition-colors"
                  disabled={isLoading}
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-amber-50 border border-amber-200 text-amber-700 px-4 py-3 rounded-2xl text-sm flex items-center gap-2"
              >
                <span className="w-1.5 h-1.5 bg-amber-400 rounded-full flex-shrink-0"></span>
                {error}
              </motion.div>
            )}

            <div className="flex items-center justify-between">
              <label className="flex items-center space-x-2 text-sm text-eco-text cursor-pointer group">
                <div className="relative">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="sr-only"
                    disabled={isLoading}
                  />
                  <div className={`w-5 h-5 rounded-xl border-2 flex items-center justify-center transition-all duration-200 ${
                    rememberMe
                      ? 'bg-eco-primary border-eco-primary'
                      : 'border-eco-border bg-white group-hover:border-eco-primary'
                  }`}>
                    {rememberMe && <Check className="w-3.5 h-3.5 text-white" />}
                  </div>
                </div>
                <span>Remember me</span>
              </label>
              <Link to="/forgot-password" className="text-sm text-eco-primary hover:text-eco-primary-glow transition-colors">
                Forgot password?
              </Link>
            </div>

            <motion.button
              type="submit"
              disabled={isLoading}
              whileHover={!isLoading ? { scale: 1.02 } : {}}
              whileTap={!isLoading ? { scale: 0.98 } : {}}
              className="w-full py-3 bg-gradient-to-r from-eco-primary to-eco-accent text-white font-semibold rounded-2xl hover:from-[#d99d26] hover:to-[#c57c24] transition-all duration-200 shadow-lg shadow-eco-primary/20 disabled:opacity-60 disabled:cursor-not-allowed relative overflow-hidden"
            >
              {isLoading ? (
                <span className="flex items-center justify-center space-x-2">
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Signing in...</span>
                </span>
              ) : (
                'Sign In'
              )}
            </motion.button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-eco-border"></div>
              </div>
              <div className="relative flex justify-center text-xs uppercase tracking-[0.25em] text-eco-text/70">
                <span className="bg-white px-3">Or</span>
              </div>
            </div>

            <motion.button
              type="button"
              onClick={handleGoogleLogin}
              disabled={isLoading}
              whileHover={!isLoading ? { scale: 1.02 } : {}}
              whileTap={!isLoading ? { scale: 0.98 } : {}}
              className="w-full py-3 border border-eco-border bg-white text-eco-dark font-semibold rounded-2xl hover:border-eco-primary hover:bg-amber-50 transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              <Chrome className="w-5 h-5 text-eco-primary" />
              Continue with Google
            </motion.button>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="mt-6 p-5 bg-amber-50 rounded-2xl border border-amber-200"
            >
              <div className="text-center">
                <p className="text-xs text-eco-muted mb-2">Demo Credentials</p>
                <div className="flex items-center justify-center gap-3 text-sm flex-wrap">
                  <span className="font-mono text-eco-primary">admin@ecopulse.ai</span>
                  <span className="text-eco-muted">/</span>
                  <span className="font-mono text-eco-primary">password123</span>
                </div>
                <button
                  type="button"
                  onClick={handleDemoLogin}
                  className="mt-2 text-xs text-eco-primary/90 hover:text-eco-primary transition-colors underline-offset-2 hover:underline"
                >
                  Auto-fill credentials
                </button>
              </div>
            </motion.div>

            <div className="text-center">
              <Link to="/" className="text-sm text-eco-text hover:text-eco-primary transition-colors">
                ← Back to Home
              </Link>
            </div>
          </form>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;