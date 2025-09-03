import dotenv from 'dotenv';
import mysql from 'mysql2/promise';
import bcrypt from 'bcryptjs';

dotenv.config();

const DB_HOST = process.env.DB_HOST || '127.0.0.1';
const DB_PORT = Number(process.env.DB_PORT || 3306);
const DB_USER = process.env.DB_USER || 'root';
const DB_PASSWORD = process.env.DB_PASSWORD || '1908';
const DB_NAME = process.env.DB_NAME || 'portal_alerta';

const [,, username, password] = process.argv;

if (!username || !password) {
  console.log('Uso: npm run create-user -- <usuario> <password>');
  process.exit(1);
}

const passwordHash = bcrypt.hashSync(password, 12);
const pool = await mysql.createPool({
  host: DB_HOST, port: DB_PORT,
  user: DB_USER, password: DB_PASSWORD, database: DB_NAME,
  waitForConnections: true, connectionLimit: 2, namedPlaceholders: true
});

const [exists] = await pool.execute(
  'SELECT id FROM users WHERE username = :u LIMIT 1', { u: username }
);
if (exists.length) {
  console.log('El usuario ya existe.');
  process.exit(1);
}

await pool.execute(
  'INSERT INTO users (username, password_hash) VALUES (:u, :h)',
  { u: username, h: passwordHash }
);

console.log('Usuario creado:', username);
process.exit(0);
