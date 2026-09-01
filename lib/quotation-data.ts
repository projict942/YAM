export type SubFeatureItem = {
  id: string;
  title: string;
  description: string;
  icon: string;
};

export type RoomModel = {
  id: string;
  name: string;
  count: number;
  selectedSubFeatures: Record<string, Set<string>>;
};

export type QuotationModel = {
  currentStep: number;
  serviceType: string;
  propertyType: string;
  propertyArea: number;
  rooms: RoomModel[];
  fullName: string;
  phoneNumber: string;
  email: string;
  selectedPackage: string;
  isLoading: boolean;
  isSubmittedSuccessfully: boolean;
  validationMessage?: string | null;
};

export const systemFeatureCatalog: Record<string, SubFeatureItem[]> = {
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
    { id: 'dimmers', title: 'مفاتيح التعتيم (Dimmer)', description: 'التحكم في درجة وقوة الإضاءة', icon: 'brightness' },
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

export const categoryMetadata: Record<string, { title: string; icon: string }> = {
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

export const initialRooms: RoomModel[] = [
  { id: 'living', name: 'غرفة معيشة', count: 1, selectedSubFeatures: {} },
  { id: 'master_bed', name: 'غرفة نوم رئيسية', count: 1, selectedSubFeatures: {} },
  { id: 'bed', name: 'غرفة نوم فرعية', count: 2, selectedSubFeatures: {} },
  { id: 'bath', name: 'حمام', count: 2, selectedSubFeatures: {} },
  { id: 'kitchen', name: 'مطبخ', count: 1, selectedSubFeatures: {} },
  { id: 'reception', name: 'صالون / ريسبشن', count: 1, selectedSubFeatures: {} },
  { id: 'garden', name: 'الحديقة / التراس', count: 0, selectedSubFeatures: {} },
];

export const initialQuotationModel: QuotationModel = {
  currentStep: 1,
  serviceType: 'whatsapp',
  propertyType: 'villa',
  propertyArea: 0,
  rooms: initialRooms,
  fullName: '',
  phoneNumber: '',
  email: '',
  selectedPackage: 'standard',
  isLoading: false,
  isSubmittedSuccessfully: false,
  validationMessage: null,
};
