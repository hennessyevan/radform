import * as React from 'react'
import * as ReactDOM from 'react-dom'
import { useFormBuilder, Fields } from '../.'
import './styles.css'

const App = () => {
  const builder = useFormBuilder({
    initialFields: [
      {
        tagName: 'text',
        properties: {
          label: 'Text Field',
        },
      },
    ],
  })

  return (
    <div>
      <button onClick={() => builder.add('button', null, 'Button')}>Add Button</button>
      <div className="fields">
        <Fields {...builder} />
      </div>
      <pre>{builder.toJSON(true)}</pre>
    </div>
  )
}

ReactDOM.render(<App />, document.getElementById('root'))
