'use client'

import { useState } from 'react'
import { useAppSelector, useAppDispatch } from '@/store/hooks'
import { markNotificationRead, markAllRead } from '@/features/notificationSlice'

export function NotificationDrawer() {
  const [isOpen, setIsOpen] = useState(false)
  const dispatch = useAppDispatch()
  const notifications = useAppSelector((state) => state.notification.notifications)
  const unreadCount = useAppSelector((state) => state.notification.unreadCount)

  const handleNotificationClick = (id: string) => {
    dispatch(markNotificationRead(id))
  }

  const handleMarkAllRead = () => {
    dispatch(markAllRead())
  }

  return (
    <div className="relative">
      {/* Bell Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="cozy-card p-2 md:p-3 flex items-center gap-2 relative"
      >
        <span className="text-xl">🔔</span>
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-destructive text-foreground text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center border-2 border-foreground">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />

          {/* Drawer */}
          <div className="absolute right-0 top-full mt-2 w-80 z-50">
            <div className="cozy-card-static p-4 bg-card">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <span className="text-lg">🔔</span>
                  <h3 className="font-bold text-foreground">Notifications</h3>
                </div>
                {unreadCount > 0 && (
                  <button
                    onClick={handleMarkAllRead}
                    className="text-xs text-primary hover:underline font-semibold"
                  >
                    Mark all read
                  </button>
                )}
              </div>

              {notifications.length === 0 ? (
                <div className="text-center py-6">
                  <span className="text-3xl block mb-2">✨</span>
                  <p className="text-sm text-muted-foreground">All caught up!</p>
                </div>
              ) : (
                <div className="space-y-2 max-h-80 overflow-y-auto">
                  {notifications.map((notification) => (
                    <button
                      key={notification.id}
                      onClick={() => handleNotificationClick(notification.id)}
                      className={`w-full text-left p-3 rounded-lg border-2 transition-colors ${
                        notification.read
                          ? 'bg-background/50 border-foreground/10'
                          : 'bg-primary/20 border-foreground/30'
                      }`}
                    >
                      <div className="flex items-start gap-2">
                        <span className="text-lg">{notification.emoji}</span>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-foreground">
                            {notification.title}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {notification.message}
                          </p>
                          <p className="text-xs text-muted-foreground mt-1">
                            {formatTimeAgo(notification.timestamp)}
                          </p>
                        </div>
                        {!notification.read && (
                          <span className="w-2 h-2 rounded-full bg-primary" />
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </>
      )}
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
