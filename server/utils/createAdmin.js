const bcrypt = require('bcryptjs');
const pool = require('../config/database');

async function createAdminUser() {
  try {
    // Check if admin already exists
    const existingAdmin = await pool.query(
      'SELECT id FROM users WHERE email = $1',
      ['admin@nurova.com.au']
    );

    if (existingAdmin.rows.length > 0) {
      console.log('✅ Admin user already exists');
      return;
    }

    // Hash password
    const hashedPassword = await bcrypt.hash('NurovaAdmin2025!', 12);

    // Create admin user
    const result = await pool.query(`
      INSERT INTO users (
        email, password_hash, first_name, last_name, role, 
        is_active, email_verified, created_at
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, NOW())
      RETURNING id, email, role
    `, [
      'admin@nurova.com.au',
      hashedPassword,
      'Admin',
      'User',
      'admin',
      true,
      true
    ]);

    console.log('✅ Admin user created successfully:', result.rows[0]);
  } catch (error) {
    console.error('❌ Error creating admin user:', error);
  }
}

module.exports = { createAdminUser };