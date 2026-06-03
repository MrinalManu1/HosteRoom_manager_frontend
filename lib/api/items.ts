import { apiRequest } from '@/lib/api-client'

export interface ItemQuery {
  status?: string
  category?: string
  search?: string
  page?: number
  limit?: number
  sort?: string
}

export interface CreateItemInput {
  name: string
  category: string
  quantity: number
  expiryDate: string
}

export type UpdateItemInput = Partial<CreateItemInput>

export interface UpdateItemStatusInput {
  status: 'fresh' | 'expiring-soon' | 'expired' | 'used' | 'wasted'
}

export interface BackendItem {
  _id: string
  householdId: string
  addedBy?: string | { _id: string; name?: string; email?: string }
  name: string
  category: 'produce' | 'dairy' | 'meat' | 'pantry' | 'frozen' | 'other'
  quantity: number
  expiryDate: string
  status: 'fresh' | 'expiring-soon' | 'expired' | 'used' | 'wasted'
  createdAt: string
  updatedAt?: string
}

export interface ItemsResponse {
  items: BackendItem[]
  page: number
  totalPages: number
  totalItems: number
}

export interface ItemResponse {
  item: BackendItem
}

function withQuery(path: string, query?: ItemQuery) {
  if (!query) return path

  const params = new URLSearchParams()
  Object.entries(query).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      params.set(key, String(value))
    }
  })

  const queryString = params.toString()
  return queryString ? `${path}?${queryString}` : path
}

export const itemsApi = {
  getItems(query?: ItemQuery) {
    return apiRequest<ItemsResponse>(withQuery('/items', query))
  },

  createItem(input: CreateItemInput) {
    return apiRequest<ItemResponse>('/items', {
      method: 'POST',
      body: JSON.stringify(input),
    })
  },

  updateItem(id: string, input: UpdateItemInput) {
    return apiRequest<ItemResponse>(`/items/${id}`, {
      method: 'PUT',
      body: JSON.stringify(input),
    })
  },

  updateItemStatus(id: string, input: UpdateItemStatusInput) {
    return apiRequest<ItemResponse>(`/items/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify(input),
    })
  },

  deleteItem(id: string) {
    return apiRequest(`/items/${id}`, {
      method: 'DELETE',
    })
  },

  getItemHistory(id: string) {
    return apiRequest(`/items/${id}/history`)
  },
}
