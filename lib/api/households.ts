import { apiRequest } from '@/lib/api-client'

export interface CreateHouseholdInput {
  name: string
}

export interface JoinHouseholdInput {
  inviteCode: string
}

export const householdsApi = {
  createHousehold(input: CreateHouseholdInput) {
    return apiRequest('/households', {
      method: 'POST',
      body: JSON.stringify(input),
    })
  },

  joinHousehold(input: JoinHouseholdInput) {
    return apiRequest('/households/join', {
      method: 'POST',
      body: JSON.stringify(input),
    })
  },

  getMyHousehold() {
    return apiRequest('/households/me')
  },

  getMembers(householdId: string) {
    return apiRequest(`/households/${householdId}/members`)
  },

  getOnlineMembers() {
    return apiRequest('/households/online-members')
  },

  regenerateInviteCode() {
    return apiRequest('/households/invite-code', {
      method: 'PATCH',
    })
  },

  removeMember(memberId: string) {
    return apiRequest(`/households/members/${memberId}`, {
      method: 'DELETE',
    })
  },

  leaveHousehold() {
    return apiRequest('/households/leave', {
      method: 'DELETE',
    })
  },
}
