import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff, CheckCircle, AlertCircle } from 'lucide-react';

export default function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [emailValid, setEmailValid] = useState(true);

  const validateEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setEmailValid(validateEmail(email));
    if (!validateEmail(email)) {
      setError('Please enter a valid email.');
      return;
    }
    setLoading(true);
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Login failed');
      setSuccess('Login successful! Redirecting...');
      setTimeout(() => {
        router.push('/');
      }, 1200);
      setEmail(''); setPassword('');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="mx-auto w-full max-w-[370px] flex flex-col items-center justify-center bg-white/10 border border-white/20 rounded-2xl shadow-2xl px-8 py-10 backdrop-blur-lg"
      style={{ boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)' }}
    >
      <div className="mb-6 w-full text-center">
        <span className="block text-3xl font-bold text-white mb-1 tracking-tight">Sign In</span>
        <span className="block text-base text-gray-300">Welcome back! Please login to your account</span>
      </div>
      <div className="space-y-5 w-full flex flex-col items-center">
        <input
          type="email"
          placeholder="Email or Phone"
          value={email}
          onChange={e => setEmail(e.target.value)}
          className={`w-full text-center bg-white/20 border border-gray-500/30 text-white placeholder-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 ${emailValid ? 'focus:ring-purple-400' : 'border-red-500 focus:ring-red-400'} transition-all duration-200 shadow-inner`}
          required
        />
        <div className="relative w-full flex items-center">
          <input
            type={showPassword ? 'text' : 'password'}
            placeholder="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            className="w-full text-center bg-white/20 border border-gray-500/30 text-white placeholder-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-400 transition-all duration-200 shadow-inner"
            required
          />
          <button
            type="button"
            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
            tabIndex={-1}
            onClick={() => setShowPassword(v => !v)}
          >
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        </div>
        <div className="flex justify-end w-full">
          <button type="button" className="text-xs text-gray-400 hover:text-purple-300 font-medium">Forgot Password?</button>
        </div>
      </div>
      <button
        type="submit"
        className="mt-6 w-full bg-gradient-to-r from-purple-500 to-purple-700 hover:from-purple-600 hover:to-purple-800 text-white py-3 rounded-xl font-semibold text-lg transition disabled:opacity-50 flex items-center justify-center gap-2 shadow-lg"
        disabled={loading}
      >
        {loading && <span className="animate-spin mr-2"><svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path></svg></span>}
        {loading ? 'Signing in...' : 'Sign In'}
      </button>
      <div className="flex items-center gap-2 my-4 w-full">
        <div className="flex-1 h-px bg-gray-700" />
        <span className="text-xs text-gray-400">or</span>
        <div className="flex-1 h-px bg-gray-700" />
      </div>
      <button
        type="button"
        className="w-full bg-black/60 border border-gray-700 text-white py-3 rounded-xl font-semibold flex items-center justify-center gap-2 hover:bg-black/80 transition shadow"
        disabled={loading}
        onClick={async () => {
          setError('');
          setSuccess('');
          setLoading(true);
          try {
            // Simulate Google OAuth popup (replace with real OAuth in production)
            const googleEmail = prompt('Enter your Google email for demo:');
            if (!googleEmail) throw new Error('Google email required');
            const googleName = prompt('Enter your Google name for demo:');
            const googleId = 'google-demo-id-' + Math.random().toString(36).slice(2, 10);
            const res = await fetch('/api/auth/google', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ email: googleEmail, name: googleName, googleId })
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || 'Google login failed');
            setSuccess('Google login successful! Redirecting...');
            setTimeout(() => {
              router.push('/');
            }, 1200);
          } catch (err: any) {
            setError(err.message);
          } finally {
            setLoading(false);
          }
        }}
      >
        Log in with Google
      </button>
      {error && (
        <div className="flex items-center gap-2 text-red-400 bg-red-900/20 border border-red-700 rounded px-3 py-2 mt-4 w-full justify-center">
          <AlertCircle size={18} />
          <span>{error}</span>
        </div>
      )}
      {success && (
        <div className="flex items-center gap-2 text-green-400 bg-green-900/20 border border-green-700 rounded px-3 py-2 mt-4 w-full justify-center">
          <CheckCircle size={18} />
          <span>{success}</span>
        </div>
      )}
    </form>
  );
}
