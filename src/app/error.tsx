'use client'

import { ErrorBlock } from 'antd-mobile'

const Error = ({ error }: any) => {
  return <ErrorBlock fullPage description={error?.message ?? error?.stack ?? error ?? ''} />
}

export default Error
