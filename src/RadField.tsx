import { ReactElement, useContext, useEffect } from 'react'
import { RadFieldEntry, RadFormContext } from './RadForm'

export type RadFieldProps = {
  component?: string
  name: string
  preview?: RadFieldEntry['preview']
  picker?: RadFieldEntry['picker']
  children: ReactElement
}

export function RadField({ children, preview, name }: RadFieldProps) {
  const context = useContext(RadFormContext)

  useEffect(() => {
    context.register({
      name,
      component: name,
      preview,
      children,
    })
  }, [])

  return null
}
