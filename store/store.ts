import { configureStore } from '@reduxjs/toolkit'
import authReducer from '@/features/authSlice'
import householdReducer from '@/features/householdSlice'
import inventoryReducer from '@/features/inventorySlice'
import notificationReducer from '@/features/notificationSlice'
import dashboardReducer from '@/features/dashboardSlice'

export const store = configureStore({
  reducer: {
    auth: authReducer,
    household: householdReducer,
    inventory: inventoryReducer,
    notification: notificationReducer,
    dashboard: dashboardReducer,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch