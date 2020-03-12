import React from 'react'
import { RadFormContext } from '../RadForm'

export function Debugger(props: JSX.IntrinsicElements['pre']) {
  const context = React.useContext(RadFormContext)

  return <pre {...props}>{JSON.stringify(context.toJSON(), null, 3)}</pre>
}
