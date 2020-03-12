import React from 'react'
import { ReactSortable, ReactSortableProps } from 'react-sortablejs'
import { DefaultPickerElement } from './defaults'
import { RadFormContext } from './RadForm'

export function FieldPicker(props: Partial<ReactSortableProps<any>>) {
  const context = React.useContext(RadFormContext)

  const fields = Object.entries(context.fieldMap).map(([name, field]) => ({
    component: name,
    ...field,
  }))

  return (
    <ReactSortable
      sort={false}
      list={fields}
      setList={() => {}}
      clone={() => {}}
      group={{ name: 'radform', pull: 'clone', put: false }}
      {...props}
    >
      {fields.map(field => {
        // Use the passed picker component if there is one
        if (field.picker) {
          // Pass some utilities for the picker component if it wants them
          if (typeof field.picker === 'function') {
            return React.cloneElement(
              field.picker({
                name: field.component,
                append: () => context.append(name),
                component: field.tagName,
                properties: field.properties,
              }),
              { key: field.component },
            )
          }

          // Render the picker if it's valid
          if (React.isValidElement(field.picker)) {
            return React.cloneElement(field.picker, {
              key: field.component,
              preview: field.preview,
            })
          }
        }

        return <DefaultPickerElement key={name} component={name} context={context} {...field} />
      })}
    </ReactSortable>
  )
}
