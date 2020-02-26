import React, {
  createContext,
  ReactElement,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from 'react'
import { v4 } from 'uuid'
import produce from 'immer'

type RadFormContext = {
  fieldMap: FieldMap
  fields: IdentifiableField[]
} & RadFormUtilities

export const RadFormContext = createContext<RadFormContext>({
  fields: [],
  fieldMap: {},
  register: () => {},
  remove: () => {},
  append: () => {},
  toJSON: () => [],
  setPropertyValue: () => () => {},
})

type RadFormProps = {
  initialFields?: string[]
  children: ((utilities: RadFormUtilities) => ReactNode) | ReactNode
}

type Field = {
  tagName: TagName
  type: 'root' | 'element'
  component: string
  properties: {
    [key: string]: any
  }
}

type IdentifiableField = Field & {
  _id: string
}

type RadFieldBag = {
  name: string
  properties: Field['properties']
  remove: () => void
  setPropertyValue: (property: string, value: any) => void
}

type RadFieldEntry = Omit<Field, 'component'> & {
  preview: ((utilities: RadFieldBag) => ReactNode) | ReactNode
}

type FieldMap = Record<string, RadFieldEntry>

type RadFormUtilities = {
  append: (type: string) => void
  register: (field: RadFieldProps) => void
  remove: (id: string) => void
  setPropertyValue: (_id: string) => (property: string, value: any) => void
  toJSON: () => Field[]
}

export function RadForm({ children, initialFields = [] }: RadFormProps) {
  const [formFields, setFormFields] = useState<IdentifiableField[]>([])
  const [fieldMap, setFieldMap] = useState<FieldMap>({})

  useEffect(() => {
    initialFields.forEach(initialField => {
      returnBag.append(initialField)
    })
  }, [fieldMap])

  const returnBag: RadFormContext = {
    fields: formFields,
    fieldMap,
    setPropertyValue: _id => (property, value) => {
      setFormFields(fields =>
        produce(fields, draft => {
          const field = draft.find(currField => currField._id === _id)

          if (field) {
            console.log(field.properties[property])
            field.properties[property] = value
          }
        }),
      )
    },
    remove: id => {
      setFormFields(fields =>
        fields.filter(field => ((field as unknown) as ReactElement)?.props?._id !== id),
      )
    },
    append: type => {
      const fieldTemplate = fieldMap[type]
      const _id = v4()

      if (fieldTemplate) {
        setFormFields(fields => fields.concat([{ ...fieldTemplate, component: type, _id }]))
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

      setFieldMap(fieldMap => ({
        ...fieldMap,
        [field.name]: {
          preview: field.preview,
          properties: field.children.props,
          tagName: field.children.type as TagName,
          type: 'element',
        },
      }))
    },
    toJSON: () =>
      formFields.map(formField =>
        produce(formField, draft => {
          delete draft.component
        }),
      ),
  }

  return (
    <RadFormContext.Provider value={returnBag}>
      {typeof children === 'function' ? children(returnBag) : children}
    </RadFormContext.Provider>
  )
}

type TagName = keyof JSX.IntrinsicElements

type RadFieldProps = {
  name: string
  preview?: (bag: RadFieldBag) => ReactNode | ReactNode
  children: ReactElement
}

export function RadField({ children, preview, name }: RadFieldProps) {
  const context = useContext(RadFormContext)

  useEffect(() => {
    context.register({
      name,
      preview,
      children,
    })
  }, [])

  return null
}

export function Preview() {
  const context = useContext(RadFormContext)

  return (
    <div>
      {context.fields.map(field => {
        const fieldTemplate = context.fieldMap[field.component]

        if (fieldTemplate) {
          const { preview } = fieldTemplate

          return typeof preview === 'function'
            ? React.cloneElement(
                preview({
                  name: field.component,
                  remove: () => context.remove(field._id),
                  setPropertyValue: (property, value) =>
                    context.setPropertyValue(field._id)(property, value),
                  properties: field.properties,
                }) as ReactElement,
                { ...field.properties, key: field._id },
              )
            : React.cloneElement(preview as ReactElement, { ...field.properties, key: field._id })
        }

        return React.createElement(field.tagName, { ...field.properties, key: field._id })
      })}
    </div>
  )
}

export function Debugger() {
  const context = React.useContext(RadFormContext)

  return <pre>{JSON.stringify(context.toJSON(), null, 3)}</pre>
}
