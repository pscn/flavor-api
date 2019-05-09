// based on https://itnext.io/how-to-share-a-single-database-connection-in-a-node-js-express-js-app-fcad4cbcb1e

import assert from 'assert';
import configs from './config';
import loggers from './logging';

import { MongoClient } from 'mongodb';

const log = loggers('db');

let mongodb;

const { database } = configs;

log.info('URL: ' + database.url);

export function initDb(callback) {
  if (mongodb) {
    log.info('Already initialized');
    return callback(null, mongodb);
  }

  function connected(err, db) {
    if (err) {
      return callback(err);
    }
    log.info('DB initialized - connected to: ' + database.host);
    mongodb = db;
    return callback(null, mongodb);
  }

  MongoClient.connect(
    'mongodb://' +
      database.user +
      ':' +
      database.password +
      '@' +
      database.host +
      ':' +
      database.port +
      '/' +
      database.database,
    { poolSize: 1, useNewUrlParser: true },
    connected
  );
}

export function getDb() {
  assert.ok(mongodb, 'Db has not been initialized. Please call initDB first.');
  return mongodb.db('gusta');
}

export function getCollection(name) {
  return getDb().collection(name);
}
