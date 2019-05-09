const uuidv3 = require('uuid/v3');
const NAMESPACE = '7311c711-03bd-4ad7-b639-976d2e849edb';

export function uuid(collection) {
  return uuidv3(collection, NAMESPACE);
}
