<div align="center">
<h1>Rad Form (name is WIP)</h1>

<img
    height="80"
    width="80"
    alt="radio"
    src="https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/240/apple/237/radio_1f4fb.png"
  />

  </div>

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

Start with a basic structure

```tsx
import { RadForm } from 'radform'

function MyFormBuilderComponent() {
  return (
    <RadForm>
      {/* This field will be registered as "text-input" */}
      <RadField name="text-input">
        {/* Component to be used in the renderered form */}
        <input type="text" />
      </RadField>
      <RadField name="text-input">
        <button type="button" />
      </RadField>
    </RadForm>
  )
}
```

## RadForm

This component collects all of the RadField configurations and injects the RadForm context.

#### PropTable

```ts
type RadForm = {
  initialFields?: string[]
  children: (utilities) => ReactNode | ReactNode
}
```

```ts
// Each RadField represents a form element to be used in the builder
type RadField = {
  name: string
  preview?: (bag: RadFieldBag) => ReactNode | ReactNode
  children: ReactElement
}
```

```ts
// Used for rendering the Field Previews
type Preview = ReactNode
```

```ts
// Pretty prints the JSON output
type Debugger = ReactNode
```
