const PLAN_LIMITS = {
  free: { actionsPerMonth: 5, listingsPerMonth: 3, aiVerifications: 5 },
  pro: { actionsPerMonth: 50, listingsPerMonth: 30, aiVerifications: 50 },
  enterprise: { actionsPerMonth: -1, listingsPerMonth: -1, aiVerifications: -1 }, // -1 = unlimited
};

// checks if user has exceeded their plan's limit for a given resource
function planLimits(resource) {
  return async (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    const User = require('../models/User');
    const user = await User.findById(req.user.userId).select('plan usage');
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // reset monthly counter if it's a new month
    const now = new Date();
    const lastReset = new Date(user.usage.lastResetAt);
    if (now.getMonth() !== lastReset.getMonth() || now.getFullYear() !== lastReset.getFullYear()) {
      user.usage.actionsThisMonth = 0;
      user.usage.listingsThisMonth = 0;
      user.usage.lastResetAt = now;
      await user.save();
    }

    const limits = PLAN_LIMITS[user.plan] || PLAN_LIMITS.free;
    const limitKey = resource === 'actions' ? 'actionsPerMonth' : 'listingsPerMonth';
    const usageKey = resource === 'actions' ? 'actionsThisMonth' : 'listingsThisMonth';
    const limit = limits[limitKey];

    // -1 means unlimited
    if (limit !== -1 && user.usage[usageKey] >= limit) {
      return res.status(429).json({
        error: `${user.plan} plan limit reached`,
        limit,
        used: user.usage[usageKey],
        upgrade: 'Upgrade your plan for higher limits',
      });
    }

    req.planUser = user; // pass along so controller can increment usage
    next();
  };
}

module.exports = { planLimits, PLAN_LIMITS };
