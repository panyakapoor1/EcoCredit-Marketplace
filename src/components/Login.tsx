import { useState } from 'react'
import { api } from '../services/api'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Label } from './ui/label'
import { Card } from './ui/card'
import { Leaf, Mail, Lock, AlertCircle } from 'lucide-react'
import { Alert, AlertDescription } from './ui/alert'

interface LoginProps {
  onNavigate: (page: string) => void
  onLogin: (user: any) => void
}

export default function Login({ onNavigate, onLogin }: LoginProps) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    // Basic validation
    if (!email || !password) {
      setError('Please fill in all fields')
      setIsLoading(false)
      return
    }

    if (!email.includes('@')) {
      setError('Please enter a valid email address')
      setIsLoading(false)
      return
    }

    try {
      const data = await api.auth.login({ email, password })
      localStorage.setItem('ecocredit_access_token', data.accessToken)
      localStorage.setItem('ecocredit_refresh_token', data.refreshToken)
      onLogin(data.user)
    } catch (err: any) {
      setError(err.message || 'Failed to login')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#f0fdf4] to-white flex items-center justify-center px-4 py-12">
      <Card className="w-full max-w-md p-8 shadow-xl">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 mb-4">
            <Leaf className="w-10 h-10 text-[var(--teal)]" />
            <h1 className="text-3xl font-bold text-[var(--teal)]">EcoCredit</h1>
          </div>
          <h2 className="text-2xl font-bold mb-2">Welcome Back</h2>
          <p className="text-muted-foreground">Sign in to your account to continue</p>
        </div>

        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
              <Input
                id="email"
                type="email"
                placeholder="your.email@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          <div className="flex items-center justify-between text-sm">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" className="rounded border-gray-300" />
              <span className="text-muted-foreground">Remember me</span>
            </label>
            <button
              type="button"
              className="text-[var(--teal)] hover:underline"
              onClick={() => setError('Password reset feature coming soon!')}
            >
              Forgot password?
            </button>
          </div>

          <Button
            type="submit"
            className="w-full bg-[var(--teal)] hover:bg-[var(--teal)]/90 py-6"
            disabled={isLoading}
          >
            {isLoading ? 'Signing in...' : 'Sign In'}
          </Button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-muted-foreground">
            Don't have an account?{' '}
            <button
              onClick={() => onNavigate('register')}
              className="text-[var(--teal)] hover:underline font-medium"
            >
              Create Account
            </button>
          </p>
        </div>

        <div className="mt-6 text-center">
          <button
            onClick={() => onNavigate('about')}
            className="text-sm text-muted-foreground hover:text-[var(--teal)]"
          >
            ← Back to About
          </button>
        </div>
      </Card>
    </div>
  )
}
