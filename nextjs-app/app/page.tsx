"use client";

import { useMemo, useState } from 'react';

type SubFeatureItem = {
  id: string;
  title: string;
  description: string;
  icon: string;
};

type RoomModel = {
  id: string;
  name: string;
  count: number;
  selectedSubFeatures: Record<string, Record<string, number>>;
};

const categoryMetadata: Record<string, { title: string; icon: string }> = {
  security: { title: 'الأمان والتحكم بالدخول', icon: 'security' },
  voice: { title: 'المساعد الصوتي والتحكم', icon: 'record_voice_over' },
  lighting: { title: 'الإضاءة الذكية والسيناريوهات', icon: 'lightbulb' },
  climate: { title: 'التكييف والحرارة', icon: 'ac_unit' },
  shutters: { title: 'الستائر والشبابيك الذكية', icon: 'curtains' },
  audio: { title: 'النظام الصوتي وتوزيع الصوت', icon: 'volume_up' },
  networking: { title: 'الشبكة والإنترنت', icon: 'wifi' },
  power: { title: 'إدارة الطاقة والمقابس', icon: 'power' },
  intercom: { title: 'الانتركم المرئي والباب', icon: 'meeting_room' },
  automation: { title: 'السيناريوهات التلقائية', icon: 'auto_mode' },
};

const systemFeatureCatalog: Record<string, SubFeatureItem[]> = {
  security: [
    { id: 'smart_lock', title: 'قفل ذكي (Smart Lock)', description: 'بصمة، كارت، كود، وتطبيق موبايل', icon: 'lock' },
    { id: 'ext_cam', title: 'كاميرات خارجية (Outdoor IP)', description: 'رؤية ليلية وتنبيهات ذكية', icon: 'videocam' },
    { id: 'int_cam', title: 'كاميرات داخلية (Indoor IP)', description: 'تغطية داخلية مع خصوصية كاملة', icon: 'camera' },
    { id: 'motion_sensor', title: 'حساسات حركة (Motion)', description: 'كشف الحركة والتنبيه الفوري', icon: 'sensors' },
    { id: 'safety_sensors', title: 'حساسات سلامة (دخان/غاز/ماء)', description: 'إنذار مبكر للتسريبات والحرائق', icon: 'warning' },
    { id: 'door_sensor', title: 'حساسات فتح الأبواب والشبابيك', description: 'مراقبة حالة الفتح والإغلاق', icon: 'door_front' },
  ],
  voice: [
    { id: 'alexa_speakers', title: 'أجهزة Amazon Alexa', description: 'شاشات وسماعات ذكية للأوامر الصوتية', icon: 'speaker_group' },
    { id: 'apple_siri', title: 'ربط Apple HomeKit & Siri', description: 'تحكم صوتي كامل لعشاق أبل', icon: 'smartphone' },
    { id: 'google_assistant', title: 'ربط Google Assistant', description: 'دعم كامل لأجهزة أندرويد', icon: 'assistant' },
    { id: 'voice_scenes', title: 'سيناريوهات صوتية مخصصة', description: 'تفعيل أوضاع مثل "Alexa, Cinema"', icon: 'equalizer' },
  ],
  lighting: [
    { id: 'touch_switches', title: 'مفاتيح لمس ذكية (Touch)', description: 'تصميم زجاجي عصري 1, 2, 3 زر', icon: 'touch_app' },
    { id: 'dimmers', title: 'مفاتيح التعتيم (Dimmer)', description: 'التحكم في درجة وقوة الإضاءة', icon: 'brightness_6' },
    { id: 'rgb_strip', title: 'التحكم في ألوان LED & RGB', description: 'بيت نور ملون وإضاءة ديكورية', icon: 'palette' },
    { id: 'presence_sensor', title: 'حساسات وجود تلقائية', description: 'تشغيل النور عند الدخول وإطفائه فور الخروج', icon: 'directions_walk' },
  ],
  climate: [
    { id: 'smart_thermostat', title: 'ثرموستات ذكي (Central AC)', description: 'للتكييفات المركزية والكونسيلد', icon: 'device_thermostat' },
    { id: 'ir_blaster', title: 'متحكم IR للتكييفات السبلت', description: 'تحكم في التكييف العادي عبر الموبايل', icon: 'ac_unit' },
    { id: 'ac_scheduling', title: 'جدولة الحرارة التلقائية', description: 'ضبط درجة الحرارة التلقائي للنوم والوصول', icon: 'schedule' },
  ],
  shutters: [
    { id: 'curtain_motor', title: 'موتور الستائر القماش', description: 'تحكم كهربائي بالريموت والموبايل', icon: 'curtains' },
    { id: 'shutter_switch', title: 'مفتاح الشتر الألومنيوم', description: 'تحكم في الشتر الخارجي للشبابيك', icon: 'window' },
    { id: 'sun_sync', title: 'المزامنة الذكية مع الشمس', description: 'غلق الستائر أوتوماتيكياً في الحر الشديد', icon: 'wb_sunny' },
  ],
  audio: [
    { id: 'ceiling_speakers', title: 'سماعات سقفية مخفية', description: 'جودة صوت نقية داخل الجبس بورد', icon: 'surround_sound' },
    { id: 'audio_amp', title: 'مكبر صوت ذكي (Amplifier)', description: 'يدعم Wi-Fi, Bluetooth, AirPlay', icon: 'speaker' },
    { id: 'wall_audio_panel', title: 'شاشة تحكم جدارية للصوت', description: 'لوحة لمس جدارية لإدارة تشغيل الصوتيات', icon: 'album' },
  ],
  networking: [
    { id: 'wifi_mesh', title: 'موزعات شبكة (Wi-Fi 6 Mesh)', description: 'تغطية إنترنت فائقة بدون مناطق ميتة', icon: 'wifi' },
    { id: 'network_rack', title: 'راك كابينة تجميع الشبكة', description: 'تنظيم السويتشات والكابلات باحترافية', icon: 'dns' },
    { id: 'poe_switch', title: 'سويتش شبكة PoE مع كابلات CAT6', description: 'تغذية وتوصيل الكاميرات والأجهزة', icon: 'settings_ethernet' },
  ],
  power: [
    { id: 'smart_sockets', title: 'مقابس ذكية (Smart Plugs)', description: 'فيشات ذكية للأجهزة الدفيئة وأجهزة القهوة', icon: 'power' },
    { id: 'energy_monitor', title: 'مراقب استهلاك الكهرباء', description: 'تقارير فورية لقياس استهلاك الكيلووات', icon: 'electric_meter' },
    { id: 'smart_breakers', title: 'قواطع كهربائية ذكية', description: 'فحص وفصل الدوائر الكهربائية عن بعد', icon: 'electric_bolt' },
  ],
  intercom: [
    { id: 'video_intercom', title: 'انتركم مرئي ذكي (Smart Video)', description: 'رد على الزوار وتحدث معهم من الموبايل', icon: 'videocam' },
    { id: 'door_station', title: 'وحدة خارجية بكاميرا و NFC', description: 'دخول بكروت NFC وتشفير عالي', icon: 'badge' },
    { id: 'touch_screen_indoor', title: 'شاشة لمس داخلية للبيت', description: 'شاشة 7/10 بوصة لعرض الكاميرات والباب', icon: 'monitor' },
  ],
  automation: [
    { id: 'home_away_mode', title: 'سيناريو المغادرة/الوصول', description: 'إطفاء كل الأنوار وتفعيل الأمان بضغطة زر', icon: 'route' },
    { id: 'cinema_mode', title: 'سيناريو الرخاء والسينما', description: 'تعتيم النور، خفض الستائر، وتشغيل الصوتيات', icon: 'movie_filter' },
    { id: 'smart_irrigation', title: 'الري الذكي وجودة الهواء', description: 'محبس مياه ذكي وحساسات رطوبة وتلوث', icon: 'water_drop' },
  ],
};

const initialRooms: RoomModel[] = [
  { id: 'living', name: 'غرفة المعيشة', count: 1, selectedSubFeatures: {} },
  { id: 'master_bed', name: 'غرفة النوم الرئيسية', count: 1, selectedSubFeatures: {} },
  { id: 'bed', name: 'غرفة نوم فرعية', count: 2, selectedSubFeatures: {} },
  { id: 'bath', name: 'حمام', count: 2, selectedSubFeatures: {} },
  { id: 'kitchen', name: 'المطبخ', count: 1, selectedSubFeatures: {} },
  { id: 'reception', name: 'صالون / ريسبشن', count: 1, selectedSubFeatures: {} },
  { id: 'garden', name: 'الحديقة / التراس', count: 0, selectedSubFeatures: {} },
];

const serviceOptions = [
  { id: 'whatsapp', title: 'واتساب', subtitle: 'استلام العرض وتفاصيله فوراً عبر WhatsApp', icon: 'chat_bubble_outline' },
  { id: 'website', title: 'الموقع', subtitle: 'استعراض الحساب المباشر هنا في الموقع', icon: 'language' },
];

const packageOptions = [
  { id: 'standard', title: 'الباقة الأساسية', subtitle: 'تغطي الاحتياجات الأساسية للتحكم الذكي', icon: 'star_outline' },
  { id: 'pro', title: 'الباقة الاحترافية (PRO)', subtitle: 'تحكم شامل وكامل بكل الأجهزة والأنظمة', icon: 'auto_awesome' },
];

const totalSteps = 7;

const formatCurrency = (value: number) =>
  new Intl.NumberFormat('ar-EG', {
    style: 'currency',
    currency: 'EGP',
    maximumFractionDigits: 0,
  }).format(value);

const getAutomaticReply = (message: string) => {
  const normalizedMessage = message.toLowerCase();

  if (normalizedMessage.includes('سعر') || normalizedMessage.includes('تكلف') || normalizedMessage.includes('فلوس')) {
    return 'تقدر تشوف التكلفة التقديرية مباشرة من خطوة الباقة، والسعر بيتغير حسب المساحة وعدد الغرف والأجهزة المختارة.';
  }

  if (normalizedMessage.includes('كاميرا') || normalizedMessage.includes('أمان') || normalizedMessage.includes('قفل')) {
    return 'نوفر كاميرات داخلية وخارجية، حساسات حركة، حساسات أمان، وأقفال ذكية. اختار العدد المطلوب لكل غرفة من خطوة الأجهزة.';
  }

  if (normalizedMessage.includes('باقة') || normalizedMessage.includes('pro') || normalizedMessage.includes('احتراف')) {
    return 'الباقة الأساسية مناسبة للاحتياجات اليومية، والباقة الاحترافية تشمل تحكمًا أوسع في الأنظمة والسيناريوهات.';
  }

  if (normalizedMessage.includes('تواصل') || normalizedMessage.includes('واتساب') || normalizedMessage.includes('رقم')) {
    return 'يمكنك التواصل معنا على واتساب من خلال الرقم +201116660532، وفريق YAM هيرد عليك بأقرب وقت.';
  }

  if (normalizedMessage.includes('مساح') || normalizedMessage.includes('غرف')) {
    return 'أدخل مساحة العقار وحدد عدد الغرف، وبعدها اختار الأجهزة المطلوبة لكل غرفة للحصول على تقدير أدق.';
  }

  return 'وصلت رسالتك. اسألني عن الأسعار، الكاميرات، الباقات، أو طريقة التواصل مع فريق YAM.';
};

export default function Page() {
  const [step, setStep] = useState(1);
  const [serviceType, setServiceType] = useState('whatsapp');
  const [propertyArea, setPropertyArea] = useState('180');
  const [rooms, setRooms] = useState<RoomModel[]>(initialRooms);
  const [fullName, setFullName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [email, setEmail] = useState('');
  const [selectedPackage, setSelectedPackage] = useState('standard');
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [validationMessage, setValidationMessage] = useState<string | null>(null);
  const [expandedRoomId, setExpandedRoomId] = useState<string | null>('living');
  const [chatOpen, setChatOpen] = useState(false);
  const [chatInput, setChatInput] = useState('');
  const [chatMessages, setChatMessages] = useState([
    { id: 1, sender: 'bot', text: 'مرحباً، كيف يمكننا المساعدة في مشروعك الذكي؟' },
    { id: 2, sender: 'bot', text: 'يمكنك مراجعة الأسعار الفورية وتحديد الباقة المناسبة في أقل وقت.' },
  ]);

  const progress = useMemo(() => `${Math.min((step / totalSteps) * 100, 100)}%`, [step]);

  const activeRooms = rooms.filter((room) => room.count > 0);
  const totalSelectedFeatures = rooms.reduce(
    (acc, room) =>
      acc +
      Object.values(room.selectedSubFeatures).reduce(
        (sum, itemMap) => sum + Object.values(itemMap).reduce((innerSum, quantity) => innerSum + quantity, 0),
        0,
      ),
    0,
  );

  const estimatedPrice = useMemo(() => {
    const area = Number(propertyArea) || 0;
    const packageMultiplier = selectedPackage === 'pro' ? 1.42 : 1;
    const basePrice = area * 22 + activeRooms.length * 520 + totalSelectedFeatures * 180;
    const serviceFee = serviceType === 'whatsapp' ? 120 : 80;
    return Math.round((basePrice + serviceFee) * packageMultiplier);
  }, [propertyArea, activeRooms.length, totalSelectedFeatures, selectedPackage, serviceType]);

  const nextStep = () => {
    if (step === 2 && (!propertyArea || Number(propertyArea) <= 0)) {
      setValidationMessage('يرجى إدخال مساحة العقار بشكل صحيح.');
      return;
    }

    if (step === 5 && (!fullName.trim() || !phoneNumber.trim())) {
      setValidationMessage('برجاء كتابة الاسم ورقم الهاتف على الأقل.');
      return;
    }

    setValidationMessage(null);
    setStep((prev) => Math.min(prev + 1, totalSteps));
  };

  const prevStep = () => setStep((prev) => Math.max(prev - 1, 1));

  const updateRoomCount = (roomId: string, delta: number) => {
    setRooms((prev) =>
      prev.map((room) =>
        room.id === roomId
          ? { ...room, count: Math.max(0, room.count + delta) }
          : room,
      ),
    );
  };

  const toggleSubFeature = (roomId: string, categoryKey: string, subFeatureId: string) => {
    setRooms((prev) =>
      prev.map((room) => {
        if (room.id !== roomId) return room;

        const categoryMap = { ...(room.selectedSubFeatures[categoryKey] ?? {}) };
        const currentQuantity = categoryMap[subFeatureId] ?? 0;

        if (currentQuantity > 0) {
          delete categoryMap[subFeatureId];
        } else {
          categoryMap[subFeatureId] = 1;
        }

        return {
          ...room,
          selectedSubFeatures: {
            ...room.selectedSubFeatures,
            [categoryKey]: categoryMap,
          },
        };
      }),
    );
  };

  const adjustFeatureQuantity = (roomId: string, categoryKey: string, subFeatureId: string, delta: number) => {
    setRooms((prev) =>
      prev.map((room) => {
        if (room.id !== roomId) return room;

        const categoryMap = { ...(room.selectedSubFeatures[categoryKey] ?? {}) };
        const currentQuantity = categoryMap[subFeatureId] ?? 0;
        const nextQuantity = Math.max(0, currentQuantity + delta);

        if (nextQuantity === 0) {
          delete categoryMap[subFeatureId];
        } else {
          categoryMap[subFeatureId] = nextQuantity;
        }

        return {
          ...room,
          selectedSubFeatures: {
            ...room.selectedSubFeatures,
            [categoryKey]: categoryMap,
          },
        };
      }),
    );
  };

  const sendChatMessage = () => {
    const trimmed = chatInput.trim();
    if (!trimmed) return;

    setChatMessages((previous) => [...previous, { id: Date.now(), sender: 'user', text: trimmed }]);
    setChatInput('');

    setTimeout(() => {
      setChatMessages((previous) => [
        ...previous,
        {
          id: Date.now() + 1,
          sender: 'bot',
          text: getAutomaticReply(trimmed),
        },
      ]);
    }, 700);
  };

  const downloadPdfSummary = () => {
    const summaryWindow = window.open('', '_blank', 'noopener,noreferrer');
    if (!summaryWindow) {
      window.alert('يحتاج المتصفح للسماح بفتح نافذة جديدة لحفظ الملف.');
      return;
    }

    const packageLabel = selectedPackage === 'pro' ? 'احترافية' : 'أساسية';
    const summaryHtml = `
      <!doctype html>
      <html lang="ar" dir="rtl">
        <head>
          <meta charset="UTF-8" />
          <title>ملخص الطلب</title>
          <style>
            body { font-family: Arial, sans-serif; background: #f4f7ff; padding: 36px; color: #101828; }
            .card { background: white; border-radius: 20px; padding: 28px; box-shadow: 0 14px 30px rgba(17,24,39,0.06); }
            .tag { display: inline-block; background: #e8f0ff; color: #143a87; padding: 8px 12px; border-radius: 999px; font-size: 12px; font-weight: 700; }
            h1 { font-size: 30px; color: #143a87; margin: 16px 0 8px; }
            .price { font-size: 32px; font-weight: 800; color: #1c4ec8; margin: 18px 0; }
            .row { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #edf2ff; font-size: 15px; }
          </style>
        </head>
        <body>
          <div class="card">
            <div class="tag">YAM</div>
            <h1>ملخص الطلب</h1>
            <div class="price">${formatCurrency(estimatedPrice)}</div>
            <div class="row"><span>طريقة التواصل</span><strong>${serviceOptions.find((option) => option.id === serviceType)?.title ?? 'واتساب'}</strong></div>
            <div class="row"><span>المساحة</span><strong>${propertyArea || 0} م²</strong></div>
            <div class="row"><span>عدد الغرف</span><strong>${activeRooms.length}</strong></div>
            <div class="row"><span>الميزات المختارة</span><strong>${totalSelectedFeatures}</strong></div>
            <div class="row"><span>الباقة</span><strong>${packageLabel}</strong></div>
            <div class="row"><span>الاسم</span><strong>${fullName || 'غير محدد'}</strong></div>
          </div>
        </body>
      </html>
    `;

    summaryWindow.document.write(summaryHtml);
    summaryWindow.document.close();
    summaryWindow.focus();
    setTimeout(() => summaryWindow.print(), 300);
  };

  const submitRequest = async () => {
    setValidationMessage(null);
    setIsLoading(true);

    try {
      // Build the rooms data with selected features and quantities
      const roomsData = rooms
        .filter((room) => room.count > 0)
        .map((room) => {
          const features: string[] = [];
          Object.entries(room.selectedSubFeatures).forEach(([key, selectedMap]) => {
            const cat = systemFeatureCatalog[key] || [];
            Object.entries(selectedMap).forEach(([id, quantity]) => {
              const feature = cat.find((item) => item.id === id);
              if (feature && quantity > 0) {
                features.push(`${feature.title} × ${quantity}`);
              }
            });
          });
          return { id: room.id, name: room.name, count: room.count, selectedFeatures: features };
        });

      // Send to Telegram
      await fetch('/api/send-to-telegram', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          serviceType: serviceOptions.find(o => o.id === serviceType)?.title || serviceType,
          propertyArea: Number(propertyArea),
          rooms: roomsData,
          fullName,
          phoneNumber,
          email,
          selectedPackage: packageOptions.find(o => o.id === selectedPackage)?.title || selectedPackage,
          totalFeatures: totalSelectedFeatures,
        }),
      });

      await new Promise(r => setTimeout(r, 900));
      setIsLoading(false);
      setIsSubmitted(true);
      setStep(7);
    } catch (err) {
      console.error('Error:', err);
      setIsLoading(false);
      setValidationMessage('حدث خطأ أثناء إرسال الطلب');
    }
  };

  return (
    <main className="page-shell">
      <div className="orb orb-one" />
      <div className="orb orb-two" />
      <div className="orb orb-three" />

      <div className="quotation-app">
        <section className="wizard-panel">
          <div className="wizard-header">
            <div>
              <span className="eyebrow">تكوين الطلب</span>
              <h2>ابدأ بتصميم منزلك الذكي</h2>
            </div>
            <div className="header-branding">
              <span className="brand-pill">YAM</span>
              <span className="step-badge">0{step}/0{totalSteps}</span>
            </div>
          </div>

          <div className="progress-track">
            <div className="progress-bar" style={{ width: progress }} />
          </div>

          {validationMessage && (
            <div className="validation-box" style={{ display: 'block', marginTop: 18 }}>
              {validationMessage}
            </div>
          )}

          {isLoading ? (
            <div className="loading-box">
              <div className="spinner" />
            </div>
          ) : isSubmitted && step === 7 ? (
            <div className="step-block success-panel">
              <div className="success-icon material-symbols-rounded">check_circle</div>
              <h3>تم إرسال طلبك بنجاح</h3>
              <p>شكرًا لتواصلك معنا. تم حفظ بيانات طلبك وسيتم التواصل معك قريبًا.</p>
            </div>
          ) : (
            <div className="step-block">
              {step === 1 && (
                <>
                  <div className="step-head">
                    <span className="step-eyebrow">الخطوة 1 من 7</span>
                    <h3>اختر طريقة التواصل</h3>
                    <p>حدد القناة المناسبة لاستلام عرض السعر التفاعلي.</p>
                  </div>
                  <div className="option-grid" style={{ marginTop: 22 }}>
                    {serviceOptions.map((option) => (
                      <button
                        key={option.id}
                        type="button"
                        className={`option-card ${serviceType === option.id ? 'active' : ''}`}
                        onClick={() => setServiceType(option.id)}
                      >
                        <span className="option-icon material-symbols-rounded">{option.icon}</span>
                        <span className="option-copy">
                          <strong>{option.title}</strong>
                          <small>{option.subtitle}</small>
                        </span>
                      </button>
                    ))}
                  </div>
                </>
              )}

              {step === 2 && (
                <>
                  <div className="step-head">
                    <span className="step-eyebrow">الخطوة 2 من 7</span>
                    <h3>تفاصيل العقار والمساحة</h3>
                    <p>أدخل المساحة الإجمالية بالمتر المربع لمساعدتنا في التقدير.</p>
                  </div>
                  <div className="input-wrap" style={{ marginTop: 28 }}>
                    <label htmlFor="propertyArea">المساحة بالمتر المربع (m²)</label>
                    <input
                      id="propertyArea"
                      type="number"
                      value={propertyArea}
                      onChange={(event) => setPropertyArea(event.target.value)}
                      placeholder="مثال: 180"
                    />
                  </div>
                </>
              )}

              {step === 3 && (
                <>
                  <div className="step-head">
                    <span className="step-eyebrow">الخطوة 3 من 7</span>
                    <h3>توزيع الغرف</h3>
                    <p>حدد عدد الغرف والمساحات المتاحة في العقار.</p>
                  </div>
                  <div className="counter-grid" style={{ marginTop: 20 }}>
                    {rooms.map((room) => (
                      <div key={room.id} className="counter-row filled" style={{ justifyContent: 'space-between', padding: '12px 14px' }}>
                        <span>{room.name}</span>
                        <div className="counter-controls">
                          <button type="button" onClick={() => updateRoomCount(room.id, -1)} className="material-symbols-rounded" style={{ fontSize: '20px' }}>remove</button>
                          <strong>{room.count}</strong>
                          <button type="button" onClick={() => updateRoomCount(room.id, 1)} className="material-symbols-rounded" style={{ fontSize: '20px' }}>add</button>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}

              {step === 4 && (
                <>
                  <div className="step-head">
                    <span className="step-eyebrow">الخطوة 4 من 7</span>
                    <h3>تخصيص الأجهزة والميزات لكل غرفة</h3>
                    <p>اضغط على الغرفة وحدد الأجهزة الفرعية المطلوبة بدقة عالية.</p>
                  </div>
                  <div className="room-list" style={{ marginTop: 20 }}>
                    {activeRooms.length === 0 ? (
                      <div className="empty-state">يرجى تحديد عدد الغرف أولاً في الخطوة السابقة لتتمكن من تخصيص ميزاتها.</div>
                    ) : (
                      activeRooms.map((room) => {
                        const isExpanded = expandedRoomId === room.id;
                        const totalSelectedItems = Object.values(room.selectedSubFeatures).reduce(
                          (sum, itemMap) => sum + Object.values(itemMap).reduce((innerSum, quantity) => innerSum + quantity, 0),
                          0,
                        );

                        return (
                          <div key={room.id} className={`room-panel ${isExpanded ? 'expanded' : ''}`}>
                            <button
                              type="button"
                              className="room-header"
                              onClick={() => setExpandedRoomId(isExpanded ? null : room.id)}
                            >
                              <span className="material-symbols-rounded">meeting_room</span>
                              <span className="room-title">{room.name} ({room.count})</span>
                              <span className="room-count">{totalSelectedItems}</span>
                              <span className="feature-pill">أجهزة</span>
                            </button>

                            {isExpanded && (
                              <div className="room-body">
                                <div className="feature-group">
                                  {Object.entries(categoryMetadata).map(([categoryKey, item]) => {
                                    const subItems = systemFeatureCatalog[categoryKey] ?? [];
                                    const selectedMap = room.selectedSubFeatures[categoryKey] ?? {};

                                    return (
                                      <div key={categoryKey} style={{ marginBottom: 18 }}>
                                        <div className="feature-group-title">
                                          <span className="material-symbols-rounded">{item.icon}</span>
                                          <span>{item.title}</span>
                                        </div>
                                        <div className="feature-grid">
                                          {subItems.map((subItem) => {
                                            const quantity = selectedMap[subItem.id] ?? 0;
                                            const isSelected = quantity > 0;
                                            return (
                                              <div
                                                key={subItem.id}
                                                className={`feature-item ${isSelected ? 'selected' : ''}`}
                                              >
                                                <div className="feature-card-top">
                                                  <div className="feature-card-body">
                                                    <span className="feature-card-label">{subItem.title}</span>
                                                    <span className="feature-icon material-symbols-rounded">{subItem.icon}</span>
                                                  </div>
                                                </div>
                                                <small className="feature-card-description">{subItem.description}</small>
                                                <div className="counter-controls">
                                                  <button
                                                    type="button"
                                                    onClick={() => adjustFeatureQuantity(room.id, categoryKey, subItem.id, -1)}
                                                    className="material-symbols-rounded"
                                                    aria-label="تقليل"
                                                  >
                                                    remove
                                                  </button>
                                                  <strong>{quantity}</strong>
                                                  <button
                                                    type="button"
                                                    onClick={() => adjustFeatureQuantity(room.id, categoryKey, subItem.id, 1)}
                                                    className="material-symbols-rounded"
                                                    aria-label="زيادة"
                                                  >
                                                    add
                                                  </button>
                                                </div>
                                              </div>
                                            );
                                          })}
                                        </div>
                                      </div>
                                    );
                                  })}
                                </div>
                              </div>
                            )}
                          </div>
                        );
                      })
                    )}
                  </div>
                </>
              )}

              {step === 5 && (
                <>
                  <div className="step-head">
                    <span className="step-eyebrow">الخطوة 5 من 7</span>
                    <h3>بيانات التواصل</h3>
                    <p>يرجى إدخال بياناتك لإرسال العروض والتفاصيل إليك.</p>
                  </div>
                  <div className="input-wrap" style={{ marginTop: 28 }}>
                    <label htmlFor="fullName">الاسم بالكامل *</label>
                    <input id="fullName" value={fullName} onChange={(event) => setFullName(event.target.value)} placeholder="الاسم بالكامل" />
                  </div>
                  <div className="input-wrap">
                    <label htmlFor="phone">رقم الهاتف / الواتساب *</label>
                    <input id="phone" value={phoneNumber} onChange={(event) => setPhoneNumber(event.target.value)} placeholder="مثال: 966500000000" />
                  </div>
                  <div className="input-wrap">
                    <label htmlFor="email">البريد الإلكتروني (اختياري)</label>
                    <input id="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="example@email.com" />
                  </div>
                </>
              )}

              {step === 6 && (
                <>
                  <div className="step-head">
                    <span className="step-eyebrow">الخطوة 6 من 7</span>
                    <h3>اختر الباقات والتكلفة التقديرية</h3>
                    <p>حدد الباقة المناسبة لميزانيتك واحتياجاتك.</p>
                  </div>
                  <div className="option-grid" style={{ marginTop: 22 }}>
                    {packageOptions.map((option) => (
                      <button
                        key={option.id}
                        type="button"
                        className={`option-card ${selectedPackage === option.id ? 'active' : ''}`}
                        onClick={() => setSelectedPackage(option.id)}
                      >
                        <span className="option-icon material-symbols-rounded">{option.icon}</span>
                        <span className="option-copy">
                          <strong>{option.title}</strong>
                          <small>{option.subtitle}</small>
                        </span>
                      </button>
                    ))}
                  </div>
                </>
              )}

              {step === 7 && (
                <>
                  <div className="step-head">
                    <span className="step-eyebrow">ملخص الطلب</span>
                    <h3>مراجعة المشروع النهائي</h3>
                    <p>راجع بياناتك قبل إرسال الطلب إلى فريقنا للحصول على العرض الأنسب لك.</p>
                  </div>
                  <div className="room-list" style={{ marginTop: 20 }}>
                    <div className="room-panel expanded">
                      <div className="room-header" style={{ pointerEvents: 'none' }}>
                        <span className="material-symbols-rounded">summarize</span>
                        <span className="room-title">ملخص الطلب</span>
                        <span className="room-count">{totalSelectedFeatures}</span>
                        <span className="feature-pill">خلاصة</span>
                      </div>
                      <div className="room-body">
                        <div className="feature-group">
                          <div className="feature-grid">
                            <div className="feature-item selected" style={{ pointerEvents: 'none' }}>
                              <span className="feature-icon material-symbols-rounded">chat_bubble_outline</span>
                              <span className="feature-content">
                                <strong>طريقة التواصل</strong>
                                <small>{serviceOptions.find((option) => option.id === serviceType)?.title ?? 'واتساب'}</small>
                              </span>
                            </div>
                            <div className="feature-item selected" style={{ pointerEvents: 'none' }}>
                              <span className="feature-icon material-symbols-rounded">straighten</span>
                              <span className="feature-content">
                                <strong>المساحة</strong>
                                <small>{propertyArea} متر مربع</small>
                              </span>
                            </div>
                            <div className="feature-item selected" style={{ pointerEvents: 'none' }}>
                              <span className="feature-icon material-symbols-rounded">meeting_room</span>
                              <span className="feature-content">
                                <strong>عدد الغرف</strong>
                                <small>{activeRooms.length} غرفة</small>
                              </span>
                            </div>
                            <div className="feature-item selected" style={{ pointerEvents: 'none' }}>
                              <span className="feature-icon material-symbols-rounded">auto_awesome</span>
                              <span className="feature-content">
                                <strong>الميزات المختارة</strong>
                                <small>{totalSelectedFeatures} عنصر</small>
                              </span>
                            </div>
                            <div className="feature-item selected" style={{ pointerEvents: 'none' }}>
                              <span className="feature-icon material-symbols-rounded">person</span>
                              <span className="feature-content">
                                <strong>الاسم</strong>
                                <small>{fullName || 'غير محدد'}</small>
                              </span>
                            </div>
                            <div className="feature-item selected" style={{ pointerEvents: 'none' }}>
                              <span className="feature-icon material-symbols-rounded">star_outline</span>
                              <span className="feature-content">
                                <strong>الباقة</strong>
                                <small>{packageOptions.find((option) => option.id === selectedPackage)?.title ?? 'أساسية'}</small>
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>
          )}

          {step === 7 && (
            <div className="summary-card">
              <div className="summary-top-row">
                <span className="summary-label">التكلفة التقديرية</span>
                <span className="summary-badge">{selectedPackage === 'pro' ? 'PRO' : 'أساسي'}</span>
              </div>
              <div className="summary-price">{formatCurrency(estimatedPrice)}</div>
              <div className="summary-list">
                <div className="summary-item"><span>المساحة</span><strong>{propertyArea || 0} م²</strong></div>
                <div className="summary-item"><span>الغرف</span><strong>{activeRooms.length}</strong></div>
                <div className="summary-item"><span>الميزات</span><strong>{totalSelectedFeatures}</strong></div>
                <div className="summary-item"><span>الباقة</span><strong>{selectedPackage === 'pro' ? 'احترافية' : 'أساسية'}</strong></div>
              </div>
              <div className="summary-actions">
                <button type="button" className="action-btn primary" onClick={downloadPdfSummary}>تحميل PDF</button>
                <button type="button" className="action-btn secondary" onClick={() => setChatOpen((previous) => !previous)}>دردشة مباشرة</button>
              </div>
            </div>
          )}

          {!isLoading && !isSubmitted && (
            <div className="footer-actions" style={{ marginTop: 22 }}>
              <button
                type="button"
                className="btn btn-outline"
                onClick={prevStep}
                disabled={step === 1}
                style={{ opacity: step === 1 ? 0.45 : 1, cursor: step === 1 ? 'not-allowed' : 'pointer' }}
              >
                رجوع
              </button>

              {step < totalSteps ? (
                <button type="button" className="btn btn-primary" onClick={nextStep}>
                  التالي
                </button>
              ) : (
                <button type="button" className="btn btn-primary" onClick={submitRequest}>
                  إرسال الطلب
                </button>
              )}
            </div>
          )}

          <div className="contact-strip">
            <h4>تواصل معنا</h4>
            <div className="contact-strip-grid">
              <div className="contact-item"><span className="material-symbols-rounded">call</span> +201116660532</div>
              <div className="contact-item"><span className="material-symbols-rounded">mail</span> info@yam.com</div>
              <div className="contact-item"><span className="material-symbols-rounded">location_on</span> مصر</div>
            </div>
          </div>
        </section>
      </div>

      {chatOpen && (
        <aside className="chat-widget">
          <div className="chat-header">
            <div>
              <strong>الدعم المباشر</strong>
              <small>متصل الآن</small>
            </div>
            <button type="button" className="chat-close" onClick={() => setChatOpen(false)}>×</button>
          </div>
          <div className="chat-body">
            {chatMessages.map((message) => (
              <div key={message.id} className={`chat-bubble ${message.sender}`}>
                {message.text}
              </div>
            ))}
          </div>
          <div className="chat-input-row">
            <input
              type="text"
              value={chatInput}
              onChange={(event) => setChatInput(event.target.value)}
              placeholder="اكتب سؤالك…"
              onKeyDown={(event) => {
                if (event.key === 'Enter') {
                  sendChatMessage();
                }
              }}
            />
            <button type="button" onClick={sendChatMessage}>إرسال</button>
          </div>
        </aside>
      )}

      {!chatOpen && (
        <button type="button" className="chat-fab" onClick={() => setChatOpen(true)} aria-label="فتح الدردشة">
          <span className="material-symbols-rounded">support_agent</span>
        </button>
      )}
    </main>
  );
}
