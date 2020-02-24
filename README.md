# Rad Form (name is WIP)

<div style="text-align: center;width: 100%;font-size: 128px">📻</div>

<hr>

### Disclaimer

This package is still heavilty under development, many of the features have not been written yet and the API and scope may change at any time

<hr>

This package provides a BYOS (Bring your own styling) approach to drag-and-drop form building in React. It follows the [unist](https://github.com/syntax-tree/unist) spec for its hast schema allowing for many of those plugins to work with it.

## Get Started

Install radform

```bash
npm i radform
// or
yarn add radform
```

Import radform into your code

```ts
import { useFormBuilder } from 'radform'

function MyFormBuilderComponent() {
  const [Builder, actions] = useFormBuilder()

  return (
    <div>
      <Builder />
      {/* View JSON output */}
      <pre>{actions.toJSON()}</pre>
    </div>
  )
}
```

Adding a form element manually

```ts
import { useFormBuilder } from 'radform'

function MyFormBuilderComponent() {
  const [Builder, actions] = useFormBuilder()

  return (
    <div>
      <button onClick={() => actions.add('text')}>Add a text input!</button>
      <Builder />
    </div>
  )
}
```
