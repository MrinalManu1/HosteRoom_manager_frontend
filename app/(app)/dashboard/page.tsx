'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { useAppSelector, useAppDispatch } from '@/store/hooks'
import { fetchDashboardStats, fetchExpiringItems } from '@/features/dashboardSlice'
import { StatCard, MissionCard } from '@/components/inventory-card'
import { OnlineCount } from '@/components/online-indicator'

function getEmojiForCategory(category: string): string {
  const map: Record<string, string> = {
    produce: '🍎',
    dairy: '🥛',
    meat: '🥩',
    pantry: '🍞',
    frozen: '🧊',
    other: '🥫',
  }
  return map[category] ?? '🍽️'
}

function getDaysLeft(expiryDate: string): number {
  const now = new Date()
  const expiry = new Date(expiryDate)
  return Math.ceil((expiry.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
}

export default function DashboardPage() {
  const dispatch = useAppDispatch()
  const user = useAppSelector((state) => state.auth.user)
  const household = useAppSelector((state) => state.household.household)
  const members = useAppSelector((state) => state.household.members)
  const onlineMembers = useAppSelector((state) => state.household.onlineMembers)
  const { stats, expiringItems, loading, error } = useAppSelector((state) => state.dashboard)

  useEffect(() => {
    dispatch(fetchDashboardStats())
    dispatch(fetchExpiringItems())
  }, [dispatch])

  const householdName = household?.name ?? 'Your Household'
  const memberCount = members.length || 0
  const wasteScore = stats?.wasteScore ?? household?.wasteScore ?? 0

  return (
    <div className="space-y-6">
      {/* Welcome Card */}
      <div className="cozy-card-static p-6 md:p-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-extrabold text-foreground">
              Welcome back{user?.name ? `, ${user.name}` : ''} 👋
            </h1>
            <p className="text-muted-foreground mt-1 text-lg">
              {"Here's what's happening in your pantry today"}
            </p>
          </div>

          <div className="cozy-card-static p-4 md:p-6 bg-primary/30">
            <div className="text-center">
              <p className="text-sm font-bold text-muted-foreground">♻️ Waste Saver Score</p>
              <p className="text-4xl md:text-5xl font-extrabold text-foreground">
                {loading ? '…' : `${wasteScore}%`}
              </p>
              <p className="text-sm text-muted-foreground mt-1">{"You're doing great!"}</p>
            </div>
          </div>
        </div>

        {/* Household Info */}
        <div className="mt-6 pt-6 border-t-3 border-foreground flex flex-wrap gap-6">
          <div className="flex items-center gap-3">
            <span className="text-3xl">🏠</span>
            <div>
              <p className="text-sm text-muted-foreground">Household</p>
              <p className="font-bold text-lg">{householdName}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-3xl">👥</span>
            <div>
              <p className="text-sm text-muted-foreground">Members</p>
              <p className="font-bold text-lg">{memberCount} roommates</p>
            </div>
          </div>
          <div className="flex items-center gap-3 ml-auto">
            <OnlineCount online={onlineMembers.length} total={memberCount} />
          </div>
        </div>
      </div>

      {/* Error state */}
      {error && (
        <div className="cozy-card-static p-4 bg-destructive/10 text-center text-foreground font-semibold">
          ⚠️ {error}
        </div>
      )}

      {/* Stats Cards */}
     {loading ? (
  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
    {[1, 2, 3].map((i) => (
      <div key={i} className="cozy-card-static p-6 animate-pulse h-32" />
    ))}
  </div>
) : (
  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
    <StatCard
      href="/inventory?filter=fresh"
      emoji="🍎"
      value={stats?.fresh ?? 0}
      label="Fresh Items"
      sublabel="Looking good!"
      variant="success"
    />
    <StatCard
      href="/inventory?filter=expiring"
      emoji="⏰"
      value={stats?.expiringSoon ?? 0}
      label="Expiring Soon"
      sublabel="Use them up!"
      variant="warning"
    />
    <StatCard
      href="/inventory?filter=expired"
      emoji="💀"
      value={stats?.expired ?? 0}
      label="Expired"
      sublabel="Time to clean"
      variant="destructive"
    />
  </div>
)}

      {/* Today's Missions */}
      <div className="cozy-card-static p-6 md:p-8">
        <div className="flex items-center gap-3 mb-6">
          <span className="text-3xl">⚠️</span>
          <h2 className="text-2xl md:text-3xl font-extrabold text-foreground">{"Today's Missions"}</h2>
        </div>

        {loading ? (
          <div className="text-center py-8">
            <span className="text-5xl block mb-3 animate-pulse">⏳</span>
            <p className="text-lg font-bold text-muted-foreground">Loading missions…</p>
          </div>
        ) : expiringItems.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {expiringItems.map((item) => (
              <MissionCard
                key={item._id}
                emoji={getEmojiForCategory(item.category)}
                item={item.name}
                daysLeft={getDaysLeft(item.expiryDate)}
                action={getDaysLeft(item.expiryDate) <= 0 ? 'Check freshness!' : 'Use it up!'}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <span className="text-5xl block mb-3">✨</span>
            <p className="text-lg font-bold text-foreground">Nothing needs attention right now.</p>
            <p className="text-muted-foreground">{"You're on top of everything!"}</p>
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div className="flex flex-col sm:flex-row gap-4">
        <Link href="/add-item" className="cozy-btn flex-1 text-center text-lg">
          ➕ Add New Item
        </Link>
        <Link href="/inventory" className="cozy-btn-secondary flex-1 text-center text-lg">
          📦 View Full Inventory
        </Link>
      </div>
    </div>
  )
}
