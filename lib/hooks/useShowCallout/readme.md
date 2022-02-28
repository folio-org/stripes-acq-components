# useShowCallout

## Usage

Example of usage of callout with error and default message:
```javascript
const message = (
  <FormattedMessage
    id={`ui-finance.fund.actions.save.error.${errorCode}`}
    defaultMessage={intl.formatMessage({ id: `ui-finance.fund.actions.save.error.${ERROR_CODE_GENERIC}` })}
  />
);

showCallout({
  message,
  type: 'error',
});
```
