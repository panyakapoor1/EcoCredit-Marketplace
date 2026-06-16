const User = require('../models/User');
const Action = require('../models/Action');
const Transaction = require('../models/Transaction');
const Listing = require('../models/Listing');

exports.listUsers = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = Math.min(parseInt(req.query.limit) || 50, 200);
    const skip = (page - 1) * limit;

    const [users, total] = await Promise.all([
      User.find().sort({ createdAt: -1 }).skip(skip).limit(limit),
      User.countDocuments(),
    ]);

    res.json({ users, total, page, pages: Math.ceil(total / limit) });
  } catch (err) {
    next(err);
  }
};

exports.stats = async (req, res, next) => {
  try {
    const [users, actions, listings, transactions] = await Promise.all([
      User.countDocuments(),
      Action.countDocuments(),
      Listing.countDocuments({ active: true }),
      Transaction.countDocuments(),
    ]);

    const verifiedActions = await Action.countDocuments({ status: 'verified' });
    const totalCO2 = await Action.aggregate([
      { $match: { status: 'verified' } },
      { $group: { _id: null, total: { $sum: '$co2Estimate' } } },
    ]);

    res.json({
      users,
      actions,
      verifiedActions,
      activeListings: listings,
      transactions,
      totalCO2Offset: totalCO2[0]?.total || 0,
    });
  } catch (err) {
    next(err);
  }
};

exports.updatePlan = async (req, res, next) => {
  try {
    const { plan } = req.body;
    if (!['free', 'pro', 'enterprise'].includes(plan)) {
      return res.status(400).json({ error: 'Invalid plan' });
    }

    const user = await User.findByIdAndUpdate(req.params.id, { plan }, { new: true });
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json(user);
  } catch (err) {
    next(err);
  }
};

exports.updateActionStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    if (!['pending', 'verified', 'rejected'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }

    const action = await Action.findByIdAndUpdate(req.params.id, { status }, { new: true });
    if (!action) return res.status(404).json({ error: 'Action not found' });
    res.json(action);
  } catch (err) {
    next(err);
  }
};
