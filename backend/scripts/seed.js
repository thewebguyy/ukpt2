/**
 * DATABASE SEEDING SCRIPT
 * Populates database with sample data
 */

require('dotenv').config();
const mongoose = require('mongoose');
const { Product, User } = require('../models');
const bcrypt = require('bcryptjs');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/creative-merch-uk');
    console.log('✅ MongoDB Connected');
  } catch (error) {
    console.error('❌ MongoDB Connection Error:', error);
    process.exit(1);
  }
};

// Sample products
const sampleProducts = [
  {
    name: 'Custom T-Shirt Design',
    sku: 'CMUK-TS-001',
    description: 'Premium quality custom t-shirt with your design. Made from 100% organic cotton, perfect for personal use or business branding.',
    category: 'apparel',
    subcategory: 't-shirts',
    price: 24.99,
    currency: 'GBP',
    stock: 150,
    images: [
      { url: '/images/tshirt-1.jpg', alt: 'Custom T-Shirt', isPrimary: true }
    ],
    sizes: [
      { name: 'XS', inStock: true },
      { name: 'S', inStock: true },
      { name: 'M', inStock: true },
      { name: 'L', inStock: true },
      { name: 'XL', inStock: true }
    ],
    colors: [
      { name: 'Black', hexCode: '#000000', inStock: true },
      { name: 'White', hexCode: '#FFFFFF', inStock: true },
      { name: 'Navy', hexCode: '#1E3A8A', inStock: true }
    ],
    customizable: {
      enabled: true,
      options: {
        printLocation: ['Front', 'Back', 'Both'],
        printSize: ['Small', 'Medium', 'Large']
      }
    },
    featured: true,
    tags: ['custom', 'apparel', 'clothing', 'print']
  },
  {
    name: 'Vinyl Sticker Pack',
    sku: 'CMUK-ST-001',
    description: 'High-quality vinyl stickers, weather-resistant and perfect for indoor or outdoor use. Pack of 10 custom designs.',
    category: 'stickers',
    subcategory: 'vinyl',
    price: 9.99,
    currency: 'GBP',
    stock: 300,
    images: [
      { url: '/images/stickers-1.jpg', alt: 'Vinyl Sticker Pack', isPrimary: true }
    ],
    customizable: {
      enabled: true,
      options: {
        quantity: [10, 25, 50, 100],
        finish: ['Matte', 'Glossy']
      }
    },
    featured: true,
    tags: ['stickers', 'vinyl', 'custom', 'decals']
  },
  {
    name: 'Party Banner Set',
    sku: 'CMUK-PD-001',
    description: 'Custom party banners to make your celebration unforgettable. Available in various designs and sizes.',
    category: 'party-decor',
    subcategory: 'banners',
    price: 19.99,
    currency: 'GBP',
    stock: 75,
    images: [
      { url: '/images/banner-1.jpg', alt: 'Party Banner Set', isPrimary: true }
    ],
    customizable: {
      enabled: true,
      options: {
        size: ['Small (3ft)', 'Medium (5ft)', 'Large (8ft)'],
        material: ['Paper', 'Vinyl', 'Fabric']
      }
    },
    featured: true,
    tags: ['party', 'decor', 'celebration', 'banner']
  },
  {
    name: 'Custom Labels',
    sku: 'CMUK-LB-001',
    description: 'Professional custom labels for products, packaging, or events. Waterproof and durable.',
    category: 'stickers',
    subcategory: 'labels',
    price: 14.99,
    currency: 'GBP',
    stock: 200,
    images: [
      { url: '/images/labels-1.jpg', alt: 'Custom Labels', isPrimary: true }
    ],
    customizable: {
      enabled: true,
      options: {
        shape: ['Circle', 'Square', 'Rectangle', 'Custom'],
        quantity: [50, 100, 250, 500]
      }
    },
    featured: true,
    tags: ['labels', 'stickers', 'business', 'branding']
  },
  {
    name: 'Hoodie Custom Design',
    sku: 'CMUK-HD-001',
    description: 'Premium quality hoodie with custom design. Ultra-soft fabric, perfect for any season.',
    category: 'apparel',
    subcategory: 'hoodies',
    price: 39.99,
    currency: 'GBP',
    stock: 100,
    images: [
      { url: '/images/hoodie-1.jpg', alt: 'Custom Hoodie', isPrimary: true }
    ],
    sizes: [
      { name: 'S', inStock: true },
      { name: 'M', inStock: true },
      { name: 'L', inStock: true },
      { name: 'XL', inStock: true },
      { name: 'XXL', inStock: true }
    ],
    colors: [
      { name: 'Black', hexCode: '#000000', inStock: true },
      { name: 'Grey', hexCode: '#6B7280', inStock: true },
      { name: 'Navy', hexCode: '#1E3A8A', inStock: true }
    ],
    featured: false,
    tags: ['hoodie', 'apparel', 'custom', 'clothing']
  },
  {
    name: 'Party Balloons Kit',
    sku: 'CMUK-PD-002',
    description: 'Complete party balloon kit with custom printing. Includes helium-quality latex balloons.',
    category: 'party-decor',
    subcategory: 'balloons',
    price: 15.99,
    currency: 'GBP',
    stock: 150,
    images: [
      { url: '/images/balloons-1.jpg', alt: 'Party Balloons', isPrimary: true }
    ],
    customizable: {
      enabled: true,
      options: {
        quantity: [20, 50, 100],
        colors: ['Assorted', 'Single Color', 'Custom Mix']
      }
    },
    featured: false,
    tags: ['balloons', 'party', 'celebration', 'decor']
  }
];

// Admin user
const adminUser = {
  name: 'Admin User',
  email: 'admin@customisemeuk.com',
  password: 'Admin123!',
  role: 'admin',
  isActive: true
};

// Seed function
const seedDatabase = async () => {
  try {
    await connectDB();

    // Clear existing data
    console.log('🗑️  Clearing existing data...');
    await Product.deleteMany({});
    await User.deleteMany({});

    // Insert products
    console.log('📦 Inserting products...');
    const products = await Product.insertMany(sampleProducts);
    console.log(`✅ Inserted ${products.length} products`);

    // Create admin user
    console.log('👤 Creating admin user...');
    const admin = new User(adminUser);
    await admin.save();
    console.log('✅ Admin user created');
    console.log(`   Email: ${adminUser.email}`);
    console.log(`   Password: ${adminUser.password}`);

    console.log('\n✅ Database seeding completed successfully!');
    process.exit(0);

  } catch (error) {
    console.error('❌ Seeding error:', error);
    process.exit(1);
  }
};

// Run seeder
seedDatabase();