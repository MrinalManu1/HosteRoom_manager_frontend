import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export type ActivityType =
  | 'item_added'
  | 'item_used'
  | 'item_wasted'
  | 'item_updated'
  | 'member_joined'
  | 'member_left'
  | 'expiry_alert'

export interface Activity {
  id: string
  type: ActivityType
  message: string
  emoji: string
  userId?: string
  userName?: string
  itemName?: string
  timestamp: string
}

export interface Notification {
  id: string
  type: 'expiry_warning' | 'household_update' | 'achievement'
  title: string
  message: string
  emoji: string
  read: boolean
  timestamp: string
}

interface NotificationState {
  activities: Activity[]
  notifications: Notification[]
  unreadCount: number
}

const initialState: NotificationState = {
  activities: [],
  notifications: [],
  unreadCount: 0,
}

const notificationSlice = createSlice({
  name: 'notification',
  initialState,
  reducers: {
    addActivity: (state, action: PayloadAction<Activity>) => {
      state.activities.unshift(action.payload)
      // Keep only the latest 10 activities
      if (state.activities.length > 10) {
        state.activities = state.activities.slice(0, 10)
      }
    },
    setActivities: (state, action: PayloadAction<Activity[]>) => {
      state.activities = action.payload.slice(0, 10)
    },
    addNotification: (state, action: PayloadAction<Notification>) => {
      state.notifications.unshift(action.payload)
      state.unreadCount += 1
    },
    setNotifications: (state, action: PayloadAction<Notification[]>) => {
      state.notifications = action.payload
      state.unreadCount = action.payload.filter((n) => !n.read).length
    },
    markNotificationRead: (state, action: PayloadAction<string>) => {
      const notification = state.notifications.find((n) => n.id === action.payload)
      if (notification && !notification.read) {
        notification.read = true
        state.unreadCount -= 1
      }
    },
    markAllRead: (state) => {
      state.notifications.forEach((n) => (n.read = true))
      state.unreadCount = 0
    },
    clearNotifications: (state) => {
      state.notifications = []
      state.unreadCount = 0
    },
  },
})

export const {
  addActivity,
  setActivities,
  addNotification,
  setNotifications,
  markNotificationRead,
  markAllRead,
  clearNotifications,
} = notificationSlice.actions
export default notificationSlice.reducer
