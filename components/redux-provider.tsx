'use client'

import { useEffect } from 'react'
import { Provider } from 'react-redux'
import { bootstrapAuth } from '@/features/authSlice'
import { store } from '@/store/store'
import { useAppDispatch, useAppSelector } from '@/store/hooks'

export function ReduxProvider({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      <AuthBootstrap />
      {children}
    </Provider>
  )
}

function AuthBootstrap() {
  const dispatch = useAppDispatch()
  const hasBootstrapped = useAppSelector((state) => state.auth.hasBootstrapped)

  useEffect(() => {
    if (!hasBootstrapped) dispatch(bootstrapAuth())
  }, [dispatch, hasBootstrapped])

  return null
}
