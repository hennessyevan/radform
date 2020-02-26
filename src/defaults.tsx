import React from 'react'
import { FieldComponentProps } from './Builder'

export function DefaultTextInput(field: FieldComponentProps<'text'>) {
  return (
    <div
      {...field.properties}
      className={`card${field.isActive ? ' active' : ''}`}
      onClick={() => field.setActive(true)}
      onBlur={() => field.setActive(false)}
    >
      <button onClick={() => field.remove(field._id)}>Remove</button>
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
    <div className="card">
      <button onClick={() => field.remove(field._id)}>Remove</button>
      <button
        id={field._id}
        type="button"
        disabled
        {...field.properties}
        children={field.children}
      />
    </div>
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
