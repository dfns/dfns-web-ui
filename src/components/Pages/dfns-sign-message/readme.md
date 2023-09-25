# dfns-create-account



<!-- Auto Generated Below -->


## Properties

| Property  | Attribute | Description | Type     | Default     |
| --------- | --------- | ----------- | -------- | ----------- |
| `message` | `message` |             | `string` | `undefined` |


## Events

| Event           | Description | Type                  |
| --------------- | ----------- | --------------------- |
| `signedMessage` |             | `CustomEvent<string>` |


## Dependencies

### Used by

 - [dfns-main](../dfns-main)

### Depends on

- [dfns-layout](../../Materials/Templates/dfns-layout)
- [dfns-typography](../../Elements/Typography/dfns-typography)
- [dfns-button](../../Elements/Buttons/dfns-button)
- [dfns-alert](../../Elements/Alerts/dfns-alert)

### Graph
```mermaid
graph TD;
  dfns-sign-message --> dfns-layout
  dfns-sign-message --> dfns-typography
  dfns-sign-message --> dfns-button
  dfns-sign-message --> dfns-alert
  dfns-button --> dfns-typography
  dfns-button --> dfns-loader
  dfns-alert --> dfns-typography
  dfns-main --> dfns-sign-message
  style dfns-sign-message fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
