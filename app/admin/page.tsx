'use client';

import { useEffect, useState } from 'react';

interface Stats {
  totalQuotations: number;
  totalArea: number;
  avgFeaturesPerQuotation: number;
  topFeatures: Array<{ featureName: string; count: number }>;
  packageDistribution: Array<{ selectedPackage: string; count: number }>;
  serviceTypeDistribution: Array<{ serviceType: string; count: number }>;
}

interface Quotation {
  id: number;
  serviceType: string;
  propertyArea: number;
  fullName: string;
  phoneNumber: string;
  email?: string;
  selectedPackage: string;
  totalFeatures: number;
  status: string;
  createdAt: string;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [quotations, setQuotations] = useState<Quotation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch('/api/quotations/stats');
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        
        if (result.success) {
          setStats(result.stats || {
            totalQuotations: 0,
            totalArea: 0,
            avgFeaturesPerQuotation: 0,
            topFeatures: [],
            packageDistribution: [],
            serviceTypeDistribution: [],
          });
          setQuotations(result.quotations || []);
        } else {
          setError(result.error || 'حدث خطأ غير معروف');
        }
      } catch (err) {
        console.error('Fetch error:', err);
        setError(String(err));
        // Set default empty stats
        setStats({
          totalQuotations: 0,
          totalArea: 0,
          avgFeaturesPerQuotation: 0,
          topFeatures: [],
          packageDistribution: [],
          serviceTypeDistribution: [],
        });
        setQuotations([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div style={{ padding: '40px', textAlign: 'center' }}>
        <h2>جاري التحميل...</h2>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: '40px', textAlign: 'center' }}>
        <h2 style={{ color: 'red' }}>⚠️ خطأ</h2>
        <p>{error}</p>
        <p style={{ fontSize: '12px', color: '#999' }}>جاري محاولة عرض البيانات المتاحة...</p>
      </div>
    );
  }

  if (!stats) {
    return (
      <div style={{ padding: '40px', textAlign: 'center' }}>
        <h2>لا توجد بيانات حتى الآن</h2>
        <p><a href="/" style={{ color: '#2196F3' }}>اذهب للصفحة الرئيسية لإنشاء طلب جديد</a></p>
      </div>
    );
  }

  return (
    <main style={{ padding: '40px', maxWidth: '1400px', margin: '0 auto', direction: 'rtl' }}>
      <h1 style={{ marginBottom: '30px', fontSize: '32px', fontWeight: 'bold' }}>
        📊 لوحة تحكم المشروع
      </h1>

      {/* Stats Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px', marginBottom: '40px' }}>
        <div style={{ background: '#f5f5f5', padding: '25px', borderRadius: '12px', border: '1px solid #e0e0e0' }}>
          <div style={{ fontSize: '14px', color: '#666', marginBottom: '8px' }}>إجمالي الطلبات</div>
          <div style={{ fontSize: '36px', fontWeight: 'bold', color: '#2196F3' }}>{stats.totalQuotations}</div>
        </div>

        <div style={{ background: '#f5f5f5', padding: '25px', borderRadius: '12px', border: '1px solid #e0e0e0' }}>
          <div style={{ fontSize: '14px', color: '#666', marginBottom: '8px' }}>إجمالي المساحة (متر²)</div>
          <div style={{ fontSize: '36px', fontWeight: 'bold', color: '#4CAF50' }}>{stats.totalArea.toLocaleString('ar-SA')}</div>
        </div>

        <div style={{ background: '#f5f5f5', padding: '25px', borderRadius: '12px', border: '1px solid #e0e0e0' }}>
          <div style={{ fontSize: '14px', color: '#666', marginBottom: '8px' }}>متوسط الميزات</div>
          <div style={{ fontSize: '36px', fontWeight: 'bold', color: '#FF9800' }}>{stats.avgFeaturesPerQuotation}</div>
        </div>
      </div>

      {/* Charts */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '20px', marginBottom: '40px' }}>
        {/* Packages Distribution */}
        {stats.packageDistribution && stats.packageDistribution.length > 0 && (
          <div style={{ background: '#fff', padding: '25px', borderRadius: '12px', border: '1px solid #e0e0e0' }}>
            <h3 style={{ marginBottom: '20px', fontSize: '18px', fontWeight: 'bold' }}>توزيع الباقات</h3>
            <div>
              {stats.packageDistribution.map((pkg) => (
                <div key={pkg.selectedPackage} style={{ marginBottom: '15px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                    <span>{pkg.selectedPackage}</span>
                    <span>{pkg.count}</span>
                  </div>
                  <div style={{ height: '8px', background: '#e0e0e0', borderRadius: '4px', overflow: 'hidden' }}>
                    <div
                      style={{
                        height: '100%',
                        width: `${(pkg.count / Math.max(stats.totalQuotations, 1)) * 100}%`,
                        background: '#2196F3',
                        transition: 'width 0.3s ease',
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Service Type Distribution */}
        {stats.serviceTypeDistribution && stats.serviceTypeDistribution.length > 0 && (
          <div style={{ background: '#fff', padding: '25px', borderRadius: '12px', border: '1px solid #e0e0e0' }}>
            <h3 style={{ marginBottom: '20px', fontSize: '18px', fontWeight: 'bold' }}>طرق التواصل</h3>
            <div>
              {stats.serviceTypeDistribution.map((service) => (
                <div key={service.serviceType} style={{ marginBottom: '15px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                    <span>{service.serviceType}</span>
                    <span>{service.count}</span>
                  </div>
                  <div style={{ height: '8px', background: '#e0e0e0', borderRadius: '4px', overflow: 'hidden' }}>
                    <div
                      style={{
                        height: '100%',
                        width: `${(service.count / Math.max(stats.totalQuotations, 1)) * 100}%`,
                        background: '#4CAF50',
                        transition: 'width 0.3s ease',
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Top Features */}
      {stats.topFeatures && stats.topFeatures.length > 0 && (
        <div style={{ background: '#fff', padding: '25px', borderRadius: '12px', border: '1px solid #e0e0e0', marginBottom: '40px' }}>
          <h3 style={{ marginBottom: '20px', fontSize: '18px', fontWeight: 'bold' }}>أكثر 10 ميزات مختارة</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px' }}>
            {stats.topFeatures.map((feature, idx) => (
              <div key={feature.featureName} style={{ padding: '12px', background: '#f9f9f9', borderRadius: '8px', border: '1px solid #f0f0f0' }}>
                <div style={{ fontSize: '12px', color: '#999', marginBottom: '4px' }}>#{idx + 1}</div>
                <div style={{ fontSize: '14px', fontWeight: 'bold', marginBottom: '4px' }}>{feature.featureName}</div>
                <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#FF9800' }}>{feature.count}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recent Quotations */}
      {quotations && quotations.length > 0 && (
        <div style={{ background: '#fff', padding: '25px', borderRadius: '12px', border: '1px solid #e0e0e0' }}>
          <h3 style={{ marginBottom: '20px', fontSize: '18px', fontWeight: 'bold' }}>الطلبات الأخيرة</h3>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid #e0e0e0' }}>
                  <th style={{ padding: '12px', textAlign: 'right', fontWeight: 'bold' }}>الرقم</th>
                  <th style={{ padding: '12px', textAlign: 'right', fontWeight: 'bold' }}>الاسم</th>
                  <th style={{ padding: '12px', textAlign: 'right', fontWeight: 'bold' }}>الهاتف</th>
                  <th style={{ padding: '12px', textAlign: 'right', fontWeight: 'bold' }}>المساحة (م²)</th>
                  <th style={{ padding: '12px', textAlign: 'right', fontWeight: 'bold' }}>الميزات</th>
                  <th style={{ padding: '12px', textAlign: 'right', fontWeight: 'bold' }}>الباقة</th>
                  <th style={{ padding: '12px', textAlign: 'right', fontWeight: 'bold' }}>التاريخ</th>
                </tr>
              </thead>
              <tbody>
                {quotations.map((q) => (
                  <tr key={q.id} style={{ borderBottom: '1px solid #f0f0f0', background: q.id % 2 === 0 ? '#fafafa' : '#fff' }}>
                    <td style={{ padding: '12px', textAlign: 'right' }}>#{q.id}</td>
                    <td style={{ padding: '12px', textAlign: 'right', fontWeight: 'bold' }}>{q.fullName}</td>
                    <td style={{ padding: '12px', textAlign: 'right' }}>{q.phoneNumber}</td>
                    <td style={{ padding: '12px', textAlign: 'right' }}>{q.propertyArea}</td>
                    <td style={{ padding: '12px', textAlign: 'right' }}>
                      <span style={{ background: '#f0f0f0', padding: '4px 8px', borderRadius: '4px' }}>{q.totalFeatures}</span>
                    </td>
                    <td style={{ padding: '12px', textAlign: 'right' }}>{q.selectedPackage}</td>
                    <td style={{ padding: '12px', textAlign: 'right', fontSize: '12px', color: '#999' }}>
                      {new Date(q.createdAt).toLocaleDateString('ar-SA')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {quotations.length === 0 && (
        <div style={{ textAlign: 'center', padding: '40px', background: '#f5f5f5', borderRadius: '8px' }}>
          <p style={{ fontSize: '16px', color: '#999' }}>لا توجد طلبات حتى الآن</p>
          <a href="/" style={{ color: '#2196F3', textDecoration: 'none', marginTop: '10px', display: 'inline-block' }}>
            ← اذهب لإنشاء طلب جديد
          </a>
        </div>
      )}

      <div style={{ marginTop: '40px', textAlign: 'center' }}>
        <a href="/" style={{ color: '#2196F3', textDecoration: 'none', fontSize: '14px' }}>
          ← العودة إلى الصفحة الرئيسية
        </a>
      </div>
    </main>
  );
}

