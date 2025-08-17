import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as sqlite3 from 'sqlite3';
import * as path from 'path';
import * as fs from 'fs';

// Token data interface
export interface TokenData {
  id?: number;
  access_token?: string;  // Optional for simplified auth
  refresh_token?: string;
  expires_in?: number;
  expires_at: Date;
  domain?: string;
  scope?: string;
  client_endpoint?: string;
  server_endpoint?: string;
  member_id?: string;
  status?: string;
  application_token?: string;
  method?: string; // oauth2 or simplified_auth
  created_at?: Date;
  updated_at?: Date;
}

// Temporary interface until proper sqlite package is installed
interface Database {
  exec(sql: string): Promise<void>;
  get(sql: string, params?: any[]): Promise<any>;
  all(sql: string, params?: any[]): Promise<any[]>;
  run(sql: string, params?: any[]): Promise<any>;
  close(): Promise<void>;
}

// Simple database wrapper using sqlite3
class DatabaseWrapper implements Database {
  constructor(private db: sqlite3.Database) {}

  exec(sql: string): Promise<void> {
    return new Promise((resolve, reject) => {
      this.db.exec(sql, (err) => {
        if (err) reject(err);
        else resolve();
      });
    });
  }

  get(sql: string, params?: any[]): Promise<any> {
    return new Promise((resolve, reject) => {
      this.db.get(sql, params || [], (err, row) => {
        if (err) reject(err);
        else resolve(row);
      });
    });
  }

  all(sql: string, params?: any[]): Promise<any[]> {
    return new Promise((resolve, reject) => {
      this.db.all(sql, params || [], (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      });
    });
  }

  run(sql: string, params?: any[]): Promise<any> {
    return new Promise((resolve, reject) => {
      this.db.run(sql, params || [], function(err) {
        if (err) reject(err);
        else resolve({ lastID: this.lastID, changes: this.changes });
      });
    });
  }

  close(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.db.close((err) => {
        if (err) reject(err);
        else resolve();
      });
    });
  }
}

@Injectable()
export class DatabaseService implements OnModuleInit {
  private readonly logger = new Logger(DatabaseService.name);
  private db: Database;
  private dbPath: string;

  constructor(private configService: ConfigService) {
    this.dbPath = this.configService.get<string>('DATABASE_PATH') || './database.sqlite';
  }

  async onModuleInit() {
    await this.initializeDatabase();
  }

  /**
   * Initialize SQLite database connection and create tables
   */
  private async initializeDatabase() {
    try {
      // Ensure database directory exists
      const dbDir = path.dirname(this.dbPath);
      if (!fs.existsSync(dbDir)) {
        fs.mkdirSync(dbDir, { recursive: true });
      }

      // Create database connection using sqlite3
      this.db = await this.openDatabase();
      
      // Create tables
      await this.createTables();
      
      this.logger.log(`🗄️ Database initialized at ${this.dbPath}`);
    } catch (error) {
      this.logger.error('❌ Database initialization failed:', error);
      throw error;
    }
  }

  /**
   * Open database connection
   */
  private async openDatabase(): Promise<Database> {
    return new Promise((resolve, reject) => {
      const db = new sqlite3.Database(this.dbPath, (err) => {
        if (err) {
          reject(err);
        } else {
          resolve(new DatabaseWrapper(db));
        }
      });
    });
  }

  /**
   * Create database tables if they don't exist
   */
  private async createTables(): Promise<void> {
    const createTokensTable = `
      CREATE TABLE IF NOT EXISTS tokens (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        access_token TEXT,
        refresh_token TEXT,
        expires_in INTEGER,
        expires_at TEXT,
        domain TEXT,
        scope TEXT,
        client_endpoint TEXT,
        server_endpoint TEXT,
        member_id TEXT,
        status TEXT DEFAULT 'active',
        application_token TEXT,
        method TEXT DEFAULT 'oauth2',
        created_at TEXT NOT NULL,
        updated_at TEXT NOT NULL
      )
    `;

    await this.db.exec(createTokensTable);
    
    // Create index for faster lookups
    const createIndexes = `
      CREATE INDEX IF NOT EXISTS idx_tokens_domain ON tokens(domain);
      CREATE INDEX IF NOT EXISTS idx_tokens_member_id ON tokens(member_id);
      CREATE INDEX IF NOT EXISTS idx_tokens_created_at ON tokens(created_at);
      CREATE INDEX IF NOT EXISTS idx_tokens_method ON tokens(method);
    `;

    await this.db.exec(createIndexes);
    
    this.logger.log('✅ Database tables created/verified');
  }

  /**
   * Save token data to database
   */
  async saveToken(tokenData: TokenData): Promise<number> {
    try {
      this.logger.log('💾 Saving token to database', {
        domain: tokenData.domain,
        expiresAt: tokenData.expires_at,
        memberId: tokenData.member_id
      });

      // First, delete any existing tokens for the same domain/member
      if (tokenData.domain || tokenData.member_id) {
        await this.deleteExistingTokens(tokenData.domain, tokenData.member_id);
      }

      const insertSQL = `
        INSERT INTO tokens (
          access_token, refresh_token, expires_in, expires_at,
          domain, scope, client_endpoint, server_endpoint,
          member_id, status, application_token, method, created_at, updated_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `;

      const result = await this.db.run(insertSQL, [
        tokenData.access_token || null,
        tokenData.refresh_token || null,
        tokenData.expires_in || null,
        tokenData.expires_at.toISOString(),
        tokenData.domain,
        tokenData.scope,
        tokenData.client_endpoint,
        tokenData.server_endpoint,
        tokenData.member_id,
        tokenData.status,
        tokenData.application_token,
        tokenData.method || 'oauth2',
        new Date().toISOString(),
        new Date().toISOString()
      ]);

      this.logger.log('✅ Token saved successfully', {
        tokenId: result.lastID,
        domain: tokenData.domain
      });

      return result.lastID as number;

    } catch (error) {
      this.logger.error('❌ Failed to save token', {
        error: error.message,
        domain: tokenData.domain
      });
      throw error;
    }
  }

  /**
   * Get current/latest token
   */
  async getCurrentToken(): Promise<TokenData | null> {
    try {
      const selectSQL = `
        SELECT * FROM tokens 
        ORDER BY created_at DESC 
        LIMIT 1
      `;

      const row = await this.db.get(selectSQL);

      if (!row) {
        this.logger.log('📋 No token found in database');
        return null;
      }

      const token: TokenData = {
        id: row.id,
        access_token: row.access_token,
        refresh_token: row.refresh_token,
        expires_in: row.expires_in,
        expires_at: new Date(row.expires_at),
        domain: row.domain,
        scope: row.scope,
        client_endpoint: row.client_endpoint,
        server_endpoint: row.server_endpoint,
        member_id: row.member_id,
        status: row.status,
        application_token: row.application_token,
        method: row.method,
        created_at: new Date(row.created_at),
        updated_at: new Date(row.updated_at)
      };

      this.logger.log('📋 Token retrieved from database', {
        tokenId: token.id,
        domain: token.domain,
        expiresAt: token.expires_at
      });

      return token;

    } catch (error) {
      this.logger.error('❌ Failed to get current token', {
        error: error.message
      });
      throw error;
    }
  }

  /**
   * Update existing token
   */
  async updateToken(tokenId: number, updates: Partial<TokenData>): Promise<void> {
    try {
      this.logger.log('🔄 Updating token in database', {
        tokenId,
        updateFields: Object.keys(updates)
      });

      const setClause = [];
      const values = [];

      if (updates.access_token) {
        setClause.push('access_token = ?');
        values.push(updates.access_token);
      }

      if (updates.refresh_token) {
        setClause.push('refresh_token = ?');
        values.push(updates.refresh_token);
      }

      if (updates.expires_in) {
        setClause.push('expires_in = ?');
        values.push(updates.expires_in);
      }

      if (updates.expires_at) {
        setClause.push('expires_at = ?');
        values.push(updates.expires_at.toISOString());
      }

      // Always update the updated_at timestamp
      setClause.push('updated_at = ?');
      values.push(new Date().toISOString());

      if (setClause.length === 1) { // Only updated_at
        this.logger.log('ℹ️ No fields to update besides timestamp');
        return;
      }

      values.push(tokenId); // Add tokenId for WHERE clause

      const updateSQL = `
        UPDATE tokens 
        SET ${setClause.join(', ')} 
        WHERE id = ?
      `;

      const result = await this.db.run(updateSQL, values);

      if (result.changes === 0) {
        throw new Error(`No token found with ID: ${tokenId}`);
      }

      this.logger.log('✅ Token updated successfully', {
        tokenId,
        changes: result.changes
      });

    } catch (error) {
      this.logger.error('❌ Failed to update token', {
        error: error.message,
        tokenId
      });
      throw error;
    }
  }

  /**
   * Delete existing tokens for same domain/member
   */
  private async deleteExistingTokens(domain?: string, memberId?: string): Promise<void> {
    try {
      let deleteSQL = 'DELETE FROM tokens WHERE 1=1';
      const params = [];

      if (domain) {
        deleteSQL += ' AND domain = ?';
        params.push(domain);
      }

      if (memberId) {
        deleteSQL += ' AND member_id = ?';
        params.push(memberId);
      }

      if (params.length === 0) {
        return; // No criteria to delete
      }

      const result = await this.db.run(deleteSQL, params);

      if (result.changes > 0) {
        this.logger.log('🗑️ Deleted existing tokens', {
          deletedCount: result.changes,
          domain,
          memberId
        });
      }

    } catch (error) {
      this.logger.error('❌ Failed to delete existing tokens', {
        error: error.message,
        domain,
        memberId
      });
      // Don't throw error here, just log it
    }
  }

  /**
   * Get all tokens (for admin/debug purposes)
   */
  async getAllTokens(): Promise<TokenData[]> {
    try {
      const selectSQL = `
        SELECT * FROM tokens 
        ORDER BY created_at DESC
      `;

      const rows = await this.db.all(selectSQL);

      const tokens: TokenData[] = rows.map(row => ({
        id: row.id,
        access_token: row.access_token,
        refresh_token: row.refresh_token,
        expires_in: row.expires_in,
        expires_at: new Date(row.expires_at),
        domain: row.domain,
        scope: row.scope,
        client_endpoint: row.client_endpoint,
        server_endpoint: row.server_endpoint,
        member_id: row.member_id,
        status: row.status,
        application_token: row.application_token,
        method: row.method,
        created_at: new Date(row.created_at),
        updated_at: new Date(row.updated_at)
      }));

      this.logger.log('📋 Retrieved all tokens', {
        count: tokens.length
      });

      return tokens;

    } catch (error) {
      this.logger.error('❌ Failed to get all tokens', {
        error: error.message
      });
      throw error;
    }
  }

  /**
   * Delete all tokens (for testing/reset purposes)
   */
  async deleteAllTokens(): Promise<number> {
    try {
      const result = await this.db.run('DELETE FROM tokens');
      
      this.logger.log('🗑️ Deleted all tokens', {
        deletedCount: result.changes
      });

      return result.changes;

    } catch (error) {
      this.logger.error('❌ Failed to delete all tokens', {
        error: error.message
      });
      throw error;
    }
  }

  /**
   * Close database connection
   */
  async closeConnection(): Promise<void> {
    if (this.db) {
      await this.db.close();
      this.logger.log('📊 Database connection closed');
    }
  }
}
