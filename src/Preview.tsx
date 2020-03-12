import React, { ReactElement, useContext } from 'react'
import { ReactSortable, ReactSortableProps } from 'react-sortablejs'
import { v4 } from 'uuid'
import { IdentifiableField, RadFieldEntry, RadFormContext } from './RadForm'

export function Preview(props: Partial<ReactSortableProps<any>>) {
  const context = useContext(RadFormContext)

  return (
    <ReactSortable<IdentifiableField>
      animation={125}
      group="radform"
      list={context.fields}
      setList={fields => {
        context.setFields(
          fields.map(field => {
            if (typeof field.id === 'undefined') {
              field.id = v4()
            }
            return field
          }),
        )
      }}
      {...props}
    >
      {context.fields.map(field => {
        const fieldTemplate = context.fieldMap[field.component] as RadFieldEntry

        if (fieldTemplate) {
          const { preview } = fieldTemplate

          if (preview) {
            if (typeof preview === 'function') {
              return React.cloneElement(
                preview({
                  component: field.component,
                  name: field.component,
                  remove: () => (field?.id ? context.remove(field.id) : {}),
                  setPropertyValue: (property, value) =>
                    context.setPropertyValue(field.id)(property, value),
                  properties: field.properties,
                }) as ReactElement,
                { ...field.properties, key: field.id },
              )
            }

            if (React.isValidElement(preview)) {
              return React.cloneElement(preview, {
                ...field.properties,
                key: field.id,
              })
            }
          }
        }

        return React.createElement(field.tagName, { ...field.properties, key: field.id })
      })}
    </ReactSortable>
  )
}
