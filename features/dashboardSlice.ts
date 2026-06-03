import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { dashboardApi } from '@/lib/api/dashboard'

export interface DashboardStats {
  fresh: number
  expiringSoon: number
  expired: number
  used: number
  wasted: number
  wasteScore: number
}

export interface ExpiringItem {
  _id: string
  name: string
  category: string
  quantity: number
  expiryDate: string
  status: string
}

interface DashboardState {
  stats: DashboardStats | null
  expiringItems: ExpiringItem[]
  loading: boolean
  error: string | null
}

const initialState: DashboardState = {
  stats: null,
  expiringItems: [],
  loading: false,
  error: null,
}

export const fetchDashboardStats = createAsyncThunk<DashboardStats>(
  'dashboard/fetchStats',
  async () => {
    const data = await dashboardApi.getStats()
    return data as DashboardStats
  }
)

export const fetchExpiringItems = createAsyncThunk<ExpiringItem[]>(
  'dashboard/fetchExpiringItems',
  async () => {
    const data = await dashboardApi.getExpiringItems() as { items: ExpiringItem[] }
    return data.items
  }
)

const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchDashboardStats.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchDashboardStats.fulfilled, (state, action) => {
        state.loading = false
        state.stats = action.payload
      })
      .addCase(fetchDashboardStats.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message || 'Failed to load stats'
      })
      .addCase(fetchExpiringItems.fulfilled, (state, action) => {
        state.expiringItems = action.payload
      })
  },
})

export default dashboardSlice.reducer