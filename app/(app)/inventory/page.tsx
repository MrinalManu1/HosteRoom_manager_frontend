'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { useAppSelector, useAppDispatch } from '@/store/hooks'
import { setItems, removeItem, setFilter, setSearchQuery, selectFilteredItems } from '@/features/inventorySlice'
import { addActivity } from '@/features/notificationSlice'
import { InventoryCard } from '@/components/inventory-card'
import { socketService } from '@/services/socket'
import type { Category, InventoryItem } from '@/features/inventorySlice'

const categories: { value: Category; label: string; emoji: string }[] = [
  { value: 'all', label: 'All Items', emoji: '📋' },
  { value: 'produce', label: 'Produce', emoji: '🍎' },
  { value: 'dairy', label: 'Dairy', emoji: '🥛' },
  { value: 'meat', label: 'Meat', emoji: '🥩' },
  { value: 'pantry', label: 'Pantry', emoji: '🍞' },
  { value: 'frozen', label: 'Frozen', emoji: '🧊' },
  { value: 'other', label: 'Other', emoji: '🥫' },
]

// Mock inventory data for demo
const mockInventory: InventoryItem[] = [
  { id: '1', name: 'Milk', emoji: '🥛', category: 'dairy', quantity: 1, unit: 'gallon', expiryDate: '2024-01-20', addedBy: 'Alex', addedById: '1', createdAt: '2024-01-15' },
  { id: '2', name: 'Eggs', emoji: '🥚', category: 'dairy', quantity: 12, unit: 'pcs', expiryDate: '2024-01-25', addedBy: 'Sam', addedById: '2', createdAt: '2024-01-14' },
  { id: '3', name: 'Bread', emoji: '🍞', category: 'pantry', quantity: 1, unit: 'loaf', expiryDate: '2024-01-18', addedBy: 'Alex', addedById: '1', createdAt: '2024-01-16' },
  { id: '4', name: 'Apples', emoji: '🍎', category: 'produce', quantity: 6, unit: 'pcs', expiryDate: '2024-01-28', addedBy: 'Jordan', addedById: '3', createdAt: '2024-01-12' },
  { id: '5', name: 'Chicken Breast', emoji: '🍗', category: 'meat', quantity: 2, unit: 'lbs', expiryDate: '2024-01-17', addedBy: 'Sam', addedById: '2', createdAt: '2024-01-15' },
  { id: '6', name: 'Spinach', emoji: '🥬', category: 'produce', quantity: 1, unit: 'bag', expiryDate: '2024-01-19', addedBy: 'Taylor', addedById: '4', createdAt: '2024-01-16' },
  { id: '7', name: 'Yogurt', emoji: '🥛', category: 'dairy', quantity: 4, unit: 'cups', expiryDate: '2024-01-22', addedBy: 'Alex', addedById: '1', createdAt: '2024-01-14' },
  { id: '8', name: 'Frozen Pizza', emoji: '🍕', category: 'frozen', quantity: 2, unit: 'pcs', expiryDate: '2024-03-15', addedBy: 'Jordan', addedById: '3', createdAt: '2024-01-10' },
  { id: '9', name: 'Tomatoes', emoji: '🍅', category: 'produce', quantity: 5, unit: 'pcs', expiryDate: '2024-01-16', addedBy: 'Sam', addedById: '2', createdAt: '2024-01-14' },
  { id: '10', name: 'Cheese', emoji: '🧀', category: 'dairy', quantity: 1, unit: 'block', expiryDate: '2024-02-10', addedBy: 'Taylor', addedById: '4', createdAt: '2024-01-08' },
  { id: '11', name: 'Rice', emoji: '🍚', category: 'pantry', quantity: 2, unit: 'lbs', expiryDate: '2024-12-01', addedBy: 'Alex', addedById: '1', createdAt: '2024-01-05' },
  { id: '12', name: 'Carrots', emoji: '🥕', category: 'produce', quantity: 8, unit: 'pcs', expiryDate: '2024-01-30', addedBy: 'Jordan', addedById: '3', createdAt: '2024-01-13' },
]

export default function InventoryPage() {
  const dispatch = useAppDispatch()
  const filteredItems = useAppSelector(selectFilteredItems)
  const filter = useAppSelector((state) => state.inventory.filter)
  const searchQuery = useAppSelector((state) => state.inventory.searchQuery)
  const user = useAppSelector((state) => state.auth.user)

  // Load mock data on mount (in production, this would be an API call)
  useEffect(() => {
    dispatch(setItems(mockInventory))
  }, [dispatch])

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(setSearchQuery(e.target.value))
  }

  const handleCategoryChange = (category: Category) => {
    dispatch(setFilter(category))
  }

  const handleMarkUsed = (id: string) => {
    const item = filteredItems.find((i) => i.id === id)
    if (item) {
      dispatch(removeItem(id))
      dispatch(addActivity({
        id: Date.now().toString(),
        type: 'item_used',
        message: `${user?.name || 'You'} marked ${item.name} as Used`,
        emoji: '✅',
        userName: user?.name || 'You',
        itemName: item.name,
        timestamp: new Date().toISOString(),
      }))
      socketService.emitItemUsed(id)
    }
  }

  const handleMarkWasted = (id: string) => {
    const item = filteredItems.find((i) => i.id === id)
    if (item) {
      dispatch(removeItem(id))
      dispatch(addActivity({
        id: Date.now().toString(),
        type: 'item_wasted',
        message: `${user?.name || 'You'} marked ${item.name} as Wasted`,
        emoji: '🗑️',
        userName: user?.name || 'You',
        itemName: item.name,
        timestamp: new Date().toISOString(),
      }))
      socketService.emitItemWasted(id)
    }
  }

  const handleDelete = (id: string) => {
    dispatch(removeItem(id))
    socketService.emitItemDeleted(id)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="cozy-card-static p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-extrabold text-foreground flex items-center gap-3">
              <span>📦</span> Your Inventory
            </h1>
            <p className="text-muted-foreground mt-1">
              {filteredItems.length} items on your shelves
            </p>
          </div>
          <Link href="/add-item" className="cozy-btn text-center">
            ➕ Add New Item
          </Link>
        </div>
      </div>

      {/* Search & Filters */}
      <div className="cozy-card-static p-4 md:p-6">
        {/* Search Bar */}
        <div className="mb-4">
          <input
            type="text"
            placeholder="🔍 Search your pantry..."
            value={searchQuery}
            onChange={handleSearchChange}
            className="cozy-input w-full text-lg"
          />
        </div>

        {/* Filter Chips */}
        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => (
            <button
              key={cat.value}
              onClick={() => handleCategoryChange(cat.value)}
              className={`filter-chip ${filter === cat.value ? 'active' : ''}`}
            >
              {cat.emoji} {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Inventory Grid */}
      {filteredItems.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredItems.map((item) => (
            <InventoryCard
              key={item.id}
              item={item}
              onMarkUsed={handleMarkUsed}
              onMarkWasted={handleMarkWasted}
              onDelete={handleDelete}
            />
          ))}
        </div>
      ) : (
        <div className="cozy-card-static p-12 text-center">
          <span className="text-6xl block mb-4">🥳</span>
          <h2 className="text-2xl font-bold text-foreground mb-2">
            {searchQuery || filter !== 'all' 
              ? 'No items found' 
              : 'Your shelves are looking great!'
            }
          </h2>
          <p className="text-muted-foreground mb-6">
            {searchQuery || filter !== 'all'
              ? 'Try adjusting your search or filters'
              : 'Add some items to get started'
            }
          </p>
          <Link href="/add-item" className="cozy-btn inline-block">
            ➕ Add Your First Item
          </Link>
        </div>
      )}
    </div>
  )
}
