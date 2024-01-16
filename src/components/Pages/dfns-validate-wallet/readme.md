# dfns-create-account



<!-- Auto Generated Below -->


## Events

| Event           | Description | Type                                                                                                                                                                                                                                                               |
| --------------- | ----------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `walletCreated` |             | `CustomEvent<{ id: string; network: BlockchainNetwork; status: WalletStatus; signingKey: SigningKey; address?: string; name?: string; externalId?: string; tags: string[]; dateCreated: string; dateExported?: string; imported?: boolean; exported?: boolean; }>` |


## Dependencies

### Used by

 - [dfns-main](../dfns-main)

### Depends on

- [dfns-layout](../../Materials/Templates/dfns-layout)
- [dfns-typography](../../Elements/Typography/dfns-typography)
- [dfns-stepper](../../Elements/Stepper/dfns-stepper)
- [dfns-button](../../Elements/Buttons/dfns-button)

### Graph
```mermaid
graph TD;
  dfns-validate-wallet --> dfns-layout
  dfns-validate-wallet --> dfns-typography
  dfns-validate-wallet --> dfns-stepper
  dfns-validate-wallet --> dfns-button
  dfns-layout --> dfns-typography
  dfns-button --> dfns-typography
  dfns-button --> dfns-loader
  dfns-main --> dfns-validate-wallet
  style dfns-validate-wallet fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
