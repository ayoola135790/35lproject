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
    
    const createBloodSugarTable = `
      CREATE TABLE IF NOT EXISTS blood_sugar_data (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        blood_sugar_level INTEGER NOT NULL,
        timestamp TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id)
      )
    `;
    
    // journal table
    const createJournalTable = `
      CREATE TABLE IF NOT EXISTS journal_entries (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        content TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id)
      )
    `;

    db.serialize(() => {
      db.run(createUsersTable, (err) => {
        if (err) {
          console.error('Error creating users table:', err.message);
        } else {
          console.log('Users table initialized');
        }
      });
      
      db.run(createBloodSugarTable, (err) => {
        if (err) {
          console.error('Error creating blood_sugar_data table:', err.message);
        } else {
          console.log('Blood sugar data table initialized');
        }
      });

      // Run Journal
      db.run(createJournalTable, (err) => {
        if (err) {
          console.error('Error creating journal_entries table:', err.message);
        } else {
          console.log('Journal entries table initialized');
        }
      });
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
          console.log('Using email field for lookup');
        } else if (/^\+?\d{10,15}$/.test(identifier)) {
          field = 'phone';
          console.log('Using phone field for lookup');
        } else {
          console.log('Using username field for lookup');
        }
        
        const sql = `SELECT * FROM users WHERE ${field} = ?`;
        console.log('Executing SQL:', sql, 'with identifier:', identifier);
        
        db.get(sql, [identifier], async (err, user) => {
          if (err) {
            console.error('Database error:', err);
            resolve({ success: false, error: 'Database error' });
            return;
          }
          
          if (!user) {
            console.log('No user found with identifier:', identifier);
            resolve({ success: false, error: 'Invalid credentials' });
            return;
          }

          console.log('User found:', { ...user, password_hash: '[REDACTED]' });
          
          try {
            console.log('Comparing passwords...');
            const passwordMatch = await bcrypt.compare(password, user.password_hash);
            console.log('Password match result:', passwordMatch);
            
            if (passwordMatch) {
              const { password_hash, ...userWithoutPassword } = user;
              resolve({ success: true, user: userWithoutPassword });
            } else {
              resolve({ success: false, error: 'Invalid credentials' });
            }
          } catch (bcryptError) {
            console.error('Password comparison error:', bcryptError);
            resolve({ success: false, error: 'Authentication error' });
          }
        });
      } catch (error) {
        console.error('Verification error:', error);
        resolve({ success: false, error: 'Server error' });
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

const bloodSugarFunctions = {
  async addBloodSugarReading(userId, bloodSugarLevel, timestamp) {
    return new Promise((resolve, reject) => {
      const insertReading = `
        INSERT INTO blood_sugar_data (user_id, blood_sugar_level, timestamp)
        VALUES (?, ?, ?)
      `;
      
      db.run(insertReading, [userId, bloodSugarLevel, timestamp], function(err) {
        if (err) {
          console.error('Error adding blood sugar reading:', err.message);
          resolve({ success: false, error: err.message });
        } else {
          resolve({ success: true, id: this.lastID });
        }
      });
    });
  },
  
  async getBloodSugarReadings(userId) {
    return new Promise((resolve, reject) => {
      const query = `
        SELECT blood_sugar_level, timestamp
        FROM blood_sugar_data
        WHERE user_id = ?
        ORDER BY timestamp ASC
      `;
      
      db.all(query, [userId], (err, rows) => {
        if (err) {
          console.error('Error fetching blood sugar readings:', err.message);
          resolve({ success: false, error: err.message });
        } else {
          resolve({ success: true, data: rows });
        }
      });
    });
  },

  async deleteBloodSugarReading(userId, timestamp, bloodSugarLevel) {
    return new Promise((resolve, reject) => {
      const deleteReading = `
        DELETE FROM blood_sugar_data
        WHERE user_id = ? AND timestamp = ? AND blood_sugar_level = ?
      `;
      
      db.run(deleteReading, [userId, timestamp, bloodSugarLevel], function(err) {
        if (err) {
          console.error('Error deleting blood sugar reading:', err.message);
          resolve({ success: false, error: err.message });
        } else {
          if (this.changes === 0) {
            resolve({ success: false, error: 'No matching reading found' });
          } else {
            resolve({ success: true, changes: this.changes });
          }
        }
      });
    });
  }
};

try {
  initializeDatabase();
} catch (err) {
  console.error('Failed to initialize database:', err);
}

module.exports = {
  db,
  userFunctions,
  bloodSugarFunctions
};

