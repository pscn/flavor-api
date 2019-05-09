// eslint-disable-next-line no-undef
var c = db.getSiblingDB('gusta').getCollection('flavor');

// eslint-disable-next-line no-undef
c.createIndex({ name: 1, 'vendor.uuid': 1 }, { unique: true });
c.createIndex({ uuid: 1 });
