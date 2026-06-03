import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'
import { authApi, type LoginInput, type RegisterInput } from '@/lib/api/auth'
import { clearStoredAuth, getStoredAuth, setStoredAuth } from '@/lib/api-client'

export interface User {
  id: string
  name: string
  email: string
  avatar?: string
  householdId?: string | null
  role?: string
}

interface AuthState {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  loading: boolean
  hasBootstrapped: boolean
  error: string | null
}

const initialState: AuthState = {
  user: null,
  token: null,
  isAuthenticated: false,
  loading: false,
  hasBootstrapped: false,
  error: null,
}

interface AuthPayload {
  user: User
  token: string
}

export const login = createAsyncThunk<AuthPayload, LoginInput>(
  'auth/login',
  async (credentials) => {
    const auth = await authApi.login(credentials)
    setStoredAuth(auth)
    return auth
  }
)

export const register = createAsyncThunk<AuthPayload, RegisterInput>(
  'auth/register',
  async (input) => {
    const auth = await authApi.register(input)
    setStoredAuth(auth)
    return auth
  }
)

export const bootstrapAuth = createAsyncThunk<AuthPayload | null>(
  'auth/bootstrapAuth',
  async () => getStoredAuth<User>()
)

export const logout = createAsyncThunk('auth/logout', async () => {
  clearStoredAuth()
})

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (state, action: PayloadAction<{ user: User; token: string }>) => {
      state.user = action.payload.user
      state.token = action.payload.token
      state.isAuthenticated = true
      state.error = null
    },
    clearCredentials: (state) => {
      state.user = null
      state.token = null
      state.isAuthenticated = false
      state.error = null
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false
        state.user = action.payload.user
        state.token = action.payload.token
        state.isAuthenticated = true
        state.hasBootstrapped = true
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message || 'Login failed'
      })
      .addCase(register.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(register.fulfilled, (state, action) => {
        state.loading = false
        state.user = action.payload.user
        state.token = action.payload.token
        state.isAuthenticated = true
        state.hasBootstrapped = true
      })
      .addCase(register.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message || 'Registration failed'
      })
      .addCase(bootstrapAuth.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(bootstrapAuth.fulfilled, (state, action) => {
        state.loading = false
        state.hasBootstrapped = true

        if (action.payload) {
          state.user = action.payload.user
          state.token = action.payload.token
          state.isAuthenticated = true
        }
      })
      .addCase(bootstrapAuth.rejected, (state) => {
        state.loading = false
        state.hasBootstrapped = true
        state.isAuthenticated = false
      })
      .addCase(logout.fulfilled, (state) => {
        state.user = null
        state.token = null
        state.isAuthenticated = false
        state.hasBootstrapped = true
        state.error = null
      })
  },
})

export const { setCredentials, clearCredentials, setLoading } = authSlice.actions
export default authSlice.reducer
