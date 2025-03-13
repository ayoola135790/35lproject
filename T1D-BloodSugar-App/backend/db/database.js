const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const bcrypt = require('bcrypt');
const fs = require('fs');

const dbPath = path.resolve(__dirname, 'database.sqlite');
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error opening database:', err.message);
  } else {
    console.log('Connected to the SQLite database.');
  }
});

function initializeDatabase() {
  try {
    const createUsersTable = `
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT,
        email TEXT UNIQUE,
        username TEXT UNIQUE,
        phone TEXT UNIQUE,
        password_hash TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;
    
    db.run(createUsersTable, (err) => {
      if (err) {
        console.error('Error creating users table:', err.message);
        throw err;
      } else {
        console.log('Database initialized with users table');
      }
    });
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
    return new Promise((resolve, reject) => {
      const { name, password, email, username, phone } = userData;
      
      try {
        hashPassword(password).then(passwordHash => {
          const insertUser = `
            INSERT INTO users (name, email, username, phone, password_hash)
            VALUES (?, ?, ?, ?, ?)
          `;
          
          const params = [ 
            name, 
            email || null,
            username || null,
            phone || null,
            passwordHash
          ];
          
          db.run(insertUser, params, function(err) {
            if (err) {
              console.error('Error creating user:', err.message);
              resolve({ success: false, error: err.message });
            } else {
              resolve({ success: true, id: this.lastID });
            }
          });
        }).catch(err => {
          console.error('Error hashing password:', err);
          resolve({ success: false, error: err.message });
        });
      } catch (error) {
        console.error('Error creating user:', error);
        resolve({ success: false, error: error.message });
      }
    });
  },
  
  async verifyUser(identifier, password) {
    return new Promise((resolve, reject) => {
      try {
        let field = 'username'; 
        if (identifier.includes('@')) {
          field = 'email';
        } else if (/^\+?\d{10,15}$/.test(identifier)) {
          field = 'phone';
        }
        
        const query = `SELECT * FROM users WHERE ${field} = ?`;
        console.log('Executing query:', query, 'with value:', identifier);
        
        db.get(query, [identifier], async (err, user) => {
          if (err) {
            console.error('Error verifying user:', err.message);
            resolve({ success: false, error: err.message });
            return;
          }
          
          if (!user) {
            console.log('User not found with identifier:', identifier);
            resolve({ success: false, error: 'User not found' });
            return;
          }
          
          const passwordMatch = await bcrypt.compare(password, user.password_hash);
          
          if (passwordMatch) {
            const { password_hash, ...userWithoutPassword } = user;
            resolve({ success: true, user: userWithoutPassword });
          } else {
            resolve({ success: false, error: 'Invalid password' });
          }
        });
      } catch (error) {
        console.error('Error verifying user:', error);
        resolve({ success: false, error: error.message });
      }
    });
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
