'use client'

import { Inter } from 'next/font/google'
import 'normalize.css/normalize.css'
import './globals.css'
import { ILiffInfo, LiffContextProvider } from './liffContext'
import liff, { Liff } from '@line/liff'
import { useEffect, useState } from 'react'

const inter = Inter({ subsets: ['latin'] })

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const [liffObject, setLiffObject] = useState<Liff | null>(null)
  const [liffError, setLiffError] = useState('')
  const [liffInfo, setLiffInfo] = useState<ILiffInfo | null>(null)

  useEffect(() => {
    console.log('start liff.init()...', process.env.LIFF_ID)
    liff
      .init({ liffId: process.env.LIFF_ID ?? '' })
      .then(() => {
        console.log('liff.init() done')
        setLiffObject(liff)
        const context = liff.getContext()
        const os = liff.getOS()
        const appLanguage = liff.getAppLanguage()
        const version = liff.getVersion()
        const lineVersion = liff.getLineVersion()
        const inClient = liff.isInClient()
        setLiffInfo({
          context,
          os,
          appLanguage,
          version,
          lineVersion,
          inClient,
        })
      })
      .catch((error) => {
        console.log(`liff.init() failed: ${error}`)
        if (!process.env.liffId) {
          console.info(
            'LIFF Starter: Please make sure that you provided `LIFF_ID` as an environmental variable.',
          )
        }
        setLiffError(error.toString())
      })
  }, [])

  return (
    <html lang="en">
      <body className={inter.className}>
        <LiffContextProvider
          value={{
            liffObject,
            liffInfo,
            liffError,
          }}
        >
          {children}
        </LiffContextProvider>
      </body>
    </html>
  )
}
