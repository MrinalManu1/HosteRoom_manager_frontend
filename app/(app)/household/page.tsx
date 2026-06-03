'use client'

import { useState, useEffect } from 'react'
import { useAppSelector, useAppDispatch } from '@/store/hooks'
import { setHousehold, setMembers } from '@/features/householdSlice'
import { Leaderboard } from '@/components/leaderboard'
import { OnlineIndicator, OnlineCount } from '@/components/online-indicator'
import type { Member, Household } from '@/features/householdSlice'

// Mock data for demo
const mockHousehold: Household = {
  id: '1',
  name: 'The Cozy Kitchen',
  inviteCode: 'COZY-2024',
  createdAt: '2024-01-01',
  totalItemsTracked: 143,
  wasteReduced: '12.5 lbs',
  wasteScore: 87,
}

const mockMembers: Member[] = [
  { id: '1', name: 'Alex', avatar: '👨‍🍳', itemsAdded: 45, itemsUsed: 42, itemsWasted: 3, score: 93, rank: 1, isOnline: true },
  { id: '2', name: 'Sam', avatar: '👩‍🌾', itemsAdded: 38, itemsUsed: 34, itemsWasted: 4, score: 89, rank: 2, isOnline: true },
  { id: '3', name: 'Jordan', avatar: '🧑‍🍳', itemsAdded: 32, itemsUsed: 27, itemsWasted: 5, score: 84, rank: 3, isOnline: false },
  { id: '4', name: 'Taylor', avatar: '👨‍🔬', itemsAdded: 28, itemsUsed: 22, itemsWasted: 6, score: 78, rank: 4, isOnline: true },
]

export default function HouseholdPage() {
  const [copied, setCopied] = useState(false)
  const dispatch = useAppDispatch()
  const household = useAppSelector((state) => state.household.household)
  const members = useAppSelector((state) => state.household.members)
  const onlineMembers = useAppSelector((state) => state.household.onlineMembers)

  // Load mock data on mount (in production, this would be an API call)
  useEffect(() => {
    if (!household) {
      dispatch(setHousehold(mockHousehold))
    }
    if (members.length === 0) {
      dispatch(setMembers(mockMembers))
    }
  }, [dispatch, household, members.length])

  const displayHousehold = household || mockHousehold
  const displayMembers = members.length > 0 ? members : mockMembers
  const onlineCount = onlineMembers.length || displayMembers.filter((m) => m.isOnline).length

  const copyInviteCode = () => {
    navigator.clipboard.writeText(displayHousehold.inviteCode)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="space-y-6">
      {/* Household Info */}
      <div className="cozy-card-static p-6 md:p-8">
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <span className="text-4xl">🏠</span>
              <h1 className="text-3xl md:text-4xl font-extrabold text-foreground">
                {displayHousehold.name}
              </h1>
            </div>
            <p className="text-muted-foreground">
              Created on {new Date(displayHousehold.createdAt).toLocaleDateString('en-US', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </p>
            <div className="mt-2">
              <OnlineCount online={onlineCount} total={displayMembers.length} />
            </div>
          </div>

          {/* Invite Code */}
          <div className="cozy-card-static p-4 bg-primary/30">
            <p className="text-sm font-bold text-muted-foreground mb-1">🔑 Invite Code</p>
            <div className="flex items-center gap-3">
              <code className="text-2xl font-bold text-foreground tracking-wider">
                {displayHousehold.inviteCode}
              </code>
              <button 
                onClick={copyInviteCode}
                className="bg-card hover:bg-primary border-2 border-foreground px-3 py-1 rounded-lg font-bold text-sm transition-colors"
              >
                {copied ? '✓ Copied!' : '📋 Copy'}
              </button>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Share this code with your roommates
            </p>
          </div>
        </div>

        {/* Stats */}
        <div className="mt-6 pt-6 border-t-3 border-foreground grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <p className="text-3xl font-extrabold text-foreground">{displayMembers.length}</p>
            <p className="text-sm text-muted-foreground">👥 Members</p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-extrabold text-foreground">{displayHousehold.totalItemsTracked}</p>
            <p className="text-sm text-muted-foreground">📦 Items Tracked</p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-extrabold text-foreground">{displayHousehold.wasteReduced}</p>
            <p className="text-sm text-muted-foreground">♻️ Waste Reduced</p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-extrabold text-foreground">{displayHousehold.wasteScore}%</p>
            <p className="text-sm text-muted-foreground">🌟 Household Score</p>
          </div>
        </div>
      </div>

      {/* Leaderboard */}
      <Leaderboard members={displayMembers} />

      {/* Member List */}
      <div className="cozy-card-static p-6 md:p-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <span className="text-3xl">👥</span>
            <h2 className="text-2xl md:text-3xl font-extrabold text-foreground">Members</h2>
          </div>
          <button className="cozy-btn-secondary text-sm">
            ➕ Invite Member
          </button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {displayMembers.map((member) => (
            <div key={member.id} className="cozy-card p-4 text-center">
              <div className="relative inline-block">
                <div className="text-4xl mb-2">{member.avatar}</div>
                <span className="absolute -bottom-1 -right-1">
                  <OnlineIndicator isOnline={member.isOnline} />
                </span>
              </div>
              <p className="font-bold text-foreground">{member.name}</p>
              <p className="text-sm text-muted-foreground">{member.itemsAdded} items added</p>
            </div>
          ))}
        </div>
      </div>

      {/* Danger Zone */}
      <div className="cozy-card-static p-6 border-destructive bg-destructive/10">
        <h3 className="text-lg font-bold text-foreground mb-4">⚠️ Danger Zone</h3>
        <div className="flex flex-col sm:flex-row gap-4">
          <button className="cozy-btn-secondary flex-1">
            Leave Household
          </button>
          <button className="cozy-btn-danger flex-1">
            Delete Household
          </button>
        </div>
      </div>
    </div>
  )
}
