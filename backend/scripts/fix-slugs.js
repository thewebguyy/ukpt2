/**
 * FIX DUPLICATE SLUG SCRIPT
 * Run this if you get slug duplicate errors
 */

const mongoose = require('mongoose');
require('dotenv').config();

async function fixDuplicateSlugs() {
  try {
    console.log('🔧 Fixing duplicate slug issue...\n');

    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/creative-merch-uk', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ Connected to MongoDB\n');

    // Drop the slug index
    console.log('Dropping slug index...');
    const db = mongoose.connection.db;
    try {
      await db.collection('products').dropIndex('slug_1');
      console.log('✅ Slug index dropped\n');
    } catch (error) {
      console.log('ℹ️  No slug index to drop (this is fine)\n');
    }

    // Clear all products
    console.log('Clearing products...');
    await db.collection('products').deleteMany({});
    console.log('✅ Products cleared\n');

    console.log('╔════════════════════════════════════════╗');
    console.log('║     FIX COMPLETED SUCCESSFULLY!        ║');
    console.log('╚════════════════════════════════════════╝\n');
    console.log('✅ Now you can run: npm run seed\n');

    process.exit(0);

  } catch (error) {
    console.error('❌ Fix Error:', error);
    process.exit(1);
  }
}

// Run fix
fixDuplicateSlugs();