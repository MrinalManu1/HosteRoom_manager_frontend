'use client'

import { useAppSelector } from '@/store/hooks'

export function ActivityFeed() {
  const activities = useAppSelector((state) => state.notification.activities)

  if (activities.length === 0) {
    return (
      <div className="cozy-card-static p-4 text-center">
        <p className="text-muted-foreground text-sm">No recent activity</p>
      </div>
    )
  }

  return (
    <div className="cozy-card-static p-4">
      <div className="flex items-center gap-2 mb-4">
        <span className="text-xl">📡</span>
        <h3 className="font-bold text-foreground">Live Activity</h3>
      </div>
      <div className="space-y-3 max-h-64 overflow-y-auto">
        {activities.map((activity) => (
          <div
            key={activity.id}
            className="flex items-start gap-3 p-2 rounded-lg bg-background/50 border-2 border-foreground/10"
          >
            <span className="text-lg">{activity.emoji}</span>
            <div className="flex-1 min-w-0">
              <p className="text-sm text-foreground">{activity.message}</p>
              <p className="text-xs text-muted-foreground">
                {formatTimeAgo(activity.timestamp)}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function formatTimeAgo(timestamp: string): string {
  const now = new Date()
  const time = new Date(timestamp)
  const diffMs = now.getTime() - time.getTime()
  const diffMins = Math.floor(diffMs / 60000)

  if (diffMins < 1) return 'Just now'
  if (diffMins < 60) return `${diffMins}m ago`
  const diffHours = Math.floor(diffMins / 60)
  if (diffHours < 24) return `${diffHours}h ago`
  return time.toLocaleDateString()
}
