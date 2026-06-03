import { apiRequest } from '@/lib/api-client'
import type { DashboardStats, ExpiringItem } from '@/features/dashboardSlice'

export const dashboardApi = {
 getStats() {
    return apiRequest<DashboardStats>('/dashboard/stats')
  },

  getExpiringItems() {
    return apiRequest<{ items: ExpiringItem[] }>('/dashboard/expiring')
  },

  getAnalytics() {
    return apiRequest('/dashboard/analytics')
  },
}
