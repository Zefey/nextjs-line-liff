'use client'

import { Button } from 'antd-mobile'
import { useRouter } from 'next/navigation'
import { useLiffContext } from '../liffContext'

import styles from './page.module.scss'

const Test = () => {
  const router = useRouter()
  const { liffObject, liffInfo } = useLiffContext()
  const test: any = null

  console.log('liffObject', liffObject)
  console.log('liffInfo', liffInfo)

  return (
    <div>
      <Button color="primary" onClick={() => router.back()}>
        {/* 尝试错误触发 */}
        back{test.a.b}
      </Button>
    </div>
  )
}

export default Test
