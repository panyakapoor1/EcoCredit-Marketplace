const Action = require('../models/Action');
const Transaction = require('../models/Transaction');
const { verifyAction } = require('../services/ai');

exports.list = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = Math.min(parseInt(req.query.limit) || 20, 100);
    const skip = (page - 1) * limit;

    const [actions, total] = await Promise.all([
      Action.find({ user: req.user.userId })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      Action.countDocuments({ user: req.user.userId }),
    ]);

    res.json({ actions, total, page, pages: Math.ceil(total / limit) });
  } catch (err) {
    next(err);
  }
};

exports.getOne = async (req, res, next) => {
  try {
    const action = await Action.findOne({ _id: req.params.id, user: req.user.userId });
    if (!action) return res.status(404).json({ error: 'Action not found' });
    res.json(action);
  } catch (err) {
    next(err);
  }
};

exports.create = async (req, res, next) => {
  try {
    const { type, description, location, date, co2Estimate, imageUrl, hasGeotag } = req.body;

    // run AI verification
    const aiResult = await verifyAction({ type, description, date, co2Estimate, hasGeotag: hasGeotag || false });

    const baseCredits = co2Estimate * 10;
    const credits = aiResult.verified
      ? Math.floor(baseCredits * (aiResult.creditScore / 100))
      : 0;

    const action = await Action.create({
      user: req.user.userId,
      type,
      description,
      location,
      date: new Date(date),
      co2Estimate,
      credits,
      status: aiResult.verified ? 'verified' : 'pending',
      imageUrl,
      verification: {
        aiScore: aiResult.creditScore,
        geoVerified: hasGeotag || false,
        imageAnalysis: aiResult.message,
        verifiedAt: aiResult.verified ? new Date() : undefined,
      },
    });

    // create a transaction record if verified
    if (aiResult.verified) {
      await Transaction.create({
        buyer: req.user.userId, // earning user
        type: 'earned',
        credits,
        co2Offset: co2Estimate,
        status: 'completed',
        description: `${type}: ${description.substring(0, 100)}`,
      });
    }

    // increment usage counter
    if (req.planUser) {
      req.planUser.usage.actionsThisMonth += 1;
      await req.planUser.save();
    }

    res.status(201).json({ action, verification: aiResult });
  } catch (err) {
    next(err);
  }
};

exports.updateBlockchain = async (req, res, next) => {
  try {
    const { blockchainHash } = req.body;
    const action = await Action.findOneAndUpdate(
      { _id: req.params.id, user: req.user.userId },
      { blockchainHash },
      { new: true }
    );
    if (!action) return res.status(404).json({ error: 'Action not found' });
    res.json(action);
  } catch (err) {
    next(err);
  }
};
