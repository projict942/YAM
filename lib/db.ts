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

export function getDB() {
  throw new Error('Database layer is disabled for this Telegram-only setup.');
}

export function saveQuotation() {
  return null as QuotationRecord | null;
}

export function getQuotation() {
  return null as QuotationRecord | null;
}

export function getAllQuotations(_limit = 100, _offset = 0) {
  return [] as QuotationRecord[];
}

export function getQuotationStats() {
  return {
    totalQuotations: 0,
    totalArea: 0,
    avgFeaturesPerQuotation: 0,
    topFeatures: [],
    packageDistribution: [],
    serviceTypeDistribution: [],
  };
}
