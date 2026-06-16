const router = require('express').Router();
const auth = require('../middleware/auth');
const ctrl = require('../controllers/users');
const validate = require('../middleware/validate');
const { z } = require('zod');

const walletSchema = z.object({
  walletAddress: z.string().regex(/^0x[a-fA-F0-9]{40}$/, 'Invalid Ethereum address'),
});

router.get('/dashboard', auth, ctrl.dashboard);
router.patch('/wallet', auth, validate(walletSchema), ctrl.updateWallet);

module.exports = router;
