'use client'

import 'normalize.css/normalize.css'
import './globals.css'
import { ILiffInfo, LiffContextProvider } from './context/liffContext'
import liff, { Liff } from '@line/liff'
import { useEffect, useState } from 'react'
import { ConfigProvider } from 'antd-mobile'
import { IntlProvider } from 'react-intl'
import antdzhCN from 'antd-mobile/es/locales/zh-CN'
import antdenUS from 'antd-mobile/es/locales/en-US'
import en from '../../lang/en.json'
import zh from '../../lang/zh.json'
import { LanguageProvider, LocaleType, useLanguage } from './context/languageContext'

const appLocale = {
  en: {
    messages: en,
    antd: antdenUS,
    locale: 'en-US',
  },
  zh: {
    messages: zh,
    antd: antdzhCN,
    locale: 'zh-CN',
  },
}

const IntlWrapper = ({ children }: { children: any }) => {
  const { locale } = useLanguage()

  return (
    <IntlProvider messages={appLocale[locale].messages} locale={locale} defaultLocale={locale}>
      <ConfigProvider locale={appLocale[locale].antd}>{children}</ConfigProvider>
    </IntlProvider>
  )
}

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
        const loggedIn = liff.isLoggedIn()
        const accessToken = liff.getAccessToken()
        const IDToken = liff.getIDToken()
        setLiffInfo({
          context,
          os,
          appLanguage,
          version,
          lineVersion,
          inClient,
          loggedIn,
          accessToken,
          IDToken,
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
    <html>
      <body>
        <LanguageProvider>
          <IntlWrapper>
            <LiffContextProvider
              value={{
                liffObject,
                liffInfo,
                liffError,
              }}
            >
              {children}
            </LiffContextProvider>
          </IntlWrapper>
        </LanguageProvider>
      </body>
    </html>
  )
}
