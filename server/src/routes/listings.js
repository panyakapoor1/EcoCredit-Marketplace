const router = require('express').Router();
const auth = require('../middleware/auth');
const ctrl = require('../controllers/listings');
const { planLimits } = require('../middleware/planLimits');
const validate = require('../middleware/validate');
const { z } = require('zod');

const createSchema = z.object({
  title: z.string().min(1).max(200),
  type: z.string().min(1),
  description: z.string().max(2000).optional(),
  price: z.number().min(0),
  credits: z.number().int().positive(),
  co2Offset: z.number().min(0),
  location: z.string().min(1),
  imageUrl: z.string().optional(),
  actionId: z.string().optional(), // link to source action
});

// public — browse marketplace
router.get('/', ctrl.list);
router.get('/:id', ctrl.getOne);

const rbac = require('../middleware/rbac');

// protected — create/delete own listings
router.post('/', auth, rbac('seller', 'admin'), planLimits('listings'), validate(createSchema), ctrl.create);
router.delete('/:id', auth, ctrl.remove);

module.exports = router;
