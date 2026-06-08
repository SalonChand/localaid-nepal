import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Mail, Lock } from 'lucide-react';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err) {
      setError(
        err.response?.data?.message ||
          'Failed to authenticate. Please verify your credentials.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col px-6">
      <div className="pt-16 pb-8">
        <div className="w-14 h-14 rounded-2xl bg-indigo-600 flex items-center justify-center text-white text-2xl font-bold mb-6">
          L
        </div>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
          Welcome back
        </h1>
        <p className="text-slate-500 mt-2 text-[15px]">
          Sign in to continue to LocalAid.
        </p>
      </div>

      {error && (
        <div className="bg-rose-50 border border-rose-200 text-rose-700 px-4 py-3 rounded-xl text-sm font-medium mb-5">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4 flex-1">
        <Input
          label="Email Address"
          icon={Mail}
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="name@example.com"
          autoComplete="email"
        />
        <Input
          label="Password"
          icon={Lock}
          type="password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="••••••••"
          autoComplete="current-password"
        />

        <div className="pt-2">
          <Button type="submit" variant="primary" loading={isLoading}>
            Sign In
          </Button>
        </div>
      </form>

      <div
        className="text-center text-[15px] text-slate-500 py-8"
        style={{ paddingBottom: 'calc(env(safe-area-inset-bottom) + 1rem)' }}
      >
        Don't have an account?{' '}
        <Link to="/register" className="text-indigo-600 font-semibold">
          Create one
        </Link>
      </div>
    </div>
  );
};

export default LoginPage;
