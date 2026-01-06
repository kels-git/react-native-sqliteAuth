// src/services/database/database-service.ts
import SQLite from 'react-native-sqlite-storage';

SQLite.enablePromise(true);

let database: any = null;

export const getDatabase = async () => {
    if (database) {
      console.log('📱 Using existing database connection');
      return database;
    }
    
    try {
      console.log('🔄 Opening database...');
      const db = await SQLite.openDatabase({
        name: 'UserDB.db',
        location: 'default',
      });

      
      console.log('✅ Database opened successfully');
      console.log('📍 Database object:', db);
      database = db;
      return db;
    } catch (error) {
      console.error('❌ Failed to open database:', error);
      throw error;
    }
  };

  export const initDB = async (): Promise<void> => {
    try {
      console.log('🚀 Starting database initialization...');
      const db = await getDatabase();
      console.log('📊 Database instance received, creating table...');

      
      await db.executeSql(
        `CREATE TABLE IF NOT EXISTS Users (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          name TEXT,
          email TEXT UNIQUE,
          password TEXT
        )`
      );
      
      console.log('✅ Table created successfully');
      
      // Verify table was created
      const [result] = await db.executeSql(
        "SELECT name FROM sqlite_master WHERE type='table' AND name='Users'"
      );
      
      if (result.rows.length > 0) {
        console.log('✅ VERIFIED: Users table exists in database');
      } else {
        console.log('⚠️ WARNING: Users table was not found after creation!');
      }
    } catch (error) {
      console.error('❌ Database initialization failed:', error);
      throw error;
    }
  };

export const createUser = async (name: string, email: string, password: string): Promise<any> => {
  try {
    const db = await getDatabase();
    const [result] = await db.executeSql(
      'INSERT INTO Users (name, email, password) VALUES (?, ?, ?)',
      [name, email, password]
    );
    
    console.log('✅ User created successfully');
    return result;
  } catch (error) {
    console.error('❌ Error creating user:', error);
    throw error;
  }
};

export const loginUser = async (email: string, password: string): Promise<any> => {
  try {
    console.log(`\n🔐 ===== LOGIN ATTEMPT =====`);
    console.log(`📧 Email: ${email}`);
    console.log(`🔑 Password provided: ${password}`);
    
    await debugDatabase();
    
    const db = await getDatabase();
    const [result] = await db.executeSql(
      'SELECT * FROM Users WHERE email = ? AND password = ?',
      [email, password]
    );
    
    console.log(`📊 Rows found: ${result.rows.length}`);
    
    if (result.rows.length > 0) {
      const user = result.rows.item(0);
      console.log('✅ LOGIN SUCCESSFUL');
      console.log('📋 USER DATA:', {
        id: user.id,
        name: user.name,
        email: user.email,
        password: user.password
      });
      
      await debugDatabase();
      
      console.log('🔐 ===== LOGIN END =====\n');
      return user;
    }
    
    console.log('❌ LOGIN FAILED - No matching user found');
    
    const [emailCheck] = await db.executeSql(
      'SELECT * FROM Users WHERE email = ?',
      [email]
    );
    
    if (emailCheck.rows.length > 0) {
      const existingUser = emailCheck.rows.item(0);
      console.log('⚠️ EMAIL EXISTS BUT PASSWORD MISMATCH');
      console.log('📋 STORED USER:', {
        id: existingUser.id,
        email: existingUser.email,
        storedPassword: existingUser.password
      });
      console.log(`🔑 Password comparison: "${password}" vs "${existingUser.password}"`);
    } else {
      console.log('⚠️ EMAIL NOT FOUND in database');
    }
    
    console.log('🔐 ===== LOGIN END =====\n');
    return null;
  } catch (error) {
    console.error('❌ Error logging in:', error);
    throw error;
  }
};

export const getAllUsers = async (): Promise<any[]> => {
  try {
    const db = await getDatabase();
    const [result] = await db.executeSql('SELECT * FROM Users');
    
    const users = [];
    for (let i = 0; i < result.rows.length; i++) {
      users.push(result.rows.item(i));
    }
    
    console.log('📊 Found users:', users.length);
    return users;
  } catch (error) {
    console.error('❌ Error fetching users:', error);
    throw error;
  }
};

export const debugDatabase = async (): Promise<void> => {
  try {
    console.log('🔍 ===== DATABASE DEBUG =====');
    const db = await getDatabase();
    
    const [tables] = await db.executeSql(
      "SELECT name FROM sqlite_master WHERE type='table'"
    );
    
    console.log('📋 TABLES FOUND:');
    for (let i = 0; i < tables.rows.length; i++) {
      console.log(`  - ${tables.rows.item(i).name}`);
    }
    
    const [tableInfo] = await db.executeSql('PRAGMA table_info(Users)');
    console.log('\n📊 USERS TABLE STRUCTURE:');
    for (let i = 0; i < tableInfo.rows.length; i++) {
      const column = tableInfo.rows.item(i);
      console.log(`  ${column.name} (${column.type}) ${column.pk ? 'PRIMARY KEY' : ''}`);
    }
    
    const [users] = await db.executeSql('SELECT * FROM Users');
    console.log(`\n👥 TOTAL USERS: ${users.rows.length}`);
    
    if (users.rows.length > 0) {
      console.log('📝 USER DETAILS:');
      for (let i = 0; i < users.rows.length; i++) {
        const user = users.rows.item(i);
        console.log(`\n  User #${i+1}:`);
        console.log(`    ID: ${user.id}`);
        console.log(`    Name: ${user.name}`);
        console.log(`    Email: ${user.email}`);
        console.log(`    Password: ${user.password}`);
      }
    } else {
      console.log('  ⚠️ No users found in database!');
    }
    
    console.log('🔍 ===== END DEBUG =====\n');
    
  } catch (error) {
    console.error('❌ Debug error:', error);
  }
};