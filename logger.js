// a function to log error messages so that we avoid using console.log directly and get too many eslint errors
export function logError(message) {
  // eslint-disable-next-line no-console
  console.error(message)
}
