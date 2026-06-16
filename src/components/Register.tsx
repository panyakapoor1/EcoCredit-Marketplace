import { useState } from 'react'
import { api } from '../services/api'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Label } from './ui/label'
import { Card } from './ui/card'
import { Leaf, Mail, Lock, User, AlertCircle, Building } from 'lucide-react'
import { Alert, AlertDescription } from './ui/alert'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select'

interface RegisterProps {
  onNavigate: (page: string) => void
  onRegister: (user: any) => void
}

export default function Register({ onNavigate, onRegister }: RegisterProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    accountType: 'individual',
    role: 'buyer'
  })
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleInputChange = (field: keyof typeof formData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    // Validation
    if (!formData.name || !formData.email || !formData.password || !formData.confirmPassword) {
      setError('Please fill in all fields')
      setIsLoading(false)
      return
    }

    if (!formData.email.includes('@')) {
      setError('Please enter a valid email address')
      setIsLoading(false)
      return
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters')
      setIsLoading(false)
      return
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match')
      setIsLoading(false)
      return
    }

    try {
      const data = await api.auth.register({ 
        name: formData.name, 
        email: formData.email, 
        password: formData.password, 
        accountType: formData.accountType,
        role: formData.role
      })
      localStorage.setItem('ecocredit_access_token', data.accessToken)
      localStorage.setItem('ecocredit_refresh_token', data.refreshToken)
      onRegister(data.user)
    } catch (err: any) {
      setError(err.message || 'Registration failed')
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
          <h2 className="text-2xl font-bold mb-2">Create Account</h2>
          <p className="text-muted-foreground">Join the carbon-neutral revolution</p>
        </div>

        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="accountType">Account Type</Label>
            <Select
              value={formData.accountType}
              onValueChange={(value: string) => handleInputChange('accountType', value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="individual">
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4" />
                    Individual
                  </div>
                </SelectItem>
                <SelectItem value="business">
                  <div className="flex items-center gap-2">
                    <Building className="w-4 h-4" />
                    Small Business
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="role">What do you want to do?</Label>
            <Select
              value={formData.role}
              onValueChange={(value: string) => handleInputChange('role', value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="buyer">
                  <div className="flex items-center gap-2">
                    I want to buy credits
                  </div>
                </SelectItem>
                <SelectItem value="seller">
                  <div className="flex items-center gap-2">
                    I want to sell credits
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="name">{formData.accountType === 'business' ? 'Business Name' : 'Full Name'}</Label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
              <Input
                id="name"
                type="text"
                placeholder={formData.accountType === 'business' ? 'Green Co.' : 'John Doe'}
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
              <Input
                id="email"
                type="email"
                placeholder="your.email@example.com"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
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
                value={formData.password}
                onChange={(e) => handleInputChange('password', e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirm Password</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
              <Input
                id="confirmPassword"
                type="password"
                placeholder="••••••••"
                value={formData.confirmPassword}
                onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          <div className="flex items-start gap-2 text-sm">
            <input type="checkbox" className="mt-1 rounded border-gray-300" required />
            <span className="text-muted-foreground">
              I agree to the{' '}
              <button type="button" className="text-[var(--teal)] hover:underline">
                Terms of Service
              </button>{' '}
              and{' '}
              <button type="button" className="text-[var(--teal)] hover:underline">
                Privacy Policy
              </button>
            </span>
          </div>

          <Button
            type="submit"
            className="w-full bg-[var(--teal)] hover:bg-[var(--teal)]/90 py-6"
            disabled={isLoading}
          >
            {isLoading ? 'Creating Account...' : 'Create Account'}
          </Button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-muted-foreground">
            Already have an account?{' '}
            <button
              onClick={() => onNavigate('login')}
              className="text-[var(--teal)] hover:underline font-medium"
            >
              Sign In
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
