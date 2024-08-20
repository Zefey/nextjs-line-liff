'use client'

import { Button } from 'antd-mobile'
import { useRouter } from 'next/navigation'
import { useLiffContext } from '../liffContext'

import styles from './page.module.scss'

export default function Home() {
  const router = useRouter()
  const { liffObject, liffInfo } = useLiffContext()
  console.log('liffObject', liffObject)
  console.log('liffInfo', liffInfo)
  return (
    <div>
      <Button color="primary" onClick={() => router.back()}>
        back
      </Button>
    </div>
  )
}
