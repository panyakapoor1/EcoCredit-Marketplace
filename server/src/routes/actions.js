const router = require('express').Router();
const auth = require('../middleware/auth');
const ctrl = require('../controllers/actions');
const { planLimits } = require('../middleware/planLimits');
const validate = require('../middleware/validate');
const { z } = require('zod');

const createSchema = z.object({
  type: z.string().min(1),
  description: z.string().min(1).max(2000),
  location: z.string().min(1),
  date: z.string().min(1),
  co2Estimate: z.number().positive(),
  imageUrl: z.string().optional(),
  hasGeotag: z.boolean().optional(),
});

router.get('/', auth, ctrl.list);
router.get('/:id', auth, ctrl.getOne);
router.post('/', auth, planLimits('actions'), validate(createSchema), ctrl.create);
router.patch('/:id/blockchain', auth, ctrl.updateBlockchain);

module.exports = router;
