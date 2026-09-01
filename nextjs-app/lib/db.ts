import Database from 'better-sqlite3';
import path from 'path';

let db: Database.Database | null = null;

export function getDB() {
  if (!db) {
    const dbPath = path.join(process.cwd(), 'quotations.db');
    db = new Database(dbPath);
    db.pragma('journal_mode = WAL');
    initializeSchema();
  }
  return db;
}

function initializeSchema() {
  if (!db) return;

  db.exec(`
    CREATE TABLE IF NOT EXISTS quotations (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      serviceType TEXT NOT NULL,
      propertyArea REAL NOT NULL,
      roomsData TEXT NOT NULL,
      fullName TEXT NOT NULL,
      phoneNumber TEXT NOT NULL,
      email TEXT,
      selectedPackage TEXT NOT NULL,
      totalFeatures INTEGER NOT NULL,
      status TEXT DEFAULT 'pending',
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
      updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS feature_stats (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      featureName TEXT NOT NULL UNIQUE,
      count INTEGER DEFAULT 0,
      updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);
}

export interface QuotationRecord {
  id: number;
  serviceType: string;
  propertyArea: number;
  roomsData: string;
  fullName: string;
  phoneNumber: string;
  email?: string;
  selectedPackage: string;
  totalFeatures: number;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export function saveQuotation(data: {
  serviceType: string;
  propertyArea: number;
  rooms: any[];
  fullName: string;
  phoneNumber: string;
  email?: string;
  selectedPackage: string;
  totalFeatures: number;
}): QuotationRecord {
  const db = getDB();
  
  const stmt = db.prepare(`
    INSERT INTO quotations (
      serviceType, propertyArea, roomsData, fullName, phoneNumber, email, selectedPackage, totalFeatures
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `);

  const roomsJson = JSON.stringify(data.rooms);
  const result = stmt.run(
    data.serviceType,
    data.propertyArea,
    roomsJson,
    data.fullName,
    data.phoneNumber,
    data.email || null,
    data.selectedPackage,
    data.totalFeatures
  );

  // Update feature stats
  data.rooms.forEach(room => {
    room.selectedFeatures?.forEach((feature: string) => {
      const statsStmt = db.prepare(`
        INSERT INTO feature_stats (featureName, count)
        VALUES (?, 1)
        ON CONFLICT(featureName) DO UPDATE SET count = count + 1, updatedAt = CURRENT_TIMESTAMP
      `);
      statsStmt.run(feature);
    });
  });

  return getQuotation(result.lastInsertRowid as number)!;
}

export function getQuotation(id: number): QuotationRecord | null {
  const db = getDB();
  const stmt = db.prepare('SELECT * FROM quotations WHERE id = ?');
  return stmt.get(id) as QuotationRecord | null;
}

export function getAllQuotations(limit = 100, offset = 0): QuotationRecord[] {
  const db = getDB();
  const stmt = db.prepare('SELECT * FROM quotations ORDER BY createdAt DESC LIMIT ? OFFSET ?');
  return stmt.all(limit, offset) as QuotationRecord[];
}

export function getQuotationStats() {
  const db = getDB();
  
  const totalCount = db.prepare('SELECT COUNT(*) as count FROM quotations').get() as { count: number };
  const totalArea = db.prepare('SELECT SUM(propertyArea) as total FROM quotations').get() as { total: number };
  const avgFeatures = db.prepare('SELECT AVG(totalFeatures) as avg FROM quotations').get() as { avg: number };
  
  const topFeatures = db.prepare(`
    SELECT featureName, count FROM feature_stats ORDER BY count DESC LIMIT 10
  `).all() as Array<{ featureName: string; count: number }>;

  const packageCounts = db.prepare(`
    SELECT selectedPackage, COUNT(*) as count FROM quotations GROUP BY selectedPackage
  `).all() as Array<{ selectedPackage: string; count: number }>;

  const serviceTypeCounts = db.prepare(`
    SELECT serviceType, COUNT(*) as count FROM quotations GROUP BY serviceType
  `).all() as Array<{ serviceType: string; count: number }>;

  return {
    totalQuotations: totalCount.count,
    totalArea: totalArea.total || 0,
    avgFeaturesPerQuotation: Math.round((avgFeatures.avg || 0) * 100) / 100,
    topFeatures,
    packageDistribution: packageCounts,
    serviceTypeDistribution: serviceTypeCounts,
  };
}
