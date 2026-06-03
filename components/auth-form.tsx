'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { login, register } from '@/features/authSlice'
import { useAppDispatch } from '@/store/hooks'

type AuthMode = 'signin' | 'signup'

const copy = {
  signin: {
    icon: '🔑',
    title: 'Welcome Back!',
    subtitle: 'Sign in to your household',
    button: 'Sign In 🚀',
    footer: "Don't have an account? ",
    footerHref: '/login/signup',
    footerLink: 'Create one!',
  },
  signup: {
    icon: '🌟',
    title: 'Join ShelfLife!',
    subtitle: 'Create your account to get started',
    button: 'Create Account 🎉',
    footer: 'Already have an account? ',
    footerHref: '/login/signin',
    footerLink: 'Sign in!',
  },
}

export function AuthForm({ mode }: { mode: AuthMode }) {
  const router = useRouter()
  const dispatch = useAppDispatch()
  const text = copy[mode]
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (mode === 'signin') {
      await dispatch(login({ email, password })).unwrap()
    } else {
      await dispatch(register({ name, email, password })).unwrap()
    }
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
            <div className="text-5xl mb-4">{text.icon}</div>
            <h1 className="text-3xl font-extrabold text-foreground">{text.title}</h1>
            <p className="text-muted-foreground mt-2">{text.subtitle}</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {mode === 'signup' && (
              <Field
                label="Your Name"
                type="text"
                value={name}
                onChange={setName}
                placeholder="Alex"
              />
            )}
            <Field
              label="Email Address"
              type="email"
              value={email}
              onChange={setEmail}
              placeholder={mode === 'signin' ? 'roommate@email.com' : 'alex@email.com'}
            />
            <Field
              label="Password"
              type="password"
              value={password}
              onChange={setPassword}
              placeholder="••••••••"
            />

            <button type="submit" className="cozy-btn w-full text-lg">
              {text.button}
            </button>
          </form>

          <p className="text-center text-muted-foreground mt-6">
            {text.footer}
            <Link href={text.footerHref} className="text-foreground font-bold hover:text-primary">
              {text.footerLink}
            </Link>
          </p>
        </div>
      </div>
    </main>
  )
}

function Field({
  label,
  type,
  value,
  onChange,
  placeholder,
}: {
  label: string
  type: string
  value: string
  onChange: (value: string) => void
  placeholder: string
}) {
  return (
    <div>
      <label className="block text-sm font-bold text-foreground mb-2">{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="cozy-input w-full"
        placeholder={placeholder}
        required
      />
    </div>
  )
}
