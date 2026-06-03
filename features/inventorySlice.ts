import { createAsyncThunk, createSlice, isAnyOf, PayloadAction } from '@reduxjs/toolkit'
import { itemsApi, type BackendItem, type CreateItemInput, type ItemQuery, type UpdateItemInput } from '@/lib/api/items'

export type Category = 'all' | 'produce' | 'dairy' | 'meat' | 'pantry' | 'frozen' | 'other'
export type Status = 'fresh' | 'expiring' | 'expired' | 'used' | 'wasted'

export interface InventoryItem {
  id: string
  name: string
  emoji: string
  category: Exclude<Category, 'all'>
  quantity: number
  unit: string
  expiryDate: string
  status: Status
  addedBy: string
  addedById: string
  createdAt: string
}

interface InventoryState {
  items: InventoryItem[]
  filter: Category
  searchQuery: string
  loading: boolean
  error: string | null
}

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

function normalizeItem(item: BackendItem): InventoryItem {
  const addedBy = item.addedBy

  return {
    id: item._id,
    name: item.name,
    emoji: Object.entries(foodEmojis).find(([key]) => item.name.toLowerCase().includes(key))?.[1] || foodEmojis.default,
    category: item.category,
    quantity: item.quantity,
    unit: 'pcs',
    expiryDate: item.expiryDate,
    status: item.status === 'expiring-soon' ? 'expiring' : item.status,
    addedBy: !addedBy || typeof addedBy === 'string' ? 'Someone' : addedBy.name || 'Someone',
    addedById: !addedBy ? '' : typeof addedBy === 'string' ? addedBy : addedBy._id,
    createdAt: item.createdAt,
  }
}

function itemQuery(state: { inventory: InventoryState }): ItemQuery {
  const { filter, searchQuery } = state.inventory
  return {
    category: filter === 'all' ? undefined : filter,
    search: searchQuery || undefined,
    limit: 100,
    sort: 'expiryDate',
  }
}

export const fetchItems = createAsyncThunk<InventoryItem[], void, { state: { inventory: InventoryState } }>(
  'inventory/fetchItems',
  async (_, api) => (await itemsApi.getItems(itemQuery(api.getState()))).items.map(normalizeItem)
)

export const createItem = createAsyncThunk<InventoryItem, CreateItemInput, { state: { inventory: InventoryState } }>(
  'inventory/createItem',
  async (input, api) => {
    const item = normalizeItem((await itemsApi.createItem(input)).item)
    await api.dispatch(fetchItems())
    return item
  }
)

export const updateRemoteItem = createAsyncThunk<
  InventoryItem,
  { id: string; input: UpdateItemInput },
  { state: { inventory: InventoryState } }
>('inventory/updateRemoteItem', async ({ id, input }, api) => {
  const item = normalizeItem((await itemsApi.updateItem(id, input)).item)
  await api.dispatch(fetchItems())
  return item
})

export const deleteItem = createAsyncThunk<string, string, { state: { inventory: InventoryState } }>(
  'inventory/deleteItem',
  async (id, api) => {
    await itemsApi.deleteItem(id)
    await api.dispatch(fetchItems())
    return id
  }
)

export const markItemUsed = createAsyncThunk<InventoryItem, string, { state: { inventory: InventoryState } }>(
  'inventory/markItemUsed',
  async (id, api) => {
    const item = normalizeItem((await itemsApi.updateItemStatus(id, { status: 'used' })).item)
    await api.dispatch(fetchItems())
    return item
  }
)

export const markItemWasted = createAsyncThunk<InventoryItem, string, { state: { inventory: InventoryState } }>(
  'inventory/markItemWasted',
  async (id, api) => {
    const item = normalizeItem((await itemsApi.updateItemStatus(id, { status: 'wasted' })).item)
    await api.dispatch(fetchItems())
    return item
  }
)

const initialState: InventoryState = {
  items: [],
  filter: 'all',
  searchQuery: '',
  loading: false,
  error: null,
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
      const index = state.items.findIndex((item) => item.id === action.payload.id)
      if (index !== -1) state.items[index] = action.payload
    },
    removeItem: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter((item) => item.id !== action.payload)
    },
    setFilter: (state, action: PayloadAction<Category>) => {
      state.filter = action.payload
    },
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchItems.fulfilled, (state, action) => {
        state.items = action.payload
      })
      .addMatcher(
        isAnyOf(fetchItems.pending, createItem.pending, updateRemoteItem.pending, deleteItem.pending, markItemUsed.pending, markItemWasted.pending),
        (state) => {
          state.loading = true
          state.error = null
        }
      )
      .addMatcher(
        isAnyOf(fetchItems.fulfilled, createItem.fulfilled, updateRemoteItem.fulfilled, deleteItem.fulfilled, markItemUsed.fulfilled, markItemWasted.fulfilled),
        (state) => {
          state.loading = false
        }
      )
      .addMatcher(
        isAnyOf(fetchItems.rejected, createItem.rejected, updateRemoteItem.rejected, deleteItem.rejected, markItemUsed.rejected, markItemWasted.rejected),
        (state, action) => {
          state.loading = false
          state.error = action.error.message || 'Inventory action failed'
        }
      )
  },
})

export const { setItems, addItem, updateItem, removeItem, setFilter, setSearchQuery } = inventorySlice.actions
export default inventorySlice.reducer

export const selectFilteredItems = (state: { inventory: InventoryState }) => state.inventory.items
export const selectItemsLoading = (state: { inventory: InventoryState }) => state.inventory.loading
export const selectItemsError = (state: { inventory: InventoryState }) => state.inventory.error
