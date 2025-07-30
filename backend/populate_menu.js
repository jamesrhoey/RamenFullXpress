require('dotenv').config();
const mongoose = require('mongoose');
const Menu = require('./models/menu');
const fs = require('fs');
const path = require('path');

// Read sample menu data from JSON file
const sampleMenuPath = path.join(__dirname, 'sample_menu.json');
const sampleMenu = JSON.parse(fs.readFileSync(sampleMenuPath, 'utf8'));

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

async function populateMenu() {
  try {
    console.log('🗄️ Starting menu population...');
    
    // Clear existing menu items
    await Menu.deleteMany({});
    console.log('🧹 Cleared existing menu data');

    // Map menu items to match the Menu schema
    const mappedMenuItems = sampleMenu.map(item => ({
      name: item.name,
      category: item.category ? item.category.toLowerCase() : 'ramen',
      price: item.price,
      image: item.image,
      ingredients: Array.isArray(item.ingredients)
        ? item.ingredients.map(ing => ({
            inventoryItem: ing.name,
            quantity: ing.quantity,
            unit: ing.unit
          }))
        : []
    }));

    // Insert menu items
    const result = await Menu.insertMany(mappedMenuItems);
    console.log(`✅ Successfully added ${result.length} menu items`);

    // Display the added items
    console.log('\n📋 Added menu items:');
    result.forEach(item => {
      console.log(`- ${item.name}: ₱${item.price} (${item.category})`);
    });

    console.log('\n🎉 Menu population completed successfully!');
    mongoose.connection.close();
    console.log('🔌 Database connection closed');
  } catch (error) {
    console.error('❌ Error populating menu:', error);
    mongoose.connection.close();
    process.exit(1);
  }
}

// Run the population script
populateMenu();
