import { NextRequest, NextResponse } from 'next/server';

type FeatureStat = { featureName: string; count: number };
type PackageCount = { selectedPackage: string; count: number };
type ServiceTypeCount = { serviceType: string; count: number };
type QuotationStats = {
  totalQuotations: number;
  totalArea: number;
  avgFeaturesPerQuotation: number;
  topFeatures: FeatureStat[];
  packageDistribution: PackageCount[];
  serviceTypeDistribution: ServiceTypeCount[];
};

export async function GET(request: NextRequest) {
  try {
    // Try to load database, but provide fallback
    const fallbackStats: QuotationStats = {
      totalQuotations: 0,
      totalArea: 0,
      avgFeaturesPerQuotation: 0,
      topFeatures: [],
      packageDistribution: [
        { selectedPackage: 'الباقة الأساسية', count: 0 },
        { selectedPackage: 'الباقة الاحترافية (PRO)', count: 0 },
      ],
      serviceTypeDistribution: [
        { serviceType: 'واتساب', count: 0 },
        { serviceType: 'الموقع', count: 0 },
      ],
    };

    let stats: QuotationStats = fallbackStats;

    let quotations: any[] = [];

    try {
      const { getQuotationStats, getAllQuotations } = await import('@/lib/db');
      stats = getQuotationStats();
      quotations = getAllQuotations(100, 0);
    } catch (dbError) {
      // Database not available, use empty stats
      console.warn('Database not available, using empty stats:', dbError);
    }

    return NextResponse.json({
      success: true,
      stats,
      quotations,
      pagination: { limit: 100, offset: 0 },
    });
  } catch (error) {
    console.error('Error fetching stats:', error);
    
    // Return fallback data instead of error
    return NextResponse.json({
      success: true,
      stats: {
        totalQuotations: 0,
        totalArea: 0,
        avgFeaturesPerQuotation: 0,
        topFeatures: [] as FeatureStat[],
        packageDistribution: [
          { selectedPackage: 'الباقة الأساسية', count: 0 },
          { selectedPackage: 'الباقة الاحترافية (PRO)', count: 0 },
        ] as PackageCount[],
        serviceTypeDistribution: [
          { serviceType: 'واتساب', count: 0 },
          { serviceType: 'الموقع', count: 0 },
        ] as ServiceTypeCount[],
      },
      quotations: [],
      pagination: { limit: 100, offset: 0 },
    });
  }
}
