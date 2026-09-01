"use client";

import { useMemo, useState } from 'react';

type FeatureGroup = {
  title: string;
  icon: string;
  items: { id: string; title: string; description: string; icon: string }[];
};

const houseTypes = [
  { id: 'apartment', title: 'شقة', description: 'حلول ذكية للمساحات الوسطية', icon: 'apartment' },
  { id: 'villa', title: 'فيلا', description: 'تجربة فاخرة وتكامل كامل', icon: 'villa' },
  { id: 'duplex', title: 'دبلكس', description: 'أتمتة متعددة الطبقات', icon: 'home' },
  { id: 'office', title: 'مكتب', description: 'تحكم رقمي ذكي للبيئة', icon: 'business' },
];

const roomOptions = [
  { id: 'living', title: 'غرفة المعيشة', details: 'إضاءة + صوت + أتمتة', icon: 'chair' },
  { id: 'bedroom', title: 'غرفة النوم', details: 'تكييف + إضاءة + سلامة', icon: 'bed' },
  { id: 'kitchen', title: 'المطبخ', details: 'أجهزة ذكية + عزل تحكم', icon: 'kitchen' },
  { id: 'garden', title: 'الحديقة', details: 'إضاءة + مراقبة + سيناريوهات', icon: 'yard' },
  { id: 'security', title: 'الأمن', details: 'كاميرات + بوابات + تنبيهات', icon: 'security' },
  { id: 'parking', title: 'المرآب', details: 'أتمتة دخول + إضاءة ذكية', icon: 'garage' },
];

const featureGroups: FeatureGroup[] = [
  {
    title: 'التحكم',
    icon: 'smart_toy',
    items: [
      { id: 'lighting', title: 'الإضاءة الذكية', description: 'إضاءة تلقائية بكل غرفة', icon: 'light_mode' },
      { id: 'temperatures', title: 'التحكم في الحرارة', description: 'تكييف متوازن وفعال', icon: 'thermostat' },
      { id: 'voice', title: 'التحكم الصوتي', description: 'تفاعل سهل مع Alexa و Google', icon: 'mic' },
      { id: 'scenes', title: 'السيناريوهات', description: 'إضاءة + أمان + موسيقى', icon: 'movie' },
    ],
  },
  {
    title: 'الأمان',
    icon: 'security',
    items: [
      { id: 'cameras', title: 'كاميرات ذكية', description: 'مراقبة لحظية ومتابعة', icon: 'videocam' },
      { id: 'finger', title: 'فتح ذكي', description: 'بوابات + قفل ذكي', icon: 'fingerprint' },
      { id: 'alerts', title: 'تنبيهات فورية', description: 'إشعارات ذكية في أي وقت', icon: 'notifications_active' },
      { id: 'motion', title: 'كشف الحركة', description: 'استجابة فورية للمخاطر', icon: 'motion_photos_auto' },
    ],
  },
  {
    title: 'التوفير',
    icon: 'bolt',
    items: [
      { id: 'energy', title: 'تقليل استهلاك الكهرباء', description: 'أتمتة ذكية وفعالة', icon: 'energy_savings_leaf' },
      { id: 'automation', title: 'تلقائي بالكامل', description: 'تنفيذ حسب الوقت والطقس', icon: 'auto_awesome' },
      { id: 'analytics', title: 'تقارير يومية', description: 'معرفة أفضل استخدام للمنزل', icon: 'analytics' },
      { id: 'backup', title: 'نسخ احتياطي', description: 'استعادة سريعة عند الحاجة', icon: 'backup' },
    ],
  },
];

const defaultSelections = {
  houseType: 'villa',
  rooms: ['living', 'bedroom'],
  features: ['lighting', 'cameras'],
  size: '180',
  guests: '5',
};

export default function PageOriginal() {
  const [step, setStep] = useState(1);
  const [selectedHouseType, setSelectedHouseType] = useState(defaultSelections.houseType);
  const [selectedRooms, setSelectedRooms] = useState<string[]>(defaultSelections.rooms);
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>(defaultSelections.features);
  const [size, setSize] = useState(defaultSelections.size);
  const [guests, setGuests] = useState(defaultSelections.guests);
  const [submitted, setSubmitted] = useState(false);

  const progress = useMemo(() => `${Math.min((step / 4) * 100, 100)}%`, [step]);

  const handleToggleRoom = (roomId: string) => {
    setSelectedRooms((prev) =>
      prev.includes(roomId) ? prev.filter((item) => item !== roomId) : [...prev, roomId],
    );
  };

  const handleToggleFeature = (featureId: string) => {
    setSelectedFeatures((prev) =>
      prev.includes(featureId) ? prev.filter((item) => item !== featureId) : [...prev, featureId],
    );
  };

  const nextStep = () => setStep((previous) => Math.min(previous + 1, 4));
  const prevStep = () => setStep((previous) => Math.max(previous - 1, 1));

  const completedRooms = selectedRooms.length;
  const completedFeatures = selectedFeatures.length;

  return (
    <main className="page-shell">
      <div className="orb orb-one" />
      <div className="orb orb-two" />
      <div className="orb orb-three" />

      <div className="quotation-app">
        <aside className="visual-panel">
          <div className="panel-badge">Home Nexus</div>
          <h1>حلول ذكية للمنزل</h1>
          <p>صمم منزلك الذكي بخيارات مرنة، أمان متقدم، وتجربة تحكم سهلة تناسب أسلوب حياتك.</p>

          <div className="hero-visual">
            <img
              src="https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=900&q=80"
              alt="Modern smart home"
            />
          </div>

          <div className="mini-stat-grid">
            <div className="mini-stat">
              <span className="material-symbols-rounded">speed</span>
              <div>
                <strong>+1200</strong>
                <small>تثبيت ناجح</small>
              </div>
            </div>
            <div className="mini-stat">
              <span className="material-symbols-rounded">security</span>
              <div>
                <strong>24/7</strong>
                <small>مراقبة</small>
              </div>
            </div>
          </div>

          <ul className="feature-list">
            <li><span className="material-symbols-rounded">check_circle</span> أتمتة متكاملة داخل المنزل</li>
            <li><span className="material-symbols-rounded">check_circle</span> دعم فني على مدار الساعة</li>
            <li><span className="material-symbols-rounded">check_circle</span> سيناريوهات ذكية حسب الوقت</li>
          </ul>
        </aside>

        <section className="wizard-panel">
          <div className="wizard-header">
            <div>
              <span className="eyebrow">تكوين الطلب</span>
              <h2>ابدأ بتصميم منزلك الذكي</h2>
            </div>
            <div className="step-badge">0{step}/04</div>
          </div>

          <div className="progress-track">
            <div className="progress-bar" style={{ width: progress }} />
          </div>

          {step === 1 && (
            <div className="step-block">
              <div className="step-head">
                <span className="step-eyebrow">الخطوة 1</span>
                <h3>اختر نوع العقار</h3>
                <p>قم باختيار هيكل المنزل أو المكتب الذي ترغب في أتمتته.</p>
              </div>

              <div className="option-grid">
                {houseTypes.map((type) => (
                  <button
                    key={type.id}
                    type="button"
                    className={`option-card ${selectedHouseType === type.id ? 'active' : ''}`}
                    onClick={() => setSelectedHouseType(type.id)}
                  >
                    <span className="option-icon material-symbols-rounded">{type.icon}</span>
                    <span className="option-copy">
                      <strong>{type.title}</strong>
                      <small>{type.description}</small>
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="step-block">
              <div className="step-head">
                <span className="step-eyebrow">الخطوة 2</span>
                <h3>اختر الغرف التي تريد أتمتتها</h3>
                <p>كل غرفة يمكن أن يكون لها سيناريوهات وأجهزة خاصة بها.</p>
              </div>

              <div className="counter-grid">
                {roomOptions.map((room) => {
                  const active = selectedRooms.includes(room.id);
                  return (
                    <button
                      key={room.id}
                      type="button"
                      className={`counter-row ${active ? 'filled' : ''}`}
                      onClick={() => handleToggleRoom(room.id)}
                    >
                      <span>{room.title}</span>
                      <div className="counter-controls">
                        <span className="material-symbols-rounded">{room.icon}</span>
                        <strong>{active ? 1 : 0}</strong>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="step-block">
              <div className="step-head">
                <span className="step-eyebrow">الخطوة 3</span>
                <h3>اختر المزايا التي تهمك</h3>
                <p>حدد ما تريد أن يركز عليه النظام داخل منزلك أو مكتبك.</p>
              </div>

              <div className="room-list">
                {featureGroups.map((group) => (
                  <div key={group.title} className="room-panel expanded">
                    <button type="button" className="room-header">
                      <span className="material-symbols-rounded">{group.icon}</span>
                      <span className="room-title">{group.title}</span>
                      <span className="room-count">{group.items.length}</span>
                      <span className="feature-pill">مزايا</span>
                    </button>

                    <div className="room-body">
                      <div className="feature-group">
                        <div className="feature-grid">
                          {group.items.map((feature) => {
                            const chosen = selectedFeatures.includes(feature.id);
                            return (
                              <button
                                key={feature.id}
                                type="button"
                                className={`feature-item ${chosen ? 'selected' : ''}`}
                                onClick={() => handleToggleFeature(feature.id)}
                              >
                                <span className="feature-icon material-symbols-rounded">{feature.icon}</span>
                                <span className="feature-content">
                                  <strong>{feature.title}</strong>
                                  <small>{feature.description}</small>
                                </span>
                                <input type="checkbox" checked={chosen} readOnly />
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="step-block">
              <div className="step-head">
                <span className="step-eyebrow">الخطوة 4</span>
                <h3>أكمل بيانات المشروع</h3>
                <p>نحتاج بعض المعلومات البسيطة حتى نرسل لك العرض الأنسب لك.</p>
              </div>

              <div className="input-wrap">
                <label htmlFor="size">مساحة العقار</label>
                <input id="size" value={size} onChange={(event) => setSize(event.target.value)} placeholder="مثال: 180 متر مربع" />
              </div>

              <div className="input-wrap">
                <label htmlFor="guests">عدد الأفراد</label>
                <input id="guests" value={guests} onChange={(event) => setGuests(event.target.value)} placeholder="مثال: 5" />
              </div>
            </div>
          )}

          {submitted && (
            <div className="step-block success-panel">
              <div className="success-icon material-symbols-rounded">check_circle</div>
              <h3>تم إرسال طلبك بنجاح</h3>
              <p>سيتواصل معك فريقنا في أقرب وقت لتأكيد تفاصيل المشروع.</p>
            </div>
          )}

          {!submitted && (
            <div className="footer-actions">
              <button
                type="button"
                className="btn btn-outline"
                onClick={prevStep}
                disabled={step === 1}
                style={{ opacity: step === 1 ? 0.45 : 1, cursor: step === 1 ? 'not-allowed' : 'pointer' }}
              >
                رجوع
              </button>

              {step < 4 ? (
                <button type="button" className="btn btn-primary" onClick={nextStep}>
                  التالي
                </button>
              ) : (
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={() => setSubmitted(true)}
                >
                  إرسال الطلب
                </button>
              )}
            </div>
          )}

          <div className="validation-box" style={{ display: step === 2 ? 'block' : 'none' }}>
            تم تحديد {completedRooms} غرفة من 6 غرف
          </div>

          <div className="validation-box" style={{ display: step === 3 ? 'block' : 'none' }}>
            تم تحديد {completedFeatures} ميزة من قائمة المزايا
          </div>
        </section>
      </div>
    </main>
  );
}
