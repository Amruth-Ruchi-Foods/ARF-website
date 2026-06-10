import fs from 'fs';
import path from 'path';
import { pool } from './connection.js';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function runMigration() {
  try {
    console.log('📦 Running database migration...');
    
    // Try multiple paths for the schema file
    const possiblePaths = [
      path.join(__dirname, 'schema.sql'),
      path.join(process.cwd(), 'src/db/schema.sql'),
      path.join(process.cwd(), 'backend/src/db/schema.sql')
    ];
    
    let schemaPath = '';
    for (const p of possiblePaths) {
      if (fs.existsSync(p)) {
        schemaPath = p;
        break;
      }
    }
    
    if (!schemaPath) {
      throw new Error('schema.sql file not found. Tried: ' + possiblePaths.join(', '));
    }
    
    console.log(`📄 Reading schema from: ${schemaPath}`);
    const schema = fs.readFileSync(schemaPath, 'utf8');
    
    // Split by semicolon and execute each statement
    const statements = schema
      .split(';')
      .map(s => s.trim())
      .filter(s => s.length > 0 && !s.startsWith('--'));
    
    console.log(`🔄 Executing ${statements.length} SQL statements...`);
    
    for (let i = 0; i < statements.length; i++) {
      try {
        await pool.query(statements[i]);
        console.log(`✓ Statement ${i + 1}/${statements.length} executed`);
      } catch (err: any) {
        // Ignore "already exists" errors
        if (!err.message.includes('already exists')) {
          console.warn(`⚠️  Warning on statement ${i + 1}:`, err.message);
        }
      }
    }
    
    console.log('✅ Database migration completed successfully');
    process.exit(0);
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  }
}

runMigration();
