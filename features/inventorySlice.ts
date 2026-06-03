import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export type Category = 'all' | 'produce' | 'dairy' | 'meat' | 'pantry' | 'frozen' | 'other'
export type Status = 'fresh' | 'expiring' | 'expired'

export interface InventoryItem {
  id: string
  name: string
  emoji: string
  category: Exclude<Category, 'all'>
  quantity: number
  unit: string
  expiryDate: string
  addedBy: string
  addedById: string
  createdAt: string
}

interface InventoryState {
  items: InventoryItem[]
  filter: Category
  searchQuery: string
  loading: boolean
}

const initialState: InventoryState = {
  items: [],
  filter: 'all',
  searchQuery: '',
  loading: false,
}

const inventorySlice = createSlice({
  name: 'inventory',
  initialState,
  reducers: {
    setItems: (state, action: PayloadAction<InventoryItem[]>) => {
      state.items = action.payload
    },
    addItem: (state, action: PayloadAction<InventoryItem>) => {
      state.items.unshift(action.payload)
    },
    updateItem: (state, action: PayloadAction<InventoryItem>) => {
      const index = state.items.findIndex((i) => i.id === action.payload.id)
      if (index !== -1) {
        state.items[index] = action.payload
      }
    },
    removeItem: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter((i) => i.id !== action.payload)
    },
    setFilter: (state, action: PayloadAction<Category>) => {
      state.filter = action.payload
    },
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload
    },
  },
})

export const { setItems, addItem, updateItem, removeItem, setFilter, setSearchQuery, setLoading } =
  inventorySlice.actions
export default inventorySlice.reducer

// Selectors
export const selectFilteredItems = (state: { inventory: InventoryState }) => {
  const { items, filter, searchQuery } = state.inventory
  return items.filter((item) => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = filter === 'all' || item.category === filter
    return matchesSearch && matchesCategory
  })
}
