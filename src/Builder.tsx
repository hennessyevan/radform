import React, { ComponentProps, ReactNode, useState } from 'react'
import { v4 } from 'uuid'
import { DefaultButton, DefaultTextInput, DefaultCheckbox } from './defaults'

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

// Follows the unist hast spec
export type FormElement<T extends TagName = any> = {
  tagName: T
  type?: 'root' | 'element'
  properties?: TagProperties<T>
  children?: FormElement[] | ReactNode
}

// We attach an _id for internal management of each FormElement
export type IdentifiableFormElement<T extends TagName> = FormElement<T> & { readonly _id: string }

export type UniformBuilderParams = {
  elements?: {
    [K in TagName]?: (field: IdentifiableFormElement<K>) => JSX.Element
  }
}

export function useFormBuilder({
  elements: {
    text: TextInput = DefaultTextInput,
    button: Button = DefaultButton,
    checkbox: Checkbox = DefaultCheckbox,
  } = {},
}: UniformBuilderParams = {}): [
  () => JSX.Element | null,
  {
    add: <T extends TagName>(
      tagName: T,
      properties?: FormElement<T>['properties'],
      children?: FormElement<T>['children'],
    ) => void
    fields: IdentifiableFormElement<any>[]
    toJSON: (pretty?: boolean) => string
  },
] {
  const [fields, setFields] = useState<IdentifiableFormElement<any>[]>([])

  /**
   * Just a utility for now, will be used for some yup ast transformations later on
   */
  function toJSON(pretty?: boolean) {
    return JSON.stringify(fields, null, pretty ? 3 : undefined)
  }

  /**
   * We always add an _id for referencing later on
   */
  function add<T extends TagName>(
    tagName: T,
    properties: FormElement<T>['properties'] = {} as FormElement['properties'],
    children: FormElement<T>['children'] = [],
  ) {
    // Stay immutable here
    setFields(fields.concat([{ children, properties, tagName, _id: v4() }]))
  }

  /**
 * Add custom components in the elements object.
 * Each element receives the the full FormElement object.
 * 
 * 
 * ```ts
 const builder = useUniformBuilder({
   elements: {
    text: <CustomTextComponent />,
    button: <CustomButtonComponent />,
    ...
   }
  })
 * ```
 */
  function Fields() {
    function renderField(field: IdentifiableFormElement<any>) {
      switch (field.tagName) {
        case 'text':
          return <TextInput key={field._id} {...(field as IdentifiableFormElement<'text'>)} />
        case 'button':
          return <Button key={field._id} {...(field as IdentifiableFormElement<'button'>)} />
        case 'checkbox':
          return <Checkbox key={field._id} {...(field as IdentifiableFormElement<'checkbox'>)} />
        default:
          return null
      }
    }

    return <>{fields.map(renderField)}</>
  }

  return [Fields, { toJSON, fields, add }]
}
