import { apiRequest } from '@/lib/api-client'

export const dashboardApi = {
  getStats() {
    return apiRequest('/dashboard/stats')
  },

  getExpiringItems() {
    return apiRequest('/dashboard/expiring')
  },

  getAnalytics() {
    return apiRequest('/dashboard/analytics')
  },
}
