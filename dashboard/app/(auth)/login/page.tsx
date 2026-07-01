// @ts-nocheck
'use client'

import { useState } from 'react'
import { signInWithEmailAndPassword, signOut, GoogleAuthProvider, GithubAuthProvider, signInWithPopup, sendPasswordResetEmail } from 'firebase/auth'
import { useRouter } from 'next/navigation'
import { doc, getDoc } from 'firebase/firestore'
import { auth, db } from '@/lib/firebase'

const ADMIN_ROLES = ['super_admin', 'admin', 'listing_manager', 'lead_manager', 'content_manager']

// Bootstrap super-admin allowlist. Configurable via env for production; defaults
// to the project owner. Exact, case-insensitive match — NOT a prefix, so
// look-alike addresses like "nanthan77@attacker.com" cannot escalate.
const SUPER_ADMIN_EMAILS = (process.env.NEXT_PUBLIC_SUPERADMIN_EMAILS || 'nanthan77@gmail.com')
  .split(',')
  .map((e) => e.trim().toLowerCase())
  .filter(Boolean)

const isSuperAdminEmail = (email?: string | null) =>
  !!email && SUPER_ADMIN_EMAILS.includes(email.toLowerCase())

async function getAccessFromAdminUserRecord(email?: string | null) {
  if (!email) return ''
  const snap = await getDoc(doc(db, 'admin_users', email.toLowerCase()))
  if (!snap.exists()) return ''
  const data = snap.data() as any
  return data?.status === 'active' && ADMIN_ROLES.includes(data?.role) ? data.role : ''
}

async function resolveAdminAccess(user: any) {
  const token = await user.getIdTokenResult(true)
  const claimRole = typeof token.claims.role === 'string' ? token.claims.role : ''
  const superAdmin = isSuperAdminEmail(user.email)
  const recordRole = claimRole || (superAdmin ? 'super_admin' : await getAccessFromAdminUserRecord(user.email))
  const allowed = token.claims.admin === true || ADMIN_ROLES.includes(recordRole) || superAdmin
  return { allowed, role: superAdmin ? 'super_admin' : (recordRole || 'admin') }
}

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')

  const handleForgotPassword = async () => {
    setError('')
    setNotice('')
    if (!email) {
      setError('Enter your email address above, then click "Forgot password?".')
      return
    }
    try {
      await sendPasswordResetEmail(auth, email)
      setNotice(`Password reset link sent to ${email}.`)
    } catch {
      // Don't reveal whether an account exists.
      setNotice(`If an account exists for ${email}, a reset link has been sent.`)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      if (!email || !password) {
        setError('Please fill in all fields')
        return
      }

      const credential = await signInWithEmailAndPassword(auth, email, password)
      const access = await resolveAdminAccess(credential.user)

      if (!access.allowed) {
        await signOut(auth)
        setError('This account does not have admin dashboard access.')
        return
      }

      localStorage.setItem('admin_auth', 'true')
      localStorage.setItem('admin_role', access.role)
      router.push('/')
    } catch (err: any) {
      setError(err?.code === 'auth/invalid-credential' ? 'Invalid email or password.' : 'Unable to sign in. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleSignIn = async () => {
    setError('')
    setLoading(true)
    try {
      const provider = new GoogleAuthProvider()
      const credential = await signInWithPopup(auth, provider)
      const access = await resolveAdminAccess(credential.user)

      if (!access.allowed) {
        await signOut(auth)
        setError('This account does not have admin dashboard access.')
        return
      }

      localStorage.setItem('admin_auth', 'true')
      localStorage.setItem('admin_role', access.role)
      router.push('/')
    } catch (err: any) {
      console.error(err)
      setError('SSO Sign in failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleGithubSignIn = async () => {
    setError('')
    setLoading(true)
    try {
      const provider = new GithubAuthProvider()
      const credential = await signInWithPopup(auth, provider)
      const access = await resolveAdminAccess(credential.user)

      if (!access.allowed) {
        await signOut(auth)
        setError('This account does not have admin dashboard access.')
        return
      }

      localStorage.setItem('admin_auth', 'true')
      localStorage.setItem('admin_role', access.role)
      router.push('/')
    } catch (err: any) {
      console.error(err)
      setError('SSO Sign in failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-navy-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo and Title */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center bg-white rounded-2xl p-3 mb-4 shadow-lg">
            <img src="/logo.png" alt="Yaal Nilam — Jaffna Real Estate" className="h-20 w-auto" />
          </div>
          <p className="text-sand-300 text-sm mt-1">Property Management Dashboard</p>
        </div>

        {/* Login Card */}
        <div className="bg-white rounded-lg shadow-2xl p-8 space-y-6">
          <div>
            <h2 className="text-2xl font-bold text-charcoal-900">Welcome Back</h2>
            <p className="text-charcoal-600 text-sm mt-1">Sign in to your admin account</p>
          </div>

          {/* Error Message */}
          {error && (
            <div role="alert" className="bg-red-50 border border-red-200 rounded-lg p-3 text-sm text-red-700">
              {error}
            </div>
          )}

          {/* Notice (e.g. password reset confirmation) */}
          {notice && (
            <div role="status" aria-live="polite" className="bg-teal-50 border border-teal-200 rounded-lg p-3 text-sm text-teal-700">
              {notice}
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email Input */}
            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-charcoal-700 mb-2">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@yaalnilam.lk"
                className="w-full px-4 py-3 border border-sand-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-navy-500 focus:border-transparent transition-colors"
              />
            </div>

            {/* Password Input */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label htmlFor="password" className="block text-sm font-semibold text-charcoal-700">
                  Password
                </label>
                <button
                  type="button"
                  onClick={handleForgotPassword}
                  className="text-xs text-navy-600 hover:text-navy-700 font-medium"
                >
                  Forgot password?
                </button>
              </div>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-3 border border-sand-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-navy-500 focus:border-transparent transition-colors"
              />
            </div>

            {/* Remember Me */}
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                defaultChecked
                className="w-4 h-4 rounded border-sand-300 text-navy-600"
              />
              <span className="text-sm text-charcoal-700">Remember me</span>
            </label>

            {/* Sign In Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-navy-600 text-white font-semibold rounded-lg hover:bg-navy-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed mt-6"
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-sand-200"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-charcoal-600">or</span>
            </div>
          </div>

          {/* SSO Options */}
          <div className="space-y-3">
            <button
              type="button"
              onClick={handleGoogleSignIn}
              disabled={loading}
              className="w-full py-3 border border-sand-300 rounded-lg font-medium text-charcoal-700 hover:bg-sand-50 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
              Sign in with Google
            </button>
            <button
              type="button"
              onClick={handleGithubSignIn}
              disabled={loading}
              className="w-full py-3 border border-sand-300 rounded-lg font-medium text-charcoal-700 hover:bg-sand-50 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v 3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
              </svg>
              Sign in with GitHub
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-8 text-sand-300 text-sm space-y-2">
          <p>For admin access only</p>
          <p className="text-sand-400">
            Need help? Contact{' '}
            <a href="mailto:info@yaalnilam.lk" className="text-teal-300 hover:text-teal-200">
              info@yaalnilam.lk
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}
