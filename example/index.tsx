import * as React from 'react'
import * as ReactDOM from 'react-dom'
import { RadField, RadForm, Debugger, Preview, FieldPicker } from '../.'
import './styles.css'

const TextInput = () => (
  <RadField
    name="text"
    preview={({ name, setPropertyValue, properties, remove }) => (
      <div className="card">
        <button onClick={remove}>Remove</button>
        <input
          placeholder="Put a question in here"
          onChange={e => setPropertyValue('title', e.currentTarget.value)}
          value={properties.title}
        />
        <input value={name} disabled />
      </div>
    )}
  >
    <input type="text" title="something" />
  </RadField>
)

const ButtonInput = () => (
  <RadField
    name="button"
    preview={({ name, setPropertyValue, properties, remove }) => (
      <div className="card">
        <button onClick={remove}>Remove</button>
        <input
          placeholder="Put a question in here"
          onChange={e => setPropertyValue('title', e.currentTarget.value)}
          value={properties.title}
        />
        <button children={name} disabled />
      </div>
    )}
  >
    <button type="button" />
  </RadField>
)

const App = () => {
  return (
    <div>
      <RadForm
        initialFields={[
          {
            properties: {
              type: 'text',
              title: 'cool',
            },
            component: 'text',
            tagName: 'input',
            _id: '843e21b4-44a3-462b-9e2b-144097a23bef',
          },
        ]}
      >
        <TextInput />
        <ButtonInput />
        <div className="editor">
          <Preview className="fields" />
          <FieldPicker />
        </div>
        <Debugger />
      </RadForm>
    </div>
  )
}

ReactDOM.render(<App />, document.getElementById('root'))
