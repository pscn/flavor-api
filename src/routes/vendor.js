import { Router } from 'express';
import { check, validationResult } from 'express-validator/check';

import loggers from '../logging';
import { getCollection } from '../db';
import { uuid } from '../uuid';

const router = Router();
const log = loggers('vendor');

// POST Body{name, abbr} → create vendor
// PUT /:uuid Body{name, abbr} → update vendor
// DELETE /:uuid → delete vendor
// GET /:uuid → get vendor

router.post(
  '/',
  [check('name').isString(), check('abbr').isString()],
  async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    log.info(`create ${req.body.name} (${req.body.abbr})`);

    try {
      const vendors = getCollection('vendor');
      const vendor = {
        uuid: uuid('vendor' + req.body.name + req.body.abbr),
        name: req.body.name,
        abbr: req.body.abbr
      };

      await vendors.insertOne(vendor);
      // eslint-disable-next-line no-underscore-dangle
      delete vendor._id; // hide mongo id
      res.status(200).json(vendor);
    } catch (error) {
      log.error(error.message);
      res.status(500).json({ errors: error.message });
    }
  }
);

router.put(
  '/:uuid',
  [
    check('uuid').isString(),
    check('name').isString(),
    check('abbr').isString()
  ],
  async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    log.info(`update ${req.params.uuid} ${req.body.name} (${req.body.abbr})`);

    try {
      const vendors = getCollection('vendor');
      const vendor = {
        name: req.body.name,
        abbr: req.body.abbr
      };
      const filter = {
        uuid: req.params.uuid
      };

      const result = await vendors.updateOne(filter, { $set: vendor });

      log.info(JSON.stringify(result));
      res.status(200).json({
        matched: result.matchedCount === 1,
        modified: result.modifiedCount === 1
      });
    } catch (error) {
      log.error(error.message);
      res.status(500).json({ error: error.message });
    }
  }
);

router.delete('/:uuid', [check('uuid').isString()], async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  log.info(`delete ${req.params.uuid}`);

  try {
    const vendors = getCollection('vendor');
    const filter = {
      uuid: req.params.uuid
    };

    const result = await vendors.deleteOne(filter);

    log.info(JSON.stringify(result));

    res.status(200).json({
      deleted: result.deletedCount === 1
    });
  } catch (error) {
    log.error(error.message);
    res.status(500).json({ error: error.message });
  }
});

router.get('/:uuid', [check('uuid').isString()], async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  log.info(`request for ${req.params.uuid}`);

  try {
    const vendors = getCollection('vendor');
    const vendor = await vendors.findOne({ uuid: req.params.uuid });

    if (vendor) {
      // eslint-disable-next-line no-underscore-dangle
      delete vendor._id; // remove mongo id
      res.status(200).json(vendor);
    } else {
      res.status(200).json({ errors: 'NotFound' });
    }
  } catch (error) {
    log.error(error.message);
    res.status(500).json({ error: error.message });
  }
});

export default router;
