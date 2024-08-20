'use client'

import Head from 'next/head'
import { useEffect, useState } from 'react'
import { useLiffContext } from './liffContext'
import { Avatar, Button, Ellipsis, List, Space } from 'antd-mobile'
import { useRouter } from 'next/navigation'

import styles from './page.module.scss'

export default function Home() {
  const router = useRouter()
  const [info, setInfo] = useState<any>({})
  const { liffObject, liffInfo } = useLiffContext()

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (res) => {
        console.log('getCurrentPosition', res.coords) //包含位置的经纬度、速度、海拔、经纬度精度、海拔精度信息

        setInfo((prev: any) => ({
          ...prev,
          latitude: res.coords.latitude,
          longitude: res.coords.longitude,
        }))
      },
      (err) => {
        console.log('getCurrentPosition', err) //获取失败的原因
      },
      {
        //可增加的4个配置参数
        enableHighAccuracy: true, //高精度
        timeout: 5000, //超时时间,以ms为单位
        maximumAge: 24 * 60 * 60 * 1000, //位置缓存时间,以ms为单位
      },
    )
  }, [])

  useEffect(() => {
    if (liffObject) {
      liffObject.ready.then(() => {
        const loggedIn = liffObject.isLoggedIn()
        const accessToken = liffObject.getAccessToken()
        const IDToken = liffObject.getIDToken()
        setInfo((prev: any) => ({
          ...prev,
          loggedIn,
          accessToken,
          IDToken,
        }))
        if (liffInfo?.inClient) {
          liffObject?.permission
            .query('profile')
            .then((permissionStatus) => {
              setInfo((prev: any) => ({
                ...prev,
                profileState: permissionStatus.state,
              }))
            })
            .catch((err) => {
              console.log('error', err)
            })

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
              console.log('error', err)
            })
        }
      })
    }
  }, [liffObject])

  const handleLogin = () => {
    if (!liffObject?.isLoggedIn()) {
      liffObject?.login()
    }
  }

  const handleLogout = () => {
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

  return (
    <div className={styles.container}>
      <Head>
        <title>LIFF Starter</title>
      </Head>
      <Space>
        {info.loggedIn ? (
          <Button onClick={handleLogout} color="primary">
            logout
          </Button>
        ) : (
          <Button onClick={handleLogin} color="primary">
            login
          </Button>
        )}

        <Button onClick={handleAuthProfile} color="primary">
          auth-profile
        </Button>
        <Button onClick={handleJump} color="primary">
          jump test
        </Button>
      </Space>

      <List header="list info">
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
          location
        </List.Item>
        <List.Item extra={liffInfo?.os}>os</List.Item>
        <List.Item extra={liffInfo?.appLanguage}>appLanguage</List.Item>
        <List.Item extra={liffInfo?.version}>version</List.Item>
        <List.Item extra={liffInfo?.lineVersion}>lineVersion</List.Item>
        <List.Item extra={String(liffInfo?.inClient)}>inClient</List.Item>
        <List.Item extra={String(info.loggedIn)}>loggedIn</List.Item>
        <List.Item extra={info.profileState}>profileState</List.Item>
      </List>

      <div className={styles.block}>
        <span>accessToken</span>
        <Ellipsis
          content={info.accessToken ?? ''}
          defaultExpanded={true}
          expandText="展开"
          collapseText="收起"
        />
      </div>
      <div className={styles.block}>
        <span>IDToken</span>
        <Ellipsis
          content={info.IDToken ?? ''}
          defaultExpanded={true}
          expandText="展开"
          collapseText="收起"
        />
      </div>
    </div>
  )
}
