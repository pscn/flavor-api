// eslint-disable-next-line no-undef
var c = db.getSiblingDB('gusta').getCollection('vendor');

// eslint-disable-next-line no-undef
c.createIndex({ name: 1 }, { unique: true });
c.createIndex({ abbr: 1 }, { unique: true });
c.createIndex({ uuid: 1 });
