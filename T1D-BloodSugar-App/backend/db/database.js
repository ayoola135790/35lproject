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
    const { name, password, email, username, phone } = userData;
    
    try {
      const passwordHash = await hashPassword(password);
      
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
          return { success: false, error: err.message };
        } else {
          return { success: true, id: this.lastID };
        }
      });
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
      
      db.get(query, [identifier], async (err, user) => {
        if (err) {
          console.error('Error verifying user:', err.message);
          return { success: false, error: err.message };
        }
        
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
      });
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
      
      db.get(query, [identifier], (err, user) => {
        if (err) {
          console.error('Error finding user:', err.message);
          return { success: false, error: err.message };
        }
        
        if (!user) {
          return { success: false, error: 'User not found' };
        }
        
        const { password_hash, ...userWithoutPassword } = user;
        return { success: true, user: userWithoutPassword };
      });
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
      
      db.get(userQuery, [identifier], async (err, user) => {
        if (err) {
          console.error('Error finding user:', err.message);
          return { success: false, error: err.message };
        }
        
        if (!user) {
          return { success: false, error: 'User not found' };
        }
        
        const passwordHash = await hashPassword(newPassword);
        
        const updatePassword = `
          UPDATE users 
          SET password_hash = ? 
          WHERE ${field} = ?
        `;
        
        db.run(updatePassword, [passwordHash, identifier], (err) => {
          if (err) {
            console.error('Error updating password:', err.message);
            return { success: false, error: err.message };
          } else {
            return { success: true };
          }
        });
      });
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