const User = require('../models/User');
const Action = require('../models/Action');
const Transaction = require('../models/Transaction');

exports.dashboard = async (req, res, next) => {
  try {
    const userId = req.user.userId;

    const [user, actions, transactions] = await Promise.all([
      User.findById(userId),
      Action.find({ user: userId }).sort({ createdAt: -1 }).limit(50),
      Transaction.find({ $or: [{ buyer: userId }, { seller: userId }] })
        .sort({ createdAt: -1 })
        .limit(50),
    ]);

    if (!user) return res.status(404).json({ error: 'User not found' });

    // compute stats
    const earned = transactions.filter(t => t.type === 'earned')
      .reduce((sum, t) => sum + t.credits, 0);
    const bought = transactions.filter(t => t.type === 'bought' && t.buyer?.toString() === userId)
      .reduce((sum, t) => sum + t.credits, 0);
    const sold = transactions.filter(t => t.type === 'sold' && t.seller?.toString() === userId)
      .reduce((sum, t) => sum + t.credits, 0);

    const totalCredits = earned + bought - sold;
    const totalCO2 = transactions.reduce((sum, t) => sum + (t.co2Offset || 0), 0);
    const revenue = transactions.filter(t => t.type === 'sold' && t.seller?.toString() === userId)
      .reduce((sum, t) => sum + (t.amount || 0), 0);

    res.json({
      user,
      stats: { totalCredits, totalCO2, revenue, actionsCount: actions.length },
      actions: actions.slice(0, 10),
      transactions: transactions.slice(0, 10),
    });
  } catch (err) {
    next(err);
  }
};

exports.updateWallet = async (req, res, next) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.user.userId,
      { walletAddress: req.body.walletAddress },
      { new: true }
    );
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json(user);
  } catch (err) {
    next(err);
  }
};
