'use client'

import { useEffect } from 'react'
import { useAppDispatch } from '@/store/hooks'
import { setActivities, setNotifications } from '@/features/notificationSlice'

// Mock activities for demo
const mockActivities = [
  { id: '1', type: 'item_added' as const, message: 'Manu added Milk', emoji: '🥛', userName: 'Manu', itemName: 'Milk', timestamp: new Date(Date.now() - 5 * 60000).toISOString() },
  { id: '2', type: 'item_used' as const, message: 'Rahul marked Bread as Used', emoji: '🍞', userName: 'Rahul', itemName: 'Bread', timestamp: new Date(Date.now() - 15 * 60000).toISOString() },
  { id: '3', type: 'item_wasted' as const, message: 'Priya marked Tomatoes as Wasted', emoji: '🗑️', userName: 'Priya', itemName: 'Tomatoes', timestamp: new Date(Date.now() - 30 * 60000).toISOString() },
  { id: '4', type: 'member_joined' as const, message: 'Aman joined the household', emoji: '🏠', userName: 'Aman', timestamp: new Date(Date.now() - 60 * 60000).toISOString() },
  { id: '5', type: 'item_added' as const, message: 'Sam added Eggs', emoji: '🥚', userName: 'Sam', itemName: 'Eggs', timestamp: new Date(Date.now() - 2 * 60 * 60000).toISOString() },
]

const mockNotifications = [
  { id: '1', type: 'expiry_warning' as const, title: 'Milk expires tomorrow', message: 'Use it up before it goes bad!', emoji: '⚠️', read: false, timestamp: new Date(Date.now() - 10 * 60000).toISOString() },
  { id: '2', type: 'expiry_warning' as const, title: 'Eggs expire in 12 hours', message: 'Time for breakfast!', emoji: '⚠️', read: false, timestamp: new Date(Date.now() - 30 * 60000).toISOString() },
  { id: '3', type: 'achievement' as const, title: 'Household waste score improved!', message: 'You went from 82% to 87%', emoji: '🏆', read: true, timestamp: new Date(Date.now() - 2 * 60 * 60000).toISOString() },
]

export function MockDataLoader() {
  const dispatch = useAppDispatch()

  useEffect(() => {
    dispatch(setActivities(mockActivities))
    dispatch(setNotifications(mockNotifications))
  }, [dispatch])

  return null
}
