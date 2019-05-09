// init script read by the mongodb container on startup to create our database
// incl. user & password
// linked into the container in docker-compose.yml

// eslint-disable-next-line no-undef
var s = db.getSiblingDB('gusta');

// eslint-disable-next-line no-undef
s.createUser({
  user: 'gusta',
  pwd: 'changeme',
  roles: [{ role: 'readWrite', db: 'gusta' }]
});

// we could create collections and populate data here
// db.vendor.insert({name:"Dummy"});
