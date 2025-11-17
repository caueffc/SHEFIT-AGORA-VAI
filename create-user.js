import bcrypt from 'bcrypt';
import pool from './config/database.js';

const name = 'Admin';
const email = 'admin@shefit.com';
const password = 'admin123';

const hashedPassword = await bcrypt.hash(password, 10);

await pool.query(
  'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)',
  [name, email, hashedPassword, 'admin']
);

console.log('✅ Usuário criado!');
process.exit(0);
