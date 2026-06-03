'use client'

import Link from 'next/link'
import type { InventoryItem, Status } from '@/features/inventorySlice'

interface InventoryCardProps {
  item: InventoryItem
  onMarkUsed: (id: string) => void
  onMarkWasted: (id: string) => void
  onDelete: (id: string) => void
}

function getItemStatus(expiryDate: string): Status {
  const today = new Date()
  const expiry = new Date(expiryDate)
  const diffDays = Math.ceil((expiry.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))

  if (diffDays < 0) return 'expired'
  if (diffDays <= 3) return 'expiring'
  return 'fresh'
}

function getDaysUntilExpiry(expiryDate: string): number {
  const today = new Date()
  const expiry = new Date(expiryDate)
  return Math.ceil((expiry.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
}

export function InventoryCard({ item, onMarkUsed, onMarkWasted, onDelete }: InventoryCardProps) {
  const status = getItemStatus(item.expiryDate)
  const daysLeft = getDaysUntilExpiry(item.expiryDate)

  return (
    <div
      className={`cozy-card p-5 ${
        status === 'expired'
          ? 'bg-destructive/20'
          : status === 'expiring'
            ? 'bg-warning/20'
            : 'bg-card'
      }`}
    >
      {/* Item Header */}
      <div className="flex items-start justify-between mb-3">
        <span className="text-4xl">{item.emoji}</span>
        <span
          className={`${
            status === 'expired'
              ? 'badge-expired'
              : status === 'expiring'
                ? 'badge-expiring'
                : 'badge-fresh'
          }`}
        >
          {status === 'expired'
            ? 'Expired'
            : status === 'expiring'
              ? `${daysLeft}d left`
              : 'Fresh'}
        </span>
      </div>

      {/* Item Info */}
      <h3 className="text-xl font-bold text-foreground">{item.name}</h3>
      <p className="text-muted-foreground">
        {item.quantity} {item.unit}
      </p>
      <p className="text-sm text-muted-foreground mt-1">
        Expires: {new Date(item.expiryDate).toLocaleDateString()}
      </p>
      <p className="text-xs text-muted-foreground mt-1">Added by {item.addedBy}</p>

      {/* Actions */}
      <div className="mt-4 pt-4 border-t-2 border-foreground/20 grid grid-cols-2 gap-2">
        <button
          onClick={() => onMarkUsed(item.id)}
          className="bg-success/80 hover:bg-success text-foreground font-bold text-sm py-2 px-3 rounded-lg border-2 border-foreground transition-colors"
        >
          ✓ Used
        </button>
        <button
          onClick={() => onMarkWasted(item.id)}
          className="bg-destructive/80 hover:bg-destructive text-foreground font-bold text-sm py-2 px-3 rounded-lg border-2 border-foreground transition-colors"
        >
          ✗ Wasted
        </button>
        <button className="bg-card hover:bg-primary/30 text-foreground font-bold text-sm py-2 px-3 rounded-lg border-2 border-foreground transition-colors">
          ✏️ Edit
        </button>
        <button
          onClick={() => onDelete(item.id)}
          className="bg-card hover:bg-destructive/30 text-foreground font-bold text-sm py-2 px-3 rounded-lg border-2 border-foreground transition-colors"
        >
          🗑️ Delete
        </button>
      </div>
    </div>
  )
}

// Stat Card used on Dashboard
interface StatCardProps {
  href: string
  emoji: string
  value: number
  label: string
  sublabel: string
  variant: 'success' | 'warning' | 'destructive'
}

export function StatCard({ href, emoji, value, label, sublabel, variant }: StatCardProps) {
  const bgClass =
    variant === 'success'
      ? 'bg-success/20 hover:bg-success/30'
      : variant === 'warning'
        ? 'bg-warning/20 hover:bg-warning/30'
        : 'bg-destructive/20 hover:bg-destructive/30'

  return (
    <Link href={href} className={`cozy-card p-6 md:p-8 ${bgClass}`}>
      <div className="text-center">
        <span className="text-5xl md:text-6xl block mb-3">{emoji}</span>
        <p className="text-5xl md:text-6xl font-extrabold text-foreground">{value}</p>
        <p className="text-lg font-bold text-muted-foreground mt-2">{label}</p>
        <p className="text-sm text-muted-foreground">{sublabel}</p>
      </div>
    </Link>
  )
}

// Mission Card used on Dashboard
interface MissionCardProps {
  emoji: string
  item: string
  daysLeft: number
  action: string
}

export function MissionCard({ emoji, item, daysLeft, action }: MissionCardProps) {
  const bgClass = daysLeft === 0 ? 'bg-destructive/20' : daysLeft === 1 ? 'bg-warning/20' : 'bg-card'

  return (
    <div className={`cozy-card p-4 ${bgClass}`}>
      <div className="flex items-start gap-3">
        <span className="text-3xl">{emoji}</span>
        <div className="flex-1">
          <p className="font-bold text-foreground">{item}</p>
          <p className="text-sm text-muted-foreground">
            {daysLeft === 0 ? 'Expires today!' : `${daysLeft} day${daysLeft > 1 ? 's' : ''} left`}
          </p>
          <p className="text-sm font-semibold text-primary mt-1">{action}</p>
        </div>
      </div>
    </div>
  )
}
