# dfns-create-account



<!-- Auto Generated Below -->


## Properties

| Property                  | Attribute                  | Description | Type                             | Default     |
| ------------------------- | -------------------------- | ----------- | -------------------------------- | ----------- |
| `apiUrl`                  | `api-url`                  |             | `string`                         | `undefined` |
| `appId`                   | `app-id`                   |             | `string`                         | `undefined` |
| `authenticatorAttachment` | `authenticator-attachment` |             | `"cross-platform" \| "platform"` | `undefined` |
| `oauthAccessToken`        | `oauth-access-token`       |             | `string`                         | `undefined` |
| `visible`                 | `visible`                  |             | `string`                         | `undefined` |


## Events

| Event            | Description | Type                                    |
| ---------------- | ----------- | --------------------------------------- |
| `passkeyCreated` |             | `CustomEvent<RegisterCompleteResponse>` |


## Dependencies

### Depends on

- [dfns-layout](../../ Materials/Templates/dfns-layout)
- [dfns-typography](../../Elements/Typography/dfns-typography)
- [dfns-stepper](../../Elements/Stepper/dfns-stepper)
- [dfns-button](../../Elements/Buttons/dfns-button)

### Graph
```mermaid
graph TD;
  dfns-create-account --> dfns-layout
  dfns-create-account --> dfns-typography
  dfns-create-account --> dfns-stepper
  dfns-create-account --> dfns-button
  dfns-button --> dfns-typography
  dfns-button --> dfns-loader
  style dfns-create-account fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
