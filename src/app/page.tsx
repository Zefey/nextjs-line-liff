'use client'

import { useEffect, useMemo, useState } from 'react'
import { useLiffContext } from '@/app/context/liffContext'
import { LocaleType, useLanguage } from '@/app/context/languageContext'
import { ActionSheet, Avatar, Button, Dialog, Ellipsis, List, Space } from 'antd-mobile'
import { useRouter } from 'next/navigation'
import { FormattedMessage } from 'react-intl'
import type { Action } from 'antd-mobile/es/components/action-sheet'

import styles from './page.module.scss'

export default function Home() {
  const router = useRouter()
  const [info, setInfo] = useState<any>({})
  const { liffObject, liffInfo } = useLiffContext()
  const { setLocale } = useLanguage()
  const [actionVisible, setActionVisible] = useState(false)

  const actions = useMemo<Action[]>(() => {
    return [
      { text: '中文', key: 'zh' },
      { text: 'English', key: 'en' },
    ]
  }, [])
  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (res) => {
        console.log('getCurrentPosition', res.coords)
        //包含位置的经纬度、速度、海拔、经纬度精度、海拔精度信息
        setInfo((prev: any) => ({
          ...prev,
          latitude: res.coords.latitude,
          longitude: res.coords.longitude,
        }))
      },
      (err) => {
        console.log('getCurrentPosition', err)
      },
      {
        enableHighAccuracy: true, //高精度
        timeout: 5000, //超时时间,以ms为单位
        maximumAge: 24 * 60 * 60 * 1000, //位置缓存时间,以ms为单位
      },
    )
  }, [])

  useEffect(() => {
    if (liffObject) {
      liffObject.ready.then(() => {
        if (liffInfo?.inClient) {
          liffObject?.permission
            .query('profile')
            .then((permissionStatus) => {
              setInfo((prev: any) => ({
                ...prev,
                profileState: permissionStatus.state,
              }))

              if (permissionStatus.state === 'granted') {
                liffObject
                  .getProfile()
                  .then(({ userId, displayName, pictureUrl, statusMessage }) => {
                    setInfo((prev: any) => ({
                      ...prev,
                      userId,
                      displayName,
                      pictureUrl,
                      statusMessage,
                    }))
                  })
                  .catch((err) => {
                    console.log('getProfile error', err)
                  })
              }
            })
            .catch((err) => {
              console.log('query profile error', err)
            })
        }
      })
    }
  }, [liffObject])

  const handleLogin = () => {
    console.log('liffObject?.isLoggedIn()', liffObject?.isLoggedIn())
    if (!liffObject?.isLoggedIn()) {
      liffObject?.login()
    }
  }

  const handleLogout = () => {
    console.log('liffObject?.isLoggedIn()', liffObject?.isLoggedIn())
    if (liffObject?.isLoggedIn()) {
      liffObject?.logout()
    }
  }

  const handleAuthProfile = () => {
    if (info.profileState === 'prompt') {
      liffObject?.permission.requestAll()
    }
  }

  const handleJump = () => {
    router.push('/test')
  }

  const handleScan = () => {
    if (liffObject?.isLoggedIn()) {
      liffObject
        ?.scanCodeV2()
        .then((result) => {
          // result = { value: "" }
          console.log('result', result)
          Dialog.alert({
            content: result.value,
            closeOnMaskClick: true,
          })
        })
        .catch((error) => {
          console.log('error', error)
        })
    } else {
      liffObject?.login()
    }
  }

  const handleSwitchLanguage = () => {
    setActionVisible(true)
  }

  console.log('window?.location?.href...', window?.location?.href)

  return (
    <div className={styles.container}>
      <Space wrap>
        <Button onClick={handleLogin} color="primary">
          <FormattedMessage defaultMessage="登录" />
        </Button>
        <Button onClick={handleLogout} color="primary">
          <FormattedMessage defaultMessage="登出" />
        </Button>

        {info.profileState === 'prompt' && (
          <Button onClick={handleAuthProfile} color="primary">
            <FormattedMessage defaultMessage="授权" />
          </Button>
        )}
        <Button onClick={handleJump} color="primary">
          <FormattedMessage defaultMessage="跳转" />
        </Button>
        <Button onClick={handleScan} color="primary">
          <FormattedMessage defaultMessage="扫码" />
        </Button>
        <Button onClick={handleSwitchLanguage} color="primary">
          <FormattedMessage defaultMessage="切换语言" />
        </Button>
      </Space>

      <List header={<FormattedMessage defaultMessage="列表信息" />}>
        <List.Item extra={<Avatar src={info.pictureUrl} />} description={info.userId}>
          {info.displayName}
        </List.Item>
        <List.Item
          extra={
            <div>
              {info.longitude} - {info.latitude}
            </div>
          }
        >
          <FormattedMessage defaultMessage="位置" />
        </List.Item>
        <List.Item extra={liffInfo?.os}>
          <FormattedMessage defaultMessage="系统" />
        </List.Item>
        <List.Item extra={liffInfo?.appLanguage}>
          <FormattedMessage defaultMessage="语言" />
        </List.Item>
        <List.Item extra={liffInfo?.version}>
          <FormattedMessage defaultMessage="版本" />
        </List.Item>
        <List.Item extra={liffInfo?.lineVersion}>
          <FormattedMessage defaultMessage="line版本" />
        </List.Item>
        <List.Item extra={String(liffInfo?.inClient)}>
          <FormattedMessage defaultMessage="是否客户端" />
        </List.Item>
        <List.Item extra={String(liffInfo?.loggedIn)}>
          <FormattedMessage defaultMessage="登录状态" />
        </List.Item>
        <List.Item extra={info.profileState}>
          <FormattedMessage defaultMessage="授权状态" />
        </List.Item>
      </List>

      <div className={styles.block}>
        <span>
          <FormattedMessage defaultMessage="accessToken" />
        </span>
        <Ellipsis
          content={liffInfo?.accessToken ?? ''}
          defaultExpanded={true}
          expandText={<FormattedMessage defaultMessage="展开" />}
          collapseText={<FormattedMessage defaultMessage="收起" />}
        />
      </div>
      <div className={styles.block}>
        <span>
          <FormattedMessage defaultMessage="IDToken" />
        </span>
        <Ellipsis
          content={liffInfo?.IDToken ?? ''}
          defaultExpanded={true}
          expandText={<FormattedMessage defaultMessage="展开" />}
          collapseText={<FormattedMessage defaultMessage="收起" />}
        />
      </div>
      <ActionSheet
        visible={actionVisible}
        actions={actions}
        onAction={(action) => {
          setLocale(action.key as LocaleType)
          setActionVisible(false)
        }}
        onClose={() => setActionVisible(false)}
      />
    </div>
  )
}
