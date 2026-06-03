'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function SignInPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Mock login - redirect to dashboard
    router.push('/dashboard')
  }

  return (
    <main className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="cozy-card-static p-8 md:p-10">
          <Link href="/" className="text-muted-foreground hover:text-foreground mb-6 inline-block">
            ← Back to home
          </Link>
          
          <div className="text-center mb-8">
            <div className="text-5xl mb-4">🔑</div>
            <h1 className="text-3xl font-extrabold text-foreground">
              Welcome Back!
            </h1>
            <p className="text-muted-foreground mt-2">
              Sign in to your household
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-bold text-foreground mb-2">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="cozy-input w-full"
                placeholder="roommate@email.com"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-foreground mb-2">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="cozy-input w-full"
                placeholder="••••••••"
                required
              />
            </div>

            <button type="submit" className="cozy-btn w-full text-lg">
              Sign In 🚀
            </button>
          </form>

          <p className="text-center text-muted-foreground mt-6">
            {"Don't have an account? "}
            <Link href="/login/signup" className="text-foreground font-bold hover:text-primary">
              Create one!
            </Link>
          </p>
        </div>
      </div>
    </main>
  )
}
