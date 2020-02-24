import * as React from 'react'
import * as ReactDOM from 'react-dom'
import { useFormBuilder } from '../.'

const App = () => {
  const [Fields, builder] = useFormBuilder()

  return (
    <div>
      <button onClick={() => builder.add('text', { placeholder: 'Text' })}>Add Text Input</button>
      <button onClick={() => builder.add('button', { children: 'Button' })}>Add Button</button>
      <button onClick={() => builder.add('checkbox', { label: 'Checkbox' })}>Add Checkbox</button>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <Fields />
      </div>
      <pre>{builder.toJSON(true)}</pre>
    </div>
  )
}

ReactDOM.render(<App />, document.getElementById('root'))
