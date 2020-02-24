import React from 'react'
import { IdentifiableFormElement } from './Builder'

export function DefaultTextInput(field: IdentifiableFormElement<'text'>) {
  return field.properties?.label ? (
    <>
      <label htmlFor={field._id}>{field.properties.label}</label>
      <input id={field._id} type="text" disabled {...field.properties} />
    </>
  ) : (
    <input id={field._id} type="text" disabled {...field.properties} />
  )
}

export function DefaultButton(field: IdentifiableFormElement<'button'>) {
  return field.properties?.label ? (
    <>
      <label htmlFor={field._id}>{field.properties.label}</label>
      <button id={field._id} type="button" disabled {...field.properties} />
    </>
  ) : (
    <button id={field._id} type="button" disabled {...field.properties} />
  )
}

export function DefaultCheckbox(field: IdentifiableFormElement<'checkbox'>) {
  return field.properties?.label ? (
    <>
      <label htmlFor={field._id}>{field.properties.label}</label>
      <input id={field._id} type="checkbox" disabled {...field.properties} />
    </>
  ) : (
    <input id={field._id} type="checkbox" disabled {...field.properties} />
  )
}
