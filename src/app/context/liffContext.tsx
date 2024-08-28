import type { Liff } from '@line/liff'
import React, { createContext, useContext } from 'react'

export interface ILiffInfo {
  context: ReturnType<Liff['getContext']>
  os: ReturnType<Liff['getOS']>
  appLanguage: ReturnType<Liff['getLanguage']>
  version: ReturnType<Liff['getVersion']>
  lineVersion: ReturnType<Liff['getLineVersion']>
  inClient: ReturnType<Liff['isInClient']>
  loggedIn: ReturnType<Liff['isLoggedIn']>
  accessToken: ReturnType<Liff['getAccessToken']>
  IDToken: ReturnType<Liff['getIDToken']>
}

export interface ILiffContext {
  liffObject: Liff | null
  liffInfo: ILiffInfo | null
  liffError: string
}

const LiffContext = createContext<ILiffContext>({
  liffObject: null,
  liffInfo: null,
  liffError: '',
})

export const LiffContextProvider: React.FC<{
  children: React.ReactNode
  value: ILiffContext
}> = ({ children, value }) => {
  return <LiffContext.Provider value={value}>{children}</LiffContext.Provider>
}

export function useLiffContext() {
  return useContext(LiffContext)
}
