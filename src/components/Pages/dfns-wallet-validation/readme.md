# dfns-create-account



<!-- Auto Generated Below -->


## Properties

| Property             | Attribute              | Description | Type     | Default                                                                         |
| -------------------- | ---------------------- | ----------- | -------- | ------------------------------------------------------------------------------- |
| `confirmationImgSrc` | `confirmation-img-src` |             | `string` | `"https://storage.googleapis.com/dfns-frame-stg/assets/icons/confirmation.svg"` |


## Events

| Event             | Description | Type                                                                                                                                                                                                                                                               |
| ----------------- | ----------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `walletValidated` |             | `CustomEvent<{ id: string; network: BlockchainNetwork; status: WalletStatus; signingKey: SigningKey; address?: string; name?: string; externalId?: string; tags: string[]; dateCreated: string; dateExported?: string; imported?: boolean; exported?: boolean; }>` |


## Dependencies

### Used by

 - [dfns-main](../dfns-main)

### Depends on

- [dfns-layout](../../Materials/Templates/dfns-layout)
- [dfns-typography](../../Elements/Typography/dfns-typography)
- [dfns-loader](../../Elements/LoaderDfns/dfns-loader)
- [dfns-button](../../Elements/Buttons/dfns-button)

### Graph
```mermaid
graph TD;
  dfns-wallet-validation --> dfns-layout
  dfns-wallet-validation --> dfns-typography
  dfns-wallet-validation --> dfns-loader
  dfns-wallet-validation --> dfns-button
  dfns-layout --> dfns-typography
  dfns-button --> dfns-typography
  dfns-button --> dfns-loader
  dfns-main --> dfns-wallet-validation
  style dfns-wallet-validation fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
