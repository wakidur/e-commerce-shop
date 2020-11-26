/**
 * Global message Object
 * Read-only properties are not super common,
 * but they can be created using Object.defineProperty() or Object.freeze()
 */
module.exports = Object.freeze({
  // Common Message
  RequestBodyIsEmpty: 'Request body is empty!',
  DATAFETCH: 'Data fetching successful!',
  CREATESUCCESSFUL: 'Create successful!',
  PARTICULARDATAFATCH: 'Particular data fatch successful!',
  UPDATE_PARTICULAR_DOCUMENT: 'Particular document update successful!',
  DELETE_PARTICULAR_DOCUMENT: 'Particular document delete successful!',
});
