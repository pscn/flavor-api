import { Router } from 'express';
import { check, validationResult } from 'express-validator/check';

import loggers from '../logging';
import { getCollection } from '../db';
import { uuid } from '../uuid';

const router = Router();
const log = loggers('flavor');

router.post(
  '/',
  [check('name').isString(), check('vendor_uuid').isString()],
  async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    log.info(`create ${req.body.name} (${req.body.vendor_uuid})`);

    try {
      const vendors = getCollection('vendor');
      const vendor = await vendors.findOne({ uuid: req.body.vendor_uuid });

      if (!vendor) {
        res.status(500).json({ errors: 'Vendor not found' });
        return;
      }

      const flavors = getCollection('flavor');
      const flavor = {
        uuid: uuid('falvor' + req.body.name + req.body.vendor_uuid),
        name: req.body.name,
        vendor: { uuid: req.body.vendor_uuid }
      };

      if (req.body.gravity) {
        flavor.gravity = req.body.gravity;
      }

      await flavors.insertOne(flavor);
      // eslint-disable-next-line no-underscore-dangle
      delete flavor._id; // hide mongo id
      res.status(200).json(flavor);
    } catch (error) {
      log.error(error.message);
      res.status(500).json({ errors: error.message });
    }
  }
);

router.get('/:uuid', [check('uuid').isString()], async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  log.info(`request for ${req.params.uuid}`);

  try {
    const flavors = getCollection('flavor');
    const flavor = await flavors.findOne({ uuid: req.params.uuid });

    if (flavor) {
      const vendors = getCollection('vendor');

      flavor.vendor = await vendors.findOne({ uuid: flavor.vendor.uuid });
      if (flavor.vendor) {
        // eslint-disable-next-line no-underscore-dangle
        delete flavor._id; // remove mongo id
        // eslint-disable-next-line no-underscore-dangle
        delete flavor.vendor._id; // remove mongo id
        res.status(200).json(flavor);
      } else {
        res.status(200).json({ errors: 'Vendor not found' });
      }
    } else {
      res.status(200).json({ errors: 'Flavor not found' });
    }
  } catch (error) {
    log.error(error.message);
    res.status(500).json({ error: error.message });
  }
});

export default router;
