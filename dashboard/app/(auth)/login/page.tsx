'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Mock authentication - in production, validate against Firebase
    if (email && password) {
      // Simulate login delay
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // For demo, any email/password combination works
      if (email === 'nanthan77@gmail.com' && password === 'admin123') {
        router.push('/');
      } else {
        setError('Invalid email or password');
      }
    } else {
      setError('Please fill in all fields');
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-navy-600 to-teal-600 flex items-center justify-center px-4">
      {/* Background decorative elements */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-navy-500 rounded-full opacity-20 -translate-x-1/2 -translate-y-1/2"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-teal-500 rounded-full opacity-20 translate-x-1/2 translate-y-1/2"></div>

      {/* Login Card */}
      <div className="relative w-full max-w-md">
        <div className="card shadow-card-elevated">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-navy-600 rounded-xl flex items-center justify-center text-white font-bold text-2xl mx-auto mb-4">
              YN
            </div>
            <h1 className="text-2xl font-bold text-charcoal-900 mb-2">Yaal Nilam</h1>
            <p className="text-charcoal-600">Sign in to Admin Dashboard</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Error Message */}
            {error && (
              <div className="p-3 bg-danger bg-opacity-10 border border-danger border-opacity-30 rounded-lg text-danger text-sm">
                {error}
              </div>
            )}

            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-charcoal-900 mb-2">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="nanthan77@gmail.com"
                className="input-field"
                disabled={loading}
              />
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-charcoal-900 mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="input-field pr-10"
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-charcoal-500 hover:text-charcoal-700"
                  disabled={loading}
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            {/* Remember Me */}
            <div className="flex items-center">
              <input
                id="remember"
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-4 h-4 border border-navy-300 rounded accent-navy-600 cursor-pointer"
                disabled={loading}
              />
              <label
                htmlFor="remember"
                className="ml-2 text-sm text-charcoal-700 cursor-pointer select-none"
              >
                Remember me
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full btn-primary mt-6"
            >
              {loading ? 'Signing in...' : 'Sign in to Admin Dashboard'}
            </button>
          </form>

          {/* Footer */}
          <div className="mt-6 pt-6 border-t border-sand-200 text-center text-sm text-charcoal-600">
            <p>
              Demo credentials: nanthan77@gmail.com / admin123
            </p>
          </div>
        </div>

        {/* Footer Text */}
        <p className="text-center mt-6 text-sand-100 text-sm">
          Yaal Nilam Admin Dashboard © 2024
        </p>
      </div>
    </div>
  );
}
