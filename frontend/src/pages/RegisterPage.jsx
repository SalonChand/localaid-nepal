import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { User, Mail, Lock } from 'lucide-react';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';

const ROLES = [
  { value: 'citizen', label: 'I need help', desc: 'Citizen' },
  { value: 'volunteer', label: 'I want to help', desc: 'Volunteer' },
  { value: 'organization', label: 'We are an NGO / group', desc: 'Organization' },
];

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'citizen',
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const { register } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    try {
      await register(formData);
      navigate('/dashboard');
    } catch (err) {
      setError(
        err.response?.data?.message ||
          'Registration failed. Please try again.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col px-6">
      <div className="pt-14 pb-6">
        <div className="w-14 h-14 rounded-2xl bg-indigo-600 flex items-center justify-center text-white text-2xl font-bold mb-6">
          L
        </div>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
          Create account
        </h1>
        <p className="text-slate-500 mt-2 text-[15px]">
          Join the LocalAid network today.
        </p>
      </div>

      {error && (
        <div className="bg-rose-50 border border-rose-200 text-rose-700 px-4 py-3 rounded-xl text-sm font-medium mb-5">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4 flex-1">
        <Input
          label="Full Name"
          icon={User}
          type="text"
          name="name"
          required
          placeholder="e.g. Ram Bahadur"
          value={formData.name}
          onChange={handleChange}
        />
        <Input
          label="Email Address"
          icon={Mail}
          type="email"
          name="email"
          required
          placeholder="name@example.com"
          value={formData.email}
          onChange={handleChange}
          autoComplete="email"
        />
        <Input
          label="Password"
          icon={Lock}
          type="password"
          name="password"
          required
          placeholder="••••••••"
          value={formData.password}
          onChange={handleChange}
          autoComplete="new-password"
        />

        <div>
          <span className="block text-sm font-semibold text-slate-700 mb-2 ml-1">
            I am registering as
          </span>
          <div className="space-y-2">
            {ROLES.map((r) => {
              const active = formData.role === r.value;
              return (
                <button
                  type="button"
                  key={r.value}
                  onClick={() => setFormData({ ...formData, role: r.value })}
                  className={`w-full flex items-center justify-between px-4 py-3.5 rounded-xl border text-left transition-all active:scale-[0.99]
                    ${
                      active
                        ? 'border-indigo-500 bg-indigo-50'
                        : 'border-slate-200 bg-slate-50'
                    }`}
                >
                  <div>
                    <div className="font-semibold text-slate-900 text-[15px]">
                      {r.label}
                    </div>
                    <div className="text-xs text-slate-400">{r.desc}</div>
                  </div>
                  <span
                    className={`w-5 h-5 rounded-full border-2 flex items-center justify-center
                      ${active ? 'border-indigo-600' : 'border-slate-300'}`}
                  >
                    {active && (
                      <span className="w-2.5 h-2.5 rounded-full bg-indigo-600" />
                    )}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="pt-2">
          <Button type="submit" variant="primary" loading={isLoading}>
            Create Account
          </Button>
        </div>
      </form>

      <div
        className="text-center text-[15px] text-slate-500 py-8"
        style={{ paddingBottom: 'calc(env(safe-area-inset-bottom) + 1rem)' }}
      >
        Already have an account?{' '}
        <Link to="/login" className="text-indigo-600 font-semibold">
          Sign in
        </Link>
      </div>
    </div>
  );
};

export default RegisterPage;
