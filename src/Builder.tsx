import produce from 'immer'
import React, { ComponentProps, ReactNode, useEffect, useState } from 'react'
import { v4 } from 'uuid'
import { DefaultButton, DefaultCheckbox, DefaultTextInput } from './defaults'

type TagName = 'text' | 'checkbox' | 'button' | 'form'

type FormElementProps<T extends keyof JSX.IntrinsicElements> = ComponentProps<T> & {
  label?: string
}

type TagProperties<T extends TagName> = T extends 'text'
  ? FormElementProps<'input'>
  : T extends 'checkbox'
  ? FormElementProps<'input'>
  : T extends 'button'
  ? FormElementProps<'button'>
  : T extends 'form'
  ? FormElementProps<'form'>
  : FormElementProps<any>

type TagChildren<T extends TagName> = T extends 'text'
  ? never
  : T extends 'checkbox'
  ? never
  : T extends 'button'
  ? FormElement[] | ReactNode
  : T extends 'form'
  ? FormElement[] | ReactNode
  : FormElement[] | ReactNode

// Follows the unist hast spec
export type FormElement<T extends TagName = any> = {
  tagName: T
  type?: 'root' | 'element'
  properties: TagProperties<T> | null
  children?: TagChildren<T> | null
}

// We attach an _id for internal management of each FormElement
export type IdentifiableFormElement<T extends TagName = any> = FormElement<T> & {
  readonly _id: string
  properties: TagProperties<T>
  children?: TagChildren<T>
}

export type FieldUtilities = {
  setPropertyValue: (_id: string, property: string, value: any) => void
}

export type FieldComponentProps<T extends TagName> = FieldUtilities & IdentifiableFormElement<T>

export type FormBuilderParams = {
  initialFields?: FormElement[]
}

export function useFormBuilder({ initialFields = [] }: FormBuilderParams = {}) {
  const [fields, setFields] = useState<IdentifiableFormElement<TagName>[]>([])

  useEffect(() => {
    initialFields.forEach(field => add(field.tagName, field.properties, field.children))
  }, [])

  /**
   * Just a utility for now, will be used for some yup ast transformations later on
   */
  function toJSON(pretty?: boolean) {
    return JSON.stringify(fields, null, pretty ? 3 : undefined)
  }

  function setPropertyValue(_id: string, property: string, value: any) {
    const newFields = produce(fields, draft => {
      //@ts-ignore
      draft.find(field => field._id === _id).properties[property] = value
    })

    setFields(newFields)
  }

  /**
   * We always add an _id for referencing later on
   */
  function add<T extends TagName>(
    tagName: T,
    properties?: FormElement<T>['properties'],
    children?: FormElement<T>['children'],
  ) {
    const _id = v4()
    setFields(
      fields.concat([
        {
          tagName,
          properties: properties || {},
          children: children || [],
          _id,
          type: 'element',
        },
      ]),
    )
  }

  const utilities = {
    setPropertyValue,
  }

  return {
    add,
    toJSON,
    fields,
    ...utilities,
  }
}

export function Fields({
  fields,
  setPropertyValue,
  elements: {
    text: TextInput = DefaultTextInput,
    button: Button = DefaultButton,
    checkbox: Checkbox = DefaultCheckbox,
  } = {},
}: {
  fields: IdentifiableFormElement<any>[]
  setPropertyValue: (_id: string, property: string, value: any) => void
  elements?: {
    [K in TagName]?: (field: FieldComponentProps<K>) => JSX.Element
  }
}) {
  const innerFields = fields.map(field => {
    switch (field.tagName) {
      case 'text':
        return (
          <TextInput
            key={field._id}
            {...(field as IdentifiableFormElement<'text'>)}
            setPropertyValue={setPropertyValue}
          />
        )
      case 'button':
        return (
          <Button
            key={field._id}
            {...(field as IdentifiableFormElement<'button'>)}
            setPropertyValue={setPropertyValue}
          />
        )
      case 'checkbox':
        return (
          <Checkbox
            key={field._id}
            {...(field as IdentifiableFormElement<'checkbox'>)}
            setPropertyValue={setPropertyValue}
          />
        )
      default:
        return null
    }
  })

  return <>{innerFields}</>
}
