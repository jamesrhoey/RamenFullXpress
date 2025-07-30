require('dotenv').config();
const mongoose = require('mongoose');
const Inventory = require('./models/inventory');
const fs = require('fs');
const path = require('path');

// Read sample inventory data from JSON file
const sampleInventoryPath = path.join(__dirname, 'sample_inventory.json');
const sampleInventory = JSON.parse(fs.readFileSync(sampleInventoryPath, 'utf8'));

// Connect to MongoDB Atlas (production)
mongoose.connect(process.env.MONGO_URI, {
  serverSelectionTimeoutMS: 10000,
  socketTimeoutMS: 45000,
  maxPoolSize: 10,
  serverApi: {
    version: '1',
    strict: true,
    deprecationErrors: true,
  }
})
.then(() => console.log('✅ Connected to MongoDB Atlas'))
.catch(err => {
  console.error('❌ MongoDB Connection Error:', err);
  process.exit(1);
});

// Function to populate database
async function populateInventory() {
  try {
    console.log('🗄️ Starting inventory population...');
    
    // Clear existing inventory
    await Inventory.deleteMany({});
    console.log('🧹 Cleared existing inventory data');

    // Insert sample data
    const result = await Inventory.insertMany(sampleInventory);
    console.log(`✅ Successfully added ${result.length} inventory items`);

    // Display the added items
    console.log('\n📋 Added items:');
    result.forEach(item => {
      console.log(`- ${item.name}: ${item.stocks} ${item.units} (Last restocked: ${new Date(item.restocked).toLocaleDateString()})`);
    });

    console.log('\n🎉 Database population completed successfully!');
    mongoose.connection.close();
    console.log('🔌 Database connection closed');
  } catch (error) {
    console.error('❌ Error populating database:', error);
    mongoose.connection.close();
    process.exit(1);
  }
}

// Run the population script
populateInventory();

