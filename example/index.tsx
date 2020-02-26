import React from 'react'
import ReactDOM from 'react-dom'
import { RadField, RadForm, Debugger, Preview } from '../.'
import './styles.css'

const TextInput = () => (
  <RadField
    name="text"
    preview={({ name, setPropertyValue, properties }) => (
      <div style={{ display: 'inline-flex', flexDirection: 'column' }}>
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

const App = () => {
  return (
    <div>
      <RadForm initialFields={['text']}>
        <TextInput />
        <Preview />
        <Debugger />
      </RadForm>
    </div>
  )
}

ReactDOM.render(<App />, document.getElementById('root'))
