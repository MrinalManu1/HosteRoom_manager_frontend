import { AppNav } from '@/components/app-nav'
import { MockDataLoader } from '@/components/mock-data-loader'

export default function AppLayout({
  children,
}: {
  children: React.ReactNode
}) {
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
