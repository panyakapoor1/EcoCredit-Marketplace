require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./src/models/User');
const Listing = require('./src/models/Listing');

async function seed() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected!');

    // Find the seller you just created
    const seller = await User.findOne({ role: 'seller' });
    if (!seller) {
      console.log('Could not find a user with role "seller". Please create one first!');
      process.exit(1);
    }

    console.log(`Found seller: ${seller.email}`);

    // Clear existing mock listings if you want
    // await Listing.deleteMany({});

    const mockListings = [
      {
        seller: seller._id,
        title: 'Community Solar Farm - Gujarat',
        type: 'Solar Energy',
        description: 'Shares from our new 50MW solar plant in Gujarat.',
        price: 850, // Rs per credit
        credits: 500,
        co2Offset: 500,
        location: 'Gujarat, India',
        imageUrl: 'https://images.unsplash.com/photo-1509391366360-1e9447bb4116?auto=format&fit=crop&q=80',
        active: true,
      },
      {
        seller: seller._id,
        title: 'Western Ghats Reforestation',
        type: 'Reforestation',
        description: 'Verified planting of 10,000 native trees.',
        price: 1200, 
        credits: 250,
        co2Offset: 250,
        location: 'Kerala, India',
        imageUrl: 'https://images.unsplash.com/photo-1511497584788-876760111969?auto=format&fit=crop&q=80',
        active: true,
      },
      {
        seller: seller._id,
        title: 'Delhi EV Fleet Transition',
        type: 'Clean Transport',
        description: 'Offsetting emissions by transitioning 50 delivery trucks to EV.',
        price: 950,
        credits: 100,
        co2Offset: 100,
        location: 'New Delhi, India',
        imageUrl: 'https://images.unsplash.com/photo-1593941707882-a5bba14938c7?auto=format&fit=crop&q=80',
        active: true,
      }
    ];

    await Listing.insertMany(mockListings);
    console.log('✅ Successfully seeded the marketplace with 3 listings!');
    
  } catch (error) {
    console.error('Error seeding data:', error);
  } finally {
    process.exit(0);
  }
}

seed();
