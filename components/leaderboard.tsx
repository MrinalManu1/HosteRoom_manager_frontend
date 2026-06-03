'use client'

import { OnlineIndicator } from './online-indicator'
import type { Member } from '@/features/householdSlice'

interface LeaderboardProps {
  members: Member[]
}

function getRankBadge(rank: number): { emoji: string; title: string } {
  switch (rank) {
    case 1:
      return { emoji: '🥇', title: 'Roommate Champion' }
    case 2:
      return { emoji: '🥈', title: 'Pantry Protector' }
    case 3:
      return { emoji: '🥉', title: 'Freshness Guardian' }
    default:
      return { emoji: '⭐', title: 'Rising Star' }
  }
}

export function Leaderboard({ members }: LeaderboardProps) {
  return (
    <div className="cozy-card-static p-6 md:p-8">
      <div className="flex items-center gap-3 mb-6">
        <span className="text-3xl">🏆</span>
        <h2 className="text-2xl md:text-3xl font-extrabold text-foreground">Leaderboard</h2>
      </div>

      <div className="space-y-4">
        {members.map((member) => {
          const badge = getRankBadge(member.rank)
          return (
            <div
              key={member.id}
              className={`cozy-card p-4 md:p-6 ${
                member.rank === 1
                  ? 'bg-primary/30'
                  : member.rank === 2
                    ? 'bg-card'
                    : member.rank === 3
                      ? 'bg-warning/20'
                      : 'bg-card'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                {/* Rank & Avatar */}
                <div className="flex items-center gap-4">
                  <div className="text-4xl">{badge.emoji}</div>
                  <div className="text-4xl">{member.avatar}</div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-xl font-bold text-foreground">{member.name}</h3>
                      <OnlineIndicator isOnline={member.isOnline} size="sm" />
                    </div>
                    <p className="text-sm text-muted-foreground">{badge.title}</p>
                  </div>
                </div>

                {/* Stats */}
                <div className="flex-1 grid grid-cols-3 gap-2 sm:gap-4 sm:ml-auto sm:max-w-xs">
                  <div className="text-center bg-background/50 rounded-lg p-2">
                    <p className="text-lg font-bold text-foreground">{member.itemsUsed}</p>
                    <p className="text-xs text-muted-foreground">Used</p>
                  </div>
                  <div className="text-center bg-background/50 rounded-lg p-2">
                    <p className="text-lg font-bold text-foreground">{member.itemsWasted}</p>
                    <p className="text-xs text-muted-foreground">Wasted</p>
                  </div>
                  <div className="text-center bg-success/30 rounded-lg p-2">
                    <p className="text-lg font-bold text-foreground">{member.score}%</p>
                    <p className="text-xs text-muted-foreground">Score</p>
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
