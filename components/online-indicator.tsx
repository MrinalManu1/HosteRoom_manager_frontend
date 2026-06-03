'use client'

interface OnlineIndicatorProps {
  isOnline: boolean
  size?: 'sm' | 'md'
}

export function OnlineIndicator({ isOnline, size = 'md' }: OnlineIndicatorProps) {
  const sizeClasses = size === 'sm' ? 'w-2 h-2' : 'w-3 h-3'

  return (
    <span
      className={`inline-block rounded-full ${sizeClasses} ${
        isOnline ? 'bg-success' : 'bg-muted-foreground/30'
      }`}
      title={isOnline ? 'Online' : 'Offline'}
    />
  )
}

interface OnlineStatusProps {
  name: string
  isOnline: boolean
}

export function OnlineStatus({ name, isOnline }: OnlineStatusProps) {
  return (
    <div className="flex items-center gap-2">
      <OnlineIndicator isOnline={isOnline} />
      <span className="text-foreground">{name}</span>
    </div>
  )
}

interface OnlineCountProps {
  online: number
  total: number
}

export function OnlineCount({ online, total }: OnlineCountProps) {
  return (
    <div className="flex items-center gap-2 text-sm text-muted-foreground">
      <OnlineIndicator isOnline={online > 0} size="sm" />
      <span>
        {online} of {total} roommates online
      </span>
    </div>
  )
}
