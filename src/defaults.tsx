import React from 'react'
import { RadFieldEntry, RadFormContext } from './RadForm'

export function DefaultPickerElement(
  props: RadFieldEntry & { component: string } & { context: RadFormContext },
) {
  return (
    <div className="picker-element" {...props.properties}>
      {props.component}
    </div>
  )
}
