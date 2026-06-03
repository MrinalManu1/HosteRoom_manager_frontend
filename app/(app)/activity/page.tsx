'use client'

import { useAppSelector } from '@/store/hooks'

export default function ActivityPage() {
  const activities = useAppSelector((state) => state.notification.activities)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="cozy-card-static p-6 md:p-8">
        <div className="flex items-center gap-4">
          <span className="text-4xl">📡</span>
          <div>
            <h1 className="text-3xl md:text-4xl font-extrabold text-foreground">
              Live Activity
            </h1>
            <p className="text-muted-foreground mt-1 text-lg">
              See what your household has been up to
            </p>
          </div>
        </div>
      </div>

      {/* Activity Feed */}
      <div className="cozy-card-static p-6 md:p-8">
        {activities.length === 0 ? (
          <div className="text-center py-12">
            <span className="text-6xl block mb-4">🦗</span>
            <p className="text-xl font-bold text-foreground">No activity yet</p>
            <p className="text-muted-foreground mt-2">
              {"When your household adds or uses items, you'll see it here!"}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {activities.map((activity) => (
              <div
                key={activity.id}
                className="cozy-card p-4 md:p-5 flex items-start gap-4"
              >
                <span className="text-3xl">{activity.emoji}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-lg font-bold text-foreground">{activity.message}</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    {formatTimeAgo(activity.timestamp)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
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
