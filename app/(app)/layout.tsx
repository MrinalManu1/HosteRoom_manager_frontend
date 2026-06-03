'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { AppNav } from '@/components/app-nav'
import { MockDataLoader } from '@/components/mock-data-loader'
import { useAppSelector } from '@/store/hooks'

export default function AppLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const { isAuthenticated, hasBootstrapped } = useAppSelector((state) => state.auth)

  useEffect(() => {
    if (hasBootstrapped && !isAuthenticated) router.replace('/login/signin')
  }, [hasBootstrapped, isAuthenticated, router])

  if (!hasBootstrapped || !isAuthenticated) return null

  return (
    <div className="min-h-screen bg-background">
      <MockDataLoader />
      <div className="max-w-7xl mx-auto p-4 md:p-6 space-y-6">
        <AppNav />
        {children}
      </div>
    </div>
  )
}
