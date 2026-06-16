const Listing = require('../models/Listing');
const Transaction = require('../models/Transaction');

exports.list = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = Math.min(parseInt(req.query.limit) || 20, 100);
    const skip = (page - 1) * limit;

    const filter = { active: true };
    if (req.query.type) filter.type = req.query.type;
    if (req.query.search) {
      filter.$or = [
        { title: { $regex: req.query.search, $options: 'i' } },
        { location: { $regex: req.query.search, $options: 'i' } },
        { type: { $regex: req.query.search, $options: 'i' } },
      ];
    }

    // sort options
    let sort = { createdAt: -1 };
    switch (req.query.sort) {
      case 'price-low': sort = { price: 1 }; break;
      case 'price-high': sort = { price: -1 }; break;
      case 'co2': sort = { co2Offset: -1 }; break;
    }

    const [listings, total] = await Promise.all([
      Listing.find(filter)
        .populate('seller', 'name accountType')
        .sort(sort)
        .skip(skip)
        .limit(limit),
      Listing.countDocuments(filter),
    ]);

    res.json({ listings, total, page, pages: Math.ceil(total / limit) });
  } catch (err) {
    next(err);
  }
};

exports.getOne = async (req, res, next) => {
  try {
    const listing = await Listing.findById(req.params.id)
      .populate('seller', 'name accountType');
    if (!listing) return res.status(404).json({ error: 'Listing not found' });
    res.json(listing);
  } catch (err) {
    next(err);
  }
};

exports.create = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    const requestedCredits = req.body.credits;

    // Calculate available credits
    const transactions = await Transaction.find({ $or: [{ buyer: userId }, { seller: userId }] });
    const earned = transactions.filter(t => t.type === 'earned').reduce((sum, t) => sum + t.credits, 0);
    const bought = transactions.filter(t => t.type === 'bought' && t.buyer?.toString() === userId).reduce((sum, t) => sum + t.credits, 0);
    const sold = transactions.filter(t => t.type === 'sold' && t.seller?.toString() === userId).reduce((sum, t) => sum + t.credits, 0);
    const totalCredits = earned + bought - sold;

    // Calculate active listed credits (escrow)
    const activeListings = await Listing.find({ seller: userId, active: true });
    const listedCredits = activeListings.reduce((sum, l) => sum + l.credits, 0);

    const availableCredits = totalCredits - listedCredits;

    if (requestedCredits > availableCredits) {
      return res.status(400).json({ 
        error: `Insufficient credits. You have ${availableCredits} available to list (excluding already listed credits).` 
      });
    }

    const data = { ...req.body, seller: userId };
    if (req.body.actionId) {
      data.action = req.body.actionId;
      delete data.actionId;
    }

    const listing = await Listing.create(data);

    if (req.planUser) {
      req.planUser.usage.listingsThisMonth += 1;
      await req.planUser.save();
    }

    res.status(201).json(listing);
  } catch (err) {
    next(err);
  }
};

exports.remove = async (req, res, next) => {
  try {
    const listing = await Listing.findOneAndUpdate(
      { _id: req.params.id, seller: req.user.userId },
      { active: false },
      { new: true }
    );
    if (!listing) return res.status(404).json({ error: 'Listing not found or not yours' });
    res.json({ message: 'Listing removed' });
  } catch (err) {
    next(err);
  }
};
