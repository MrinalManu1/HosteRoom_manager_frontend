'use client'

import Link from 'next/link'
import { useAppSelector } from '@/store/hooks'
import { StatCard, MissionCard } from '@/components/inventory-card'
import { OnlineCount } from '@/components/online-indicator'

// Mock data - in production this would come from Redux / API
const mockHouseholdData = {
  name: 'The Cozy Kitchen',
  memberCount: 4,
  wasteScore: 87,
}

const mockStatsData = {
  fresh: 24,
  expiringSoon: 5,
  expired: 2,
}

const mockMissions = [
  { id: '1', item: 'Milk', emoji: '🥛', daysLeft: 1, action: 'Use it up!' },
  { id: '2', item: 'Bread', emoji: '🍞', daysLeft: 2, action: 'Make toast!' },
  { id: '3', item: 'Tomatoes', emoji: '🍅', daysLeft: 0, action: 'Check freshness!' },
  { id: '4', item: 'Yogurt', emoji: '🥛', daysLeft: 1, action: 'Breakfast time!' },
]

export default function DashboardPage() {
  const user = useAppSelector((state) => state.auth.user)
  const household = useAppSelector((state) => state.household.household)
  const members = useAppSelector((state) => state.household.members)
  const onlineMembers = useAppSelector((state) => state.household.onlineMembers)

  // Use mock data if Redux state is empty (for demo)
  const householdName = household?.name || mockHouseholdData.name
  const memberCount = members.length || mockHouseholdData.memberCount
  const wasteScore = household?.wasteScore || mockHouseholdData.wasteScore

  return (
    <div className="space-y-6">
      {/* Welcome Card */}
      <div className="cozy-card-static p-6 md:p-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-extrabold text-foreground">
              Welcome back 👋
            </h1>
            <p className="text-muted-foreground mt-1 text-lg">
              {"Here's what's happening in your pantry today"}
            </p>
          </div>
          
          <div className="cozy-card-static p-4 md:p-6 bg-primary/30">
            <div className="text-center">
              <p className="text-sm font-bold text-muted-foreground">♻️ Waste Saver Score</p>
              <p className="text-4xl md:text-5xl font-extrabold text-foreground">{wasteScore}%</p>
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
            <OnlineCount online={onlineMembers.length || 3} total={memberCount} />
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
        <StatCard
          href="/inventory?filter=fresh"
          emoji="🍎"
          value={mockStatsData.fresh}
          label="Fresh Items"
          sublabel="Looking good!"
          variant="success"
        />
        <StatCard
          href="/inventory?filter=expiring"
          emoji="⏰"
          value={mockStatsData.expiringSoon}
          label="Expiring Soon"
          sublabel="Use them up!"
          variant="warning"
        />
        <StatCard
          href="/inventory?filter=expired"
          emoji="💀"
          value={mockStatsData.expired}
          label="Expired"
          sublabel="Time to clean"
          variant="destructive"
        />
      </div>

      {/* Today's Missions */}
      <div className="cozy-card-static p-6 md:p-8">
        <div className="flex items-center gap-3 mb-6">
          <span className="text-3xl">⚠️</span>
          <h2 className="text-2xl md:text-3xl font-extrabold text-foreground">{"Today's Missions"}</h2>
        </div>

        {mockMissions.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {mockMissions.map((mission) => (
              <MissionCard
                key={mission.id}
                emoji={mission.emoji}
                item={mission.item}
                daysLeft={mission.daysLeft}
                action={mission.action}
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
