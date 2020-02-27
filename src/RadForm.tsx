import produce from 'immer'
import React, {
  createContext,
  ReactElement,
  ReactNode,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react'
import { ReactSortable } from 'react-sortablejs'
import { v4 } from 'uuid'

type RadFormContext = {
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
  toJSON: () => [],
  setPropertyValue: () => () => {},
})

type RadFormProps = {
  initialFields?: string[] | Partial<IdentifiableField>[]
  children: ((utilities: RadFormUtilities) => ReactNode) | ReactNode
}

type Field = {
  tagName: TagName | (string & {})
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
            if (!ownKeys.includes('_id')) {
              _id = v4()
            }

            // We're good! Append the fields directly
            setFormFields(fields =>
              fields.concat([
                { properties: {}, _id, type: 'element', ...(initialField as IdentifiableField) },
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
          const field = draft.find(currField => currField._id === _id)

          if (field) {
            field.properties[property] = value
          }
        }),
      )
    },
    remove: id => {
      setFormFields(fields => fields.filter(field => field._id !== id))
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

      const tagName =
        typeof field.children.type === 'function' ? field.children.type.name : field.children.type

      setFieldMap(fieldMap => ({
        ...fieldMap,
        [field.name]: {
          preview: field.preview,
          properties: field.children.props,
          tagName,
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

export function Preview(props: JSX.IntrinsicElements['div']) {
  const context = useContext(RadFormContext)

  return (
    <div {...props}>
      <ReactSortable
        list={context.fields.map(field => ({ ...field, id: field._id }))}
        setList={context.setFields}
      >
        {context.fields.map(field => {
          const fieldTemplate = context.fieldMap[field.component] as RadFieldEntry

          if (fieldTemplate) {
            const { preview } = fieldTemplate

            if (preview) {
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
                : React.cloneElement(preview as ReactElement, {
                    ...field.properties,
                    key: field._id,
                  })
            }
          }

          return React.createElement(field.tagName, { ...field.properties, key: field._id })
        })}
      </ReactSortable>
    </div>
  )
}

export function Debugger() {
  const context = React.useContext(RadFormContext)

  return <pre>{JSON.stringify(context.toJSON(), null, 3)}</pre>
}

export function FieldPicker() {
  const context = React.useContext(RadFormContext)

  const fields = Object.entries(context.fieldMap)

  return (
    <div>
      {fields.map(([name, field]) => (
        <DefaultPickerElement
          onClick={() => context.append(name)}
          key={name}
          {...field}
          name={name}
        />
      ))}
    </div>
  )
}

function DefaultPickerElement(
  props: RadFieldEntry & { name: string } & JSX.IntrinsicElements['div'],
) {
  return (
    <div {...props}>
      <span>{props.properties.title ?? props.name}</span>
    </div>
  )
}
