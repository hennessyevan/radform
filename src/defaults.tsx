import React from 'react'
import { FieldComponentProps } from './Builder'

export function DefaultTextInput(field: FieldComponentProps<'text'>) {
  return (
    <div className="card">
      <input
        type="text"
        defaultValue={field.properties.label}
        onChange={e => field.setPropertyValue(field._id, 'label', e.currentTarget.value)}
      />
      <input type="text" defaultValue="Text" disabled />
    </div>
  )
}

export function DefaultButton(field: FieldComponentProps<'button'>) {
  return field.properties?.label ? (
    <>
      <label htmlFor={field._id}>{field.properties.label}</label>
      <button
        id={field._id}
        type="button"
        disabled
        {...field.properties}
        children={field.children}
      />
    </>
  ) : (
    <button id={field._id} type="button" disabled {...field.properties} children={field.children} />
  )
}

export function DefaultCheckbox(field: FieldComponentProps<'checkbox'>) {
  return field.properties?.label ? (
    <>
      <label htmlFor={field._id}>{field.properties.label}</label>
      <input id={field._id} type="checkbox" disabled {...field.properties} />
    </>
  ) : (
    <input id={field._id} type="checkbox" disabled {...field.properties} />
  )
}
