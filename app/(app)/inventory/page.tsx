'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { useAppSelector, useAppDispatch } from '@/store/hooks'
import {
  deleteItem,
  fetchItems,
  markItemUsed,
  markItemWasted,
  selectFilteredItems,
  selectItemsError,
  selectItemsLoading,
  setFilter,
  setSearchQuery,
} from '@/features/inventorySlice'
import { InventoryCard } from '@/components/inventory-card'
import type { Category } from '@/features/inventorySlice'

const categories: { value: Category; label: string; emoji: string }[] = [
  { value: 'all', label: 'All Items', emoji: '📋' },
  { value: 'produce', label: 'Produce', emoji: '🍎' },
  { value: 'dairy', label: 'Dairy', emoji: '🥛' },
  { value: 'meat', label: 'Meat', emoji: '🥩' },
  { value: 'pantry', label: 'Pantry', emoji: '🍞' },
  { value: 'frozen', label: 'Frozen', emoji: '🧊' },
  { value: 'other', label: 'Other', emoji: '🥫' },
]

export default function InventoryPage() {
  const dispatch = useAppDispatch()
  const filteredItems = useAppSelector(selectFilteredItems)
  const filter = useAppSelector((state) => state.inventory.filter)
  const searchQuery = useAppSelector((state) => state.inventory.searchQuery)
  const loading = useAppSelector(selectItemsLoading)
  const error = useAppSelector(selectItemsError)

  useEffect(() => {
    dispatch(fetchItems())
  }, [dispatch, filter, searchQuery])

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(setSearchQuery(e.target.value))
  }

  const handleCategoryChange = (category: Category) => {
    dispatch(setFilter(category))
  }

  const handleMarkUsed = (id: string) => {
    dispatch(markItemUsed(id))
  }

  const handleMarkWasted = (id: string) => {
    dispatch(markItemWasted(id))
  }

  const handleDelete = (id: string) => {
    dispatch(deleteItem(id))
  }

  const emptyTitle = loading
    ? 'Loading inventory...'
    : error
      ? 'Inventory could not load'
      : searchQuery || filter !== 'all'
        ? 'No items found'
        : 'Your shelves are looking great!'

  const emptyMessage = error
    ? error
    : searchQuery || filter !== 'all'
      ? 'Try adjusting your search or filters'
      : 'Add some items to get started'

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
            {emptyTitle}
          </h2>
          <p className="text-muted-foreground mb-6">
            {emptyMessage}
          </p>
          <Link href="/add-item" className="cozy-btn inline-block">
            ➕ Add Your First Item
          </Link>
        </div>
      )}
    </div>
  )
}
