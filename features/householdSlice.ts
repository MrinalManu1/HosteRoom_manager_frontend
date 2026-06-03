import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export interface Member {
  id: string
  name: string
  avatar: string
  itemsAdded: number
  itemsUsed: number
  itemsWasted: number
  score: number
  rank: number
  isOnline: boolean
}

export interface Household {
  id: string
  name: string
  inviteCode: string
  createdAt: string
  totalItemsTracked: number
  wasteReduced: string
  wasteScore: number
}

interface HouseholdState {
  household: Household | null
  members: Member[]
  onlineMembers: string[] // array of member IDs
  loading: boolean
}

const initialState: HouseholdState = {
  household: null,
  members: [],
  onlineMembers: [],
  loading: false,
}

const householdSlice = createSlice({
  name: 'household',
  initialState,
  reducers: {
    setHousehold: (state, action: PayloadAction<Household>) => {
      state.household = action.payload
    },
    setMembers: (state, action: PayloadAction<Member[]>) => {
      state.members = action.payload
    },
    setOnlineMembers: (state, action: PayloadAction<string[]>) => {
      state.onlineMembers = action.payload
      // Update isOnline status for each member
      state.members = state.members.map((m) => ({
        ...m,
        isOnline: action.payload.includes(m.id),
      }))
    },
    memberCameOnline: (state, action: PayloadAction<string>) => {
      if (!state.onlineMembers.includes(action.payload)) {
        state.onlineMembers.push(action.payload)
      }
      const member = state.members.find((m) => m.id === action.payload)
      if (member) member.isOnline = true
    },
    memberWentOffline: (state, action: PayloadAction<string>) => {
      state.onlineMembers = state.onlineMembers.filter((id) => id !== action.payload)
      const member = state.members.find((m) => m.id === action.payload)
      if (member) member.isOnline = false
    },
    memberJoined: (state, action: PayloadAction<Member>) => {
      state.members.push(action.payload)
    },
    memberLeft: (state, action: PayloadAction<string>) => {
      state.members = state.members.filter((m) => m.id !== action.payload)
      state.onlineMembers = state.onlineMembers.filter((id) => id !== action.payload)
    },
    updateMemberStats: (
      state,
      action: PayloadAction<{ memberId: string; itemsUsed?: number; itemsWasted?: number; itemsAdded?: number }>
    ) => {
      const member = state.members.find((m) => m.id === action.payload.memberId)
      if (member) {
        if (action.payload.itemsUsed !== undefined) member.itemsUsed = action.payload.itemsUsed
        if (action.payload.itemsWasted !== undefined) member.itemsWasted = action.payload.itemsWasted
        if (action.payload.itemsAdded !== undefined) member.itemsAdded = action.payload.itemsAdded
      }
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload
    },
  },
})

export const {
  setHousehold,
  setMembers,
  setOnlineMembers,
  memberCameOnline,
  memberWentOffline,
  memberJoined,
  memberLeft,
  updateMemberStats,
  setLoading,
} = householdSlice.actions
export default householdSlice.reducer
