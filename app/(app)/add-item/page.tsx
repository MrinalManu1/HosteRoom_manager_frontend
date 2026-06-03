'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAppDispatch } from '@/store/hooks'
import { createItem } from '@/features/inventorySlice'
import type { Category } from '@/features/inventorySlice'

const categories: { value: Exclude<Category, 'all'>; label: string; emoji: string }[] = [
  { value: 'produce', label: 'Produce', emoji: '🍎' },
  { value: 'dairy', label: 'Dairy', emoji: '🥛' },
  { value: 'meat', label: 'Meat', emoji: '🥩' },
  { value: 'pantry', label: 'Pantry', emoji: '🍞' },
  { value: 'frozen', label: 'Frozen', emoji: '🧊' },
  { value: 'other', label: 'Other', emoji: '🥫' },
]

const foodEmojis: Record<string, string> = {
  milk: '🥛',
  bread: '🍞',
  eggs: '🥚',
  apple: '🍎',
  chicken: '🍗',
  cheese: '🧀',
  tomato: '🍅',
  carrot: '🥕',
  lettuce: '🥬',
  yogurt: '🥛',
  rice: '🍚',
  pasta: '🍝',
  fish: '🐟',
  banana: '🍌',
  orange: '🍊',
  grape: '🍇',
  strawberry: '🍓',
  pizza: '🍕',
  butter: '🧈',
  default: '🍽️',
}

function getEmojiForItem(name: string): string {
  const lowercaseName = name.toLowerCase()
  for (const [key, emoji] of Object.entries(foodEmojis)) {
    if (lowercaseName.includes(key)) {
      return emoji
    }
  }
  return foodEmojis.default
}

export default function AddItemPage() {
  const router = useRouter()
  const dispatch = useAppDispatch()

  const [itemName, setItemName] = useState('')
  const [category, setCategory] = useState<Exclude<Category, 'all'>>('produce')
  const [quantity, setQuantity] = useState('')
  const [unit, setUnit] = useState('pcs')
  const [expiryDate, setExpiryDate] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    await dispatch(createItem({
      name: itemName,
      category,
      quantity: parseInt(quantity) || 1,
      expiryDate,
    })).unwrap()

    // Navigate to inventory
    router.push('/inventory')
  }

  const previewEmoji = itemName ? getEmojiForItem(itemName) : '🍽️'

  return (
    <div className="max-w-2xl mx-auto">
      <div className="cozy-card-static p-6 md:p-10">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="text-6xl mb-4">{previewEmoji}</div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-foreground">
            Add To Shelf
          </h1>
          <p className="text-muted-foreground mt-2">
            What did you bring home today?
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Item Name */}
          <div>
            <label className="block text-lg font-bold text-foreground mb-2">
              🏷️ Item Name
            </label>
            <input
              type="text"
              value={itemName}
              onChange={(e) => setItemName(e.target.value)}
              className="cozy-input w-full text-lg"
              placeholder="e.g., Milk, Apples, Chicken..."
              required
            />
          </div>

          {/* Category */}
          <div>
            <label className="block text-lg font-bold text-foreground mb-3">
              📂 Category
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {categories.map((cat) => (
                <button
                  key={cat.value}
                  type="button"
                  onClick={() => setCategory(cat.value)}
                  className={`
                    p-4 rounded-xl border-3 border-foreground font-bold text-left
                    transition-all
                    ${category === cat.value 
                      ? 'bg-primary shadow-[4px_4px_0px_#1F2937]' 
                      : 'bg-card hover:bg-primary/30'
                    }
                  `}
                >
                  <span className="text-2xl block mb-1">{cat.emoji}</span>
                  <span className="text-sm">{cat.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Quantity */}
          <div>
            <label className="block text-lg font-bold text-foreground mb-2">
              📊 Quantity
            </label>
            <div className="flex gap-3">
              <input
                type="number"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                className="cozy-input flex-1 text-lg"
                placeholder="1"
                min="1"
                required
              />
              <select
                value={unit}
                onChange={(e) => setUnit(e.target.value)}
                className="cozy-input w-32"
              >
                <option value="pcs">pcs</option>
                <option value="lbs">lbs</option>
                <option value="oz">oz</option>
                <option value="gallon">gallon</option>
                <option value="liters">liters</option>
                <option value="cups">cups</option>
                <option value="bag">bag</option>
                <option value="box">box</option>
                <option value="loaf">loaf</option>
              </select>
            </div>
          </div>

          {/* Expiry Date */}
          <div>
            <label className="block text-lg font-bold text-foreground mb-2">
              📅 Expiry Date
            </label>
            <input
              type="date"
              value={expiryDate}
              onChange={(e) => setExpiryDate(e.target.value)}
              className="cozy-input w-full text-lg"
              required
            />
          </div>

          {/* Submit Button */}
          <div className="pt-4">
            <button type="submit" className="cozy-btn w-full text-xl py-4">
              🛒 Add To Shelf
            </button>
          </div>
        </form>

        {/* Back Link */}
        <div className="mt-6 text-center">
          <Link href="/inventory" className="text-muted-foreground hover:text-foreground font-semibold">
            ← Back to Inventory
          </Link>
        </div>
      </div>
    </div>
  )
}
