'use client'

import { Button } from 'antd-mobile'
import { useRouter } from 'next/navigation'
import { useLiffContext } from '@/app/context/liffContext'
import { FormattedMessage, useIntl } from 'react-intl'

import styles from './page.module.scss'

const Test = () => {
  const router = useRouter()
  const intl = useIntl()
  const { liffObject, liffInfo } = useLiffContext()

  console.log('liffObject', liffObject)
  console.log('liffInfo', liffInfo)

  return (
    <div className={styles.container}>
      <Button color="primary" onClick={() => router.back()}>
        <FormattedMessage defaultMessage={'返回'} />
      </Button>
      <p>
        <FormattedMessage defaultMessage={'测试'} />
      </p>
      <p>
        {intl.formatMessage(
          {
            defaultMessage: '替换模板测试,名字{name}',
          },
          { name: '张三' },
        )}
      </p>
    </div>
  )
}

export default Test
