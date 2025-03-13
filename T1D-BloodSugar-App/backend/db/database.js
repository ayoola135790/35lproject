const Database = require('better-sqlite3');
const path = require('path');
const bcrypt = require('bcrypt');
const fs = require('fs');

const dbDir = __dirname;
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

let db;
try {
  db = new Database(path.join(dbDir, 'glucolog.db'), { verbose: console.log });
  console.log('SQLite database connection established');
} catch (err) {
  console.error('Error connecting to SQLite database:', err);
  process.exit(1); 
}

function initializeDatabase() {
  try {
    const createUsersTable = db.prepare(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT,
        email TEXT UNIQUE,
        username TEXT UNIQUE,
        phone TEXT UNIQUE,
        password_hash TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    
    createUsersTable.run();
    console.log('Database initialized with users table');
  } catch (error) {
    console.error('Error initializing database:', error);
    throw error;
  }
}

async function hashPassword(password) {
  const saltRounds = 10;
  return await bcrypt.hash(password, saltRounds);
}

const userFunctions = {
  async createUser(userData) {
    const { name, password, email, username, phone } = userData;
    
    try {
      const passwordHash = await hashPassword(password);
      
      const insertUser = db.prepare(`
        INSERT INTO users (name, email, username, phone, password_hash)
        VALUES (@name, @email, @username, @phone, @passwordHash)
      `);
      
      const params = { 
        name, 
        passwordHash,
        email: email || null,
        username: username || null,
        phone: phone || null
      };
      
      const result = insertUser.run(params);
      return { success: true, id: result.lastInsertRowid };
    } catch (error) {
      console.error('Error creating user:', error);
      return { success: false, error: error.message };
    }
  },
  
  async verifyUser(identifier, password) {
    try {
      let field = 'username'; 
      if (identifier.includes('@')) {
        field = 'email';
      } else if (/^\+?\d{10,15}$/.test(identifier)) {
        field = 'phone';
      }
      
      const query = `SELECT * FROM users WHERE ${field} = ?`;
      console.log('Executing query:', query, 'with value:', identifier);
      const getUser = db.prepare(query);
      const user = getUser.get(identifier);
      
      if (!user) {
        console.log('User not found with identifier:', identifier);
        return { success: false, error: 'User not found' };
      }
      
      const passwordMatch = await bcrypt.compare(password, user.password_hash);
      
      if (passwordMatch) {
        const { password_hash, ...userWithoutPassword } = user;
        return { success: true, user: userWithoutPassword };
      } else {
        return { success: false, error: 'Invalid password' };
      }
    } catch (error) {
      console.error('Error verifying user:', error);
      return { success: false, error: error.message };
    }
  },

  async findUserByIdentifier(identifier) {
    try {
      let field = 'username';
      if (identifier.includes('@')) {
        field = 'email';
      } else if (/^\+?\d{10,15}$/.test(identifier)) {
        field = 'phone';
      }
      
      const query = `SELECT * FROM users WHERE ${field} = ?`;
      const getUser = db.prepare(query);
      const user = getUser.get(identifier);
      
      if (!user) {
        return { success: false, error: 'User not found' };
      }
      
      const { password_hash, ...userWithoutPassword } = user;
      return { success: true, user: userWithoutPassword };
    } catch (error) {
      console.error('Error finding user:', error);
      return { success: false, error: error.message };
    }
  },

  async updateUserPassword(identifier, newPassword) {
    try {
      let field = 'username';
      if (identifier.includes('@')) {
        field = 'email';
      } else if (/^\+?\d{10,15}$/.test(identifier)) {
        field = 'phone';
      }
      
      // First check if the user exists
      const userQuery = `SELECT id FROM users WHERE ${field} = ?`;
      const getUser = db.prepare(userQuery);
      const user = getUser.get(identifier);
      
      if (!user) {
        return { success: false, error: 'User not found' };
      }
      
      const passwordHash = await hashPassword(newPassword);
      
      const updatePassword = db.prepare(`
        UPDATE users 
        SET password_hash = ? 
        WHERE ${field} = ?
      `);
      
      updatePassword.run(passwordHash, identifier);
      
      return { success: true };
    } catch (error) {
      console.error('Error updating password:', error);
      return { success: false, error: error.message };
    }
  }
};

try {
  initializeDatabase();
} catch (err) {
  console.error('Failed to initialize database:', err);
}

module.exports = {
  db,
  userFunctions
};