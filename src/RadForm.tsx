import produce from 'immer'
import React, { createContext, ReactNode, useEffect, useRef, useState } from 'react'
import { v4 } from 'uuid'
import { RadFieldProps } from './RadField'

export type TagName = keyof JSX.IntrinsicElements

export type RadFormContext = {
  fieldMap: FieldMap
  fields: IdentifiableField[]
  setFields: (fields: IdentifiableField[]) => void
} & RadFormUtilities

export const RadFormContext = createContext<RadFormContext>({
  fields: [],
  fieldMap: {},
  setFields: () => {},
  register: () => {},
  remove: () => {},
  append: () => {},
  create: () => null,
  toJSON: () => [],
  setPropertyValue: () => () => {},
})

export type RadFormProps = {
  initialFields?: string[] | Partial<IdentifiableField>[]
  children: ((utilities: RadFormUtilities) => ReactNode) | ReactNode
}

export type Field = {
  tagName: TagName | (string & {})
  type: 'root' | 'element'
  component: string
  properties: {
    [key: string]: any
  }
}

export type IdentifiableField = Field & {
  id: string
}

export type RadPreviewUtilities = {
  name: string
  component: string
  properties: Field['properties']
  remove: () => void
  setPropertyValue: (property: string, value: any) => void
}

export type RadPickerUtilities = {
  name: string
  properties: Field['properties']
  component: string
  append: () => void
}

export type RadFieldEntry = Omit<Field, 'component'> & {
  preview: ((utilities: RadPreviewUtilities) => ReactNode) | ReactNode
  picker: ((utilities: RadPickerUtilities) => ReactNode) | ReactNode
}

type FieldMap = Record<string, RadFieldEntry>

export type RadFormUtilities = {
  append: (type: string) => void
  register: (field: RadFieldProps) => void
  remove: (id: string) => void
  create: (type: string) => IdentifiableField | null
  setPropertyValue: (_id: string) => (property: string, value: any) => void
  toJSON: () => Field[]
}

// const JSONKeys: Array<keyof IdentifiableField> = ['properties', 'tagName', 'type', 'id']

export function RadForm({ children, initialFields = [] }: RadFormProps) {
  const [formFields, setFormFields] = useState<IdentifiableField[]>([])
  const [fieldMap, setFieldMap] = useState<FieldMap>({})
  const initialized = useRef(false)

  useEffect(() => {
    if (!initialized.current) {
      initialized.current = true
      initialFields.forEach((initialField: string | Partial<IdentifiableField>) => {
        // If initialField is a string initialize it with a RadFieldEntry
        if (typeof initialField === 'string') {
          returnBag.append(initialField)
        } else if (typeof initialField === 'object') {
          // If the initial field is an object and adheres to a Field type set it directly
          const ownKeys = Object.getOwnPropertyNames(initialField)

          // It must at least have a tagName
          if (ownKeys.includes('tagName')) {
            // Check if it has an _id otherwise create one
            let _id: string
            if (!ownKeys.includes('id')) {
              _id = v4()
            }

            // We're good! Append the fields directly
            setFormFields(fields =>
              fields.concat([
                {
                  properties: {},
                  id: _id,
                  type: 'element',
                  ...(initialField as IdentifiableField),
                },
              ]),
            )
          } else if (__DEV__) {
            console.warn('Initial fields must have a tagName')
          }
        }
      })
    }
  }, [fieldMap])

  const returnBag: RadFormContext = {
    fields: formFields,
    setFields: setFormFields,
    fieldMap,
    setPropertyValue: _id => (property, value) => {
      setFormFields(fields =>
        produce(fields, draft => {
          const field = draft.find(currField => currField.id === _id)

          if (field) {
            field.properties[property] = value
          }
        }),
      )
    },
    remove: id => {
      setFormFields(fields => fields.filter(field => field.id !== id))
    },
    create: type => {
      const fieldTemplate = fieldMap[type]
      const id = v4()
      if (fieldTemplate) {
        return { ...fieldTemplate, component: type, id }
      }
      return null
    },
    append: type => {
      const field = returnBag.create(type)

      if (field) {
        setFormFields(fields => fields.concat([field]))
      }
    },
    register: field => {
      if (!field.name) {
        if (__DEV__) {
          return new Error('You must set at least set a name to register a RadField')
        }

        return console.warn('Radfield requires a name')
      }

      if (fieldMap[field.name]) {
        throw new Error(
          'A field with this name has already been registered. Choose another name or remove any duplicates from the RadForm tree',
        )
      }

      if (React.Children.count(field.children) !== 1) {
        if (Array.isArray(field.children)) {
          field.children = field.children[0]
        }

        console.warn('RadField strictly requires 1 child')
      }

      const tagName =
        typeof field.children.type === 'function' ? field.children.type.name : field.children.type

      setFieldMap(fieldMap => ({
        ...fieldMap,
        [field.name]: {
          preview: field.preview,
          picker: field.picker,
          properties: field.children.props,
          tagName,
          type: 'element',
        },
      }))
    },
    toJSON: () => formFields,
    // formFields.map(formField =>
    //   produce(formField, draft => {
    //     for (const key of Object.keys(draft)) {
    //       if (!JSONKeys.includes(key as typeof JSONKeys[number])) {
    //         delete draft[key as typeof JSONKeys[number]]
    //       }
    //     }
    //   }),
    // ),
  }

  return (
    <RadFormContext.Provider value={returnBag}>
      {typeof children === 'function' ? children(returnBag) : children}
    </RadFormContext.Provider>
  )
}
