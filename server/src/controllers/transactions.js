const Transaction = require('../models/Transaction');
const Listing = require('../models/Listing');

exports.list = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = Math.min(parseInt(req.query.limit) || 20, 100);
    const skip = (page - 1) * limit;

    const userId = req.user.userId;
    const filter = { $or: [{ buyer: userId }, { seller: userId }] };

    const [transactions, total] = await Promise.all([
      Transaction.find(filter)
        .populate('buyer', 'name email')
        .populate('seller', 'name email')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      Transaction.countDocuments(filter),
    ]);

    res.json({ transactions, total, page, pages: Math.ceil(total / limit) });
  } catch (err) {
    next(err);
  }
};

exports.purchase = async (req, res, next) => {
  try {
    const { listingId, credits } = req.body;
    const buyerId = req.user.userId;

    const listing = await Listing.findById(listingId).populate('seller');
    if (!listing || !listing.active) {
      return res.status(404).json({ error: 'Listing not found or inactive' });
    }

    if (listing.seller._id.toString() === buyerId) {
      return res.status(400).json({ error: "Can't buy your own listing" });
    }

    if (credits > listing.credits) {
      return res.status(400).json({ error: 'Not enough credits available' });
    }

    const amount = listing.price * credits;

    // create paired transactions
    const [buyTx, sellTx] = await Promise.all([
      Transaction.create({
        buyer: buyerId,
        seller: listing.seller._id,
        listing: listing._id,
        type: 'bought',
        credits,
        amount,
        co2Offset: listing.co2Offset * (credits / listing.credits),
        status: 'completed',
        description: listing.title,
      }),
      Transaction.create({
        buyer: buyerId,
        seller: listing.seller._id,
        listing: listing._id,
        type: 'sold',
        credits,
        amount,
        co2Offset: listing.co2Offset * (credits / listing.credits),
        status: 'completed',
        description: listing.title,
      }),
    ]);

    // update listing — reduce credits or deactivate
    listing.credits -= credits;
    if (listing.credits <= 0) listing.active = false;
    await listing.save();

    res.status(201).json({ transaction: buyTx, remaining: listing.credits });
  } catch (err) {
    next(err);
  }
};
