"use client";

import { useEffect, useMemo, useState } from 'react';

type SubFeatureItem = {
  id: string;
  title: string;
  description: string;
  icon: string;
};

const hiddenFeaturePriceMap: Record<string, number> = {
  smart_lock: 1800,
  ext_cam: 2600,
  int_cam: 2200,
  motion_sensor: 900,
  safety_sensors: 1400,
  door_sensor: 500,
  alexa_speakers: 2200,
  apple_siri: 1800,
  google_assistant: 1500,
  voice_scenes: 1200,
  touch_switches: 1300,
  dimmers: 900,
  rgb_strip: 750,
  presence_sensor: 600,
  smart_thermostat: 2200,
  ir_blaster: 500,
  ac_scheduling: 1100,
  curtain_motor: 1800,
  shutter_switch: 1100,
  sun_sync: 950,
  ceiling_speakers: 1400,
  audio_amp: 1800,
  wall_audio_panel: 1100,
  wifi_mesh: 2400,
  network_rack: 1600,
  poe_switch: 1700,
  smart_sockets: 600,
  energy_monitor: 900,
  smart_breakers: 1800,
  video_intercom: 2100,
  door_station: 1600,
  touch_screen_indoor: 1400,
  home_away_mode: 1200,
  cinema_mode: 2200,
  smart_irrigation: 1300,
};

const selectedProductPriceMap: Record<string, number> = {
  hikvision_ip_outdoor: 2500,
  hikvision_ip_indoor: 2000,
  hikvision_wifi_ptz: 3200,
  hilook_outdoor: 1450,
  hilook_indoor: 1200,
  hilook_analog: 750,
  imou_ranger: 2200,
  ezviz_c6n: 2200,
  sonoff_cam_slim: 1750,
  ptz_outdoor: 4300,
  hikvision_nvr: 7800,
  hilook_nvr: 3800,
  turbo_hd_dvr: 3000,
  purple_hdd: 5200,
  rack_6u: 3600,
  rack_12u: 7000,
  poe_switch: 4600,
  cat6_roll: 6000,
  mesh_wifi: 12000,
  android_amp: 16500,
  mini_amp: 9000,
  bluetooth_amp: 4500,
  speaker_5: 1800,
  speaker_6: 3000,
  speaker_8: 7000,
  waterproof_speaker: 2800,
  smart_lock_tuya: 8000,
  aqara_a100: 21000,
  face_lock: 15500,
  video_intercom: 15000,
  doorbell: 5000,
  motion_sensor: 850,
  door_sensor: 700,
  water_leak: 1000,
  smoke_sensor: 1200,
  presence_fp2: 4200,
  switchman_m5: 1450,
  glass_touch: 1700,
  zbmini: 1100,
  dimmer: 1800,
  smart_breaker: 2500,
  clamp_meter: 3000,
  smart_plug: 800,
  ir_controller: 800,
  thermostat: 4000,
  curtain_motor: 5500,
  shutter_switch: 1700,
  irrigation_valve: 2600,
  echo_dot: 3600,
  echo_show: 10000,
  zigbee_gateway: 1800,
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
  { id: 'living', name: 'Living Room', count: 1, selectedSubFeatures: {} },
  { id: 'master_bed', name: 'Main Bedroom', count: 1, selectedSubFeatures: {} },
  { id: 'bed', name: 'Bedroom', count: 2, selectedSubFeatures: {} },
  { id: 'bath', name: 'Bathroom', count: 2, selectedSubFeatures: {} },
  { id: 'kitchen', name: 'Kitchen', count: 1, selectedSubFeatures: {} },
  { id: 'reception', name: 'Reception / Lounge', count: 1, selectedSubFeatures: {} },
  { id: 'garden', name: 'Garden / Terrace', count: 0, selectedSubFeatures: {} },
];

const propertyTypeOptions = [
  { id: 'apartment', title: 'Apartment', subtitle: 'Standard apartment unit', icon: 'apartment' },
  { id: 'villa', title: 'Villa', subtitle: 'Multi-floor villa with outdoor space', icon: 'villa' },
];

const serviceOptions = propertyTypeOptions;

const packageOptions = [
  { id: 'standard', title: 'الباقة الأساسية', subtitle: 'تغطي الاحتياجات الأساسية للتحكم الذكي', icon: 'star_outline' },
  { id: 'pro', title: 'الباقة الاحترافية (PRO)', subtitle: 'تحكم شامل وكامل بكل الأجهزة والأنظمة', icon: 'auto_awesome' },
];

const cameraCatalogSections = [
  {
    title: 'كاميرات المراقبة وأنظمة التسجيل',
    items: [
      { id: 'hikvision_ip_outdoor', name: 'Hikvision 2MP / 5MP IP Outdoor Camera', description: 'كاميرا خارجية بدقة عالية مع رؤية ليلية كاملة ومقاومة للماء' },
      { id: 'hikvision_ip_indoor', name: 'Hikvision 2MP / 5MP IP Indoor Dome', description: 'كاميرا داخلية ثابتة للممرات والغرف بتصميم مدمج' },
      { id: 'hikvision_wifi_ptz', name: 'Hikvision Wi-Fi PTZ / Wireless Camera', description: 'كاميرا وايرلس ذاتية التوصيل مع تتبع حركة وتنبيهات' },
      { id: 'hilook_outdoor', name: 'HiLook 2MP / 4MP IP Outdoor Bullet Camera', description: 'كاميرا خارجية اقتصادية بجودة ممتازة' },
      { id: 'hilook_indoor', name: 'HiLook 2MP / 4MP IP Indoor Dome Camera', description: 'كاميرا داخلية عالية الجودة للسقف المعلق' },
      { id: 'hilook_analog', name: 'HiLook Turbo HD 2MP / 5MP Analog Camera', description: 'كاميرا أنالوج عالية الدقة لوصلها مع الـ DVR' },
      { id: 'imou_ranger', name: 'Imou Ranger 2 (2K / 4K Wi-Fi)', description: 'كاميرا داخلية متحركة 360° مع تتبع أوتوماتيكي' },
      { id: 'ezviz_c6n', name: 'Ezviz C6N / C3N Wi-Fi', description: 'كاميرا داخلية/خارجية ذكية تعمل عبر Wi-Fi مباشرة' },
      { id: 'sonoff_cam_slim', name: 'Sonoff CAM Slim', description: 'كاميرا داخلية صغيرة جدًا ومناسبة للـ Smart Home' },
      { id: 'ptz_outdoor', name: 'Imou Cruiser / Ezviz OutPro Wi-Fi Outdoor PTZ', description: 'كاميرا خارجية متحركة مع كشاف إنذار وصوت رادع' },
      { id: 'hikvision_nvr', name: 'Hikvision NVR 4 / 8 / 16 / 32 Channels PoE', description: 'جهاز تسجيل شبكي يدعم تغذية الكاميرات عبر PoE' },
      { id: 'hilook_nvr', name: 'HiLook NVR / DVR 4 / 8 / 16 Channels', description: 'أجهزة تسجيل اقتصادية عالية الاعتمادية' },
      { id: 'turbo_hd_dvr', name: 'Hikvision / HiLook Turbo HD DVR', description: 'أجهزة تسجيل لكاميرات الأنالوج الـ HD' },
      { id: 'purple_hdd', name: 'Western Digital Purple / Seagate SkyHawk', description: 'هارد ديسك مخصص للتسجيل المستمر 24/7' },
    ],
  },
  {
    title: 'كابينات الراك والشبكة والإنترنت',
    items: [
      { id: 'rack_6u', name: 'Rack Wall-Mount 6U / 9U', description: 'كابينة حائطية لتنظيم NVR والسويتشات والكبسولات الذكية' },
      { id: 'rack_12u', name: 'Rack Wall-Mount 12U / 15U', description: 'حل للمشاريع الكبيرة مع تهوية مناسبة' },
      { id: 'poe_switch', name: 'TP-Link / Dahua / Hikvision PoE Switch', description: 'سويتشات شبكة لتغذية الكاميرات عبر كابل واحد' },
      { id: 'cat6_roll', name: 'Cat6 Network Cable Roll (305m)', description: 'كابل نحاس عالي الجودة لنقل البيانات بشكل مستقر' },
      { id: 'mesh_wifi', name: 'TP-Link Deco X20 / X50 / XE75', description: 'نظام Wi-Fi 6 Mesh لتغطية المنزل بالكامل' },
    ],
  },
  {
    title: 'النظام الصوتي وتوزيع الصوت',
    items: [
      { id: 'android_amp', name: 'Tuya / Satis 7" Smart Android In-Wall Amplifier', description: 'شاشة جدارية Android لتشغيل 4-8 سماعات' },
      { id: 'mini_amp', name: 'Tuya 4" Mini Touch Panel Amplifier', description: 'أمبليفاير صغير لغرف مستقلة' },
      { id: 'bluetooth_amp', name: 'Bluetooth Hidden Amplifier', description: 'أمبليفاير مخفي داخل السقف للتحكم من الهاتف' },
      { id: 'speaker_5', name: 'سماعات 5.25 بوصة', description: 'مناسبة للحمامات والمطابخ والممرات' },
      { id: 'speaker_6', name: 'سماعات 6.5 بوصة', description: 'الحل القياسي لجلسات الاستقبال والغرف' },
      { id: 'speaker_8', name: 'سماعات 8 بوصة High-Bass', description: 'للمساحات الكبيرة والسينما المنزلية' },
      { id: 'waterproof_speaker', name: 'سماعات مقاومة للماء 6.5"', description: 'للتراس والحدائق والحمامات' },
    ],
  },
  {
    title: 'القفل والإنتركم والحساسات',
    items: [
      { id: 'smart_lock_tuya', name: 'Tuya WiFi / Zigbee Semi-Automatic Lock', description: 'قفل ذكي بمؤشرات بصمة وكارت NFC وكلمة مرور' },
      { id: 'aqara_a100', name: 'Aqara A100 / N100', description: 'قفل ذكي عالي الأمان مع دعم Apple HomeKit' },
      { id: 'face_lock', name: 'Tuya Fully Automatic Face ID Lock', description: 'فتح أوتوماتيكي بالكامل مع بصمة الوجه وكاميرا' },
      { id: 'video_intercom', name: 'Hikvision / Dahua IP Video Intercom Kit', description: 'لوحة خارجية مع كاميرا وشاشة داخلية' },
      { id: 'doorbell', name: 'Tuya Smart Video Doorbell', description: 'جرس كاميرا ذكي للتواصل المباشر مع الهاتف' },
      { id: 'motion_sensor', name: 'حساس حركة Tuya / Sonoff', description: 'حساسات حركة للمساحات الداخلية والخارجية' },
      { id: 'door_sensor', name: 'حساس أبواب وشبابيك', description: 'مراقبة فتح وإغلاق النوافذ والأبواب' },
      { id: 'water_leak', name: 'حساس تسريب مياه', description: 'إنذار مبكر في حالة حدوث تسريب' },
      { id: 'smoke_sensor', name: 'حساس دخان وغاز', description: 'حماية مبكرة من الحرائق والغازات' },
      { id: 'presence_fp2', name: 'Aqara Human Presence Sensor FP2', description: 'حساس رادار لكشف التواجد بدقة عالية' },
    ],
  },
  {
    title: 'الإضاءة والتحكم وإدارة الطاقة',
    items: [
      { id: 'switchman_m5', name: 'Sonoff SwitchMan M5', description: 'مفاتيح ضغط عصرية للتشغيل الذكي' },
      { id: 'glass_touch', name: 'Tuya Glass Touch Switch', description: 'مفاتيح لمس زجاجية مزودة بالتحكم الذكي' },
      { id: 'zbmini', name: 'Sonoff ZBMINI / MINI R4', description: 'كبسولات مخفية مناسبة للمفاتيح العادية' },
      { id: 'dimmer', name: 'Tuya Smart Touch Dimmer Switch', description: 'مفتاح لتعتيم الإضاءة والتحكم في شدتها' },
      { id: 'smart_breaker', name: 'Tuya / Sonoff Smart Circuit Breaker', description: 'قاطع كهربائي ذكي لإدارة الجهد والدوائر' },
      { id: 'clamp_meter', name: 'Tuya Power Consumption Clamp Meter', description: 'مراقب استهلاك الكهرباء بدقة' },
      { id: 'smart_plug', name: 'Tuya Smart Plug', description: 'مقبس ذكي للتحكم في الأجهزة المنزلية' },
    ],
  },
  {
    title: 'التكييف والستائر والسيناريوهات',
    items: [
      { id: 'ir_controller', name: 'Tuya Universal IR Controller', description: 'ريموت ذكي للتحكم في التكييف والشاشات' },
      { id: 'thermostat', name: 'Tuya Smart Thermostat', description: 'لوحة تحكم بالتكييف المركزي' },
      { id: 'curtain_motor', name: 'Tuya Smart Curtain Motor & Track', description: 'موتور ومجرى ستائر إلكتروني' },
      { id: 'shutter_switch', name: 'Tuya / Sonoff Roller Shutter Switch', description: 'تحكم في الستائر والشرائح الخارجية' },
      { id: 'irrigation_valve', name: 'Tuya Smart Irrigation Water Valve', description: 'محبس ري ذكي للحدائق والمسطحات الخضراء' },
      { id: 'echo_dot', name: 'Amazon Echo Dot 5th Gen', description: 'مساعد صوتي للمنزل الذكي' },
      { id: 'echo_show', name: 'Amazon Echo Show 8', description: 'شاشة ذكية لعرض الكاميرات والتشغيل الصوتي' },
      { id: 'zigbee_gateway', name: 'Tuya Zigbee Gateway / Hub', description: 'الموزع الرئيسي لشبكة Zigbee' },
    ],
  },
];

const totalSteps = 8;

const formatCurrency = (value: number, isArabic: boolean) =>
  new Intl.NumberFormat(isArabic ? 'ar-EG' : 'en-US', {
    style: 'currency',
    currency: 'EGP',
    maximumFractionDigits: 0,
  }).format(value);

const getRoomName = (roomId: string, isArabic: boolean) => {
  const map: Record<string, { en: string; ar: string }> = {
    living: { en: 'Living Room', ar: 'غرفة المعيشة' },
    master_bed: { en: 'Main Bedroom', ar: 'غرفة النوم الرئيسية' },
    bed: { en: 'Bedroom', ar: 'غرفة نوم فرعية' },
    bath: { en: 'Bathroom', ar: 'حمام' },
    kitchen: { en: 'Kitchen', ar: 'المطبخ' },
    reception: { en: 'Reception / Lounge', ar: 'صالون / ريسبشن' },
    garden: { en: 'Garden / Terrace', ar: 'الحديقة / التراس' },
  };

  return map[roomId]?.[isArabic ? 'ar' : 'en'] ?? roomId;
};

const getPropertyTypeTitle = (id: string, isArabic: boolean) => {
  const map: Record<string, { en: string; ar: string }> = {
    apartment: { en: 'Apartment', ar: 'شقة' },
    villa: { en: 'Villa', ar: 'فيلا' },
  };

  return map[id]?.[isArabic ? 'ar' : 'en'] ?? id;
};

const getPackageTitle = (id: string, isArabic: boolean) => {
  const map: Record<string, { en: string; ar: string }> = {
    standard: { en: 'Basic', ar: 'أساسية' },
    pro: { en: 'Professional', ar: 'احترافية' },
  };

  return map[id]?.[isArabic ? 'ar' : 'en'] ?? id;
};

const getPackageSubtitle = (id: string, isArabic: boolean) => {
  const map: Record<string, { en: string; ar: string }> = {
    standard: {
      en: 'Essential smart-home coverage',
      ar: 'تغطي الاحتياجات الأساسية للتحكم الذكي',
    },
    pro: {
      en: 'Full smart home and premium automation coverage',
      ar: 'تحكم شامل وكامل بكل الأجهزة والأنظمة',
    },
  };

  return map[id]?.[isArabic ? 'ar' : 'en'] ?? id;
};

const getAutomaticReply = (message: string, isArabic: boolean) => {
  const normalizedMessage = message.toLowerCase();

  if (normalizedMessage.includes('مرحبا') || normalizedMessage.includes('السلام') || normalizedMessage.includes('hello') || normalizedMessage.includes('hi') || normalizedMessage.includes('hey')) {
    return isArabic
      ? 'أهلا بك، أنا مساعد YAM. اسألني عن السعر، الباقات، الكاميرات، أو طريقة التواصل.'
      : 'Hello, I am the YAM assistant. Ask me about pricing, packages, cameras, or contact details.';
  }

  if (
    normalizedMessage.includes('سعر') ||
    normalizedMessage.includes('تكلف') ||
    normalizedMessage.includes('فلوس') ||
    normalizedMessage.includes('price') ||
    normalizedMessage.includes('budget') ||
    normalizedMessage.includes('estimate') ||
    normalizedMessage.includes('عرض')
  ) {
    return isArabic
      ? 'السعر يعتمد على مساحة العقار، عدد الغرف، نوع الأجهزة، والباقة المختارة. تقدر تراجع التكلفة التقديرية في نفس الخطوات خلال النموذج.'
      : 'The price depends on the property size, room count, device type, and selected package. You can review the estimate in the same steps of the form.';
  }

  if (
    normalizedMessage.includes('باقة') ||
    normalizedMessage.includes('package') ||
    normalizedMessage.includes('pro') ||
    normalizedMessage.includes('احتراف') ||
    normalizedMessage.includes('أساسية') ||
    normalizedMessage.includes('standard')
  ) {
    return isArabic
      ? 'الباقة الأساسية مناسبة للاحتياجات اليومية، بينما الباقة الاحترافية تشمل تحكمًا أوسع في الأنظمة، السيناريوهات، والأجهزة المتقدمة.'
      : 'The basic package suits everyday needs, while the professional package includes broader system control, advanced scenarios, and more devices.';
  }

  if (
    normalizedMessage.includes('كاميرا') ||
    normalizedMessage.includes('أمان') ||
    normalizedMessage.includes('قفل') ||
    normalizedMessage.includes('camera') ||
    normalizedMessage.includes('security') ||
    normalizedMessage.includes('lock') ||
    normalizedMessage.includes('alarm')
  ) {
    return isArabic
      ? 'نوفر كاميرات داخلية وخارجية، حساسات حركة، أقفال ذكية، وأجهزة أمان متكاملة. اختار النوع والعدد المطلوب من خطوة الأجهزة.'
      : 'We provide indoor and outdoor cameras, motion sensors, smart locks, and complete security systems. Choose the type and quantity required in the device step.';
  }

  if (
    normalizedMessage.includes('تواصل') ||
    normalizedMessage.includes('واتساب') ||
    normalizedMessage.includes('رقم') ||
    normalizedMessage.includes('contact') ||
    normalizedMessage.includes('whatsapp') ||
    normalizedMessage.includes('call')
  ) {
    return isArabic
      ? 'يمكنك التواصل معنا مباشرة عبر واتساب أو الهاتف: 01116107777 / 01116041111 / 01002081073، أو عبر البريد yam4lcs@gmail.com. الموقع: القاهرة، الخليفة. مهندس المشروع: SEO Ahmed Moustafa.'
      : 'You can contact us directly on WhatsApp or phone: 01116107777 / 01116041111 / 01002081073, or by email yam4lcs@gmail.com. Location: Cairo, Khalifa. Project engineer: SEO Ahmed Moustafa.';
  }

  if (
    normalizedMessage.includes('مساح') ||
    normalizedMessage.includes('غرف') ||
    normalizedMessage.includes('room') ||
    normalizedMessage.includes('area') ||
    normalizedMessage.includes('فيلا') ||
    normalizedMessage.includes('شقة') ||
    normalizedMessage.includes('villa') ||
    normalizedMessage.includes('apartment')
  ) {
    return isArabic
      ? 'أدخل مساحة العقار وحدد عدد الغرف، وبعدها اختار الأجهزة المطلوبة لكل غرفة للحصول على تقدير أدق ونظام مناسب لك.'
      : 'Enter the property area and room count, then choose the devices needed for each room for a more accurate estimate and the right system for you.';
  }

  if (
    normalizedMessage.includes('تركيب') ||
    normalizedMessage.includes('تنفيذ') ||
    normalizedMessage.includes('installation') ||
    normalizedMessage.includes('install') ||
    normalizedMessage.includes('setup') ||
    normalizedMessage.includes('تثبيت')
  ) {
    return isArabic
      ? 'نقدم تنفيذ وتركيب أنظمة المنزل الذكي مع دعم فني حسب الخطة، وتحديد موقع التثبيت بناءً على مساحة المشروع واحتياجاتك.'
      : 'We provide smart home installation and setup with technical support according to your plan, and we determine the installation layout based on your project size and needs.';
  }

  if (
    normalizedMessage.includes('زمن') ||
    normalizedMessage.includes('وقت') ||
    normalizedMessage.includes('duration') ||
    normalizedMessage.includes('time') ||
    normalizedMessage.includes('كم يوم') ||
    normalizedMessage.includes('كم يستغرق')
  ) {
    return isArabic
      ? 'مدة التنفيذ تختلف حسب حجم المشروع، لكن غالبًا يبدأ التنفيذ خلال أيام قليلة بعد تأكيد المواصفات والتصور النهائي.'
      : 'The implementation time varies depending on the project size, but work typically starts within a few days after confirming the technical requirements and final plan.';
  }

  if (
    normalizedMessage.includes('دفع') ||
    normalizedMessage.includes('payment') ||
    normalizedMessage.includes('سداد') ||
    normalizedMessage.includes('تقسيط') ||
    normalizedMessage.includes('cash')
  ) {
    return isArabic
      ? 'تفاصيل الدفع يتم الاتفاق عليها حسب المشروع، ويمكن ترتيبها بشكل مناسب بعد تجهيز العرض النهائي والتأكيد على المواصفات.'
      : 'Payment details are agreed based on the project, and they can be arranged appropriately after the final proposal and specifications are confirmed.';
  }

  if (
    normalizedMessage.includes('ضمان') ||
    normalizedMessage.includes('warranty') ||
    normalizedMessage.includes('support') ||
    normalizedMessage.includes('دعم') ||
    normalizedMessage.includes('صيانة') ||
    normalizedMessage.includes('maintenance')
  ) {
    return isArabic
      ? 'نقدم دعم فني وخدمة ما بعد البيع حسب نوع النظام والمنتج المختار، مع متابعة للتأكد من التشغيل السليم.'
      : 'We provide technical support and after-sales service based on the selected system and product, with follow-up to ensure proper operation.';
  }

  if (
    normalizedMessage.includes('منزل ذكي') ||
    normalizedMessage.includes('smart home') ||
    normalizedMessage.includes('automation') ||
    normalizedMessage.includes('أتمتة') ||
    normalizedMessage.includes('مفاتيح') ||
    normalizedMessage.includes('ديكور') ||
    normalizedMessage.includes('إضاءة') ||
    normalizedMessage.includes('lighting')
  ) {
    return isArabic
      ? 'المنزل الذكي يشمل التحكم في الإضاءة، الستائر، التكييف، الأمان، والسيناريوهات المنزلية بشكل مركزي وسهل الاستخدام.'
      : 'A smart home includes control of lighting, curtains, air conditioning, security, and home scenarios in a centralized and easy-to-use system.';
  }

  return isArabic
    ? 'وصلت رسالتك. اسألني عن الأسعار، الكاميرات، الباقات، التثبيت، أو طريقة التواصل مع فريق YAM.'
    : 'Your message is received. Ask me about pricing, cameras, packages, installation, or how to contact the YAM team.';
};

export default function Page() {
  const [step, setStep] = useState(1);
  const [showLanding, setShowLanding] = useState(true);
  const [language, setLanguage] = useState<'en' | 'ar'>('en');
  const [serviceType, setServiceType] = useState('apartment');
  const [propertyArea, setPropertyArea] = useState('180');
  const [villaFloors, setVillaFloors] = useState('2');
  const [hasGarden, setHasGarden] = useState(false);
  const [gardenArea, setGardenArea] = useState('0');
  const [rooms, setRooms] = useState<RoomModel[]>(initialRooms);
  const [fullName, setFullName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [email, setEmail] = useState('');
  const [selectedPackage, setSelectedPackage] = useState('standard');
  const [selectedCameraModels, setSelectedCameraModels] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [validationMessage, setValidationMessage] = useState<string | null>(null);
  const [expandedRoomId, setExpandedRoomId] = useState<string | null>('living');
  const [selectedRoomId, setSelectedRoomId] = useState<string | null>('living');
  const [chatOpen, setChatOpen] = useState(false);
  const [chatInput, setChatInput] = useState('');
  const [chatLeadState, setChatLeadState] = useState<{ name: string; phone: string; waitingFor: 'name' | 'phone' } | null>(null);
  const [chatMessages, setChatMessages] = useState([
    { id: 1, sender: 'bot', text: 'Hello, how can we help with your smart-home project?' },
    { id: 2, sender: 'bot', text: 'You can review live pricing and choose the right package in a few steps.' },
  ]);

  const isArabic = language === 'ar';

  useEffect(() => {
    document.documentElement.lang = language;
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
  }, [language]);

  const progress = useMemo(() => `${Math.min((step / totalSteps) * 100, 100)}%`, [step]);

  const activeRooms = rooms.filter((room) => room.count > 0);
  const visibleRoomTypes = rooms;
  const totalSelectedFeatures = rooms.reduce(
    (acc, room) =>
      acc +
      Object.values(room.selectedSubFeatures).reduce(
        (sum, itemMap) => sum + Object.values(itemMap).reduce((innerSum, quantity) => innerSum + quantity, 0),
        0,
      ),
    0,
  );

  const selectedFeatureValue = useMemo(
    () =>
      rooms.reduce((sum, room) => {
        const categoryTotals = Object.values(room.selectedSubFeatures).reduce((categorySum, itemMap) => {
          return (
            categorySum +
            Object.entries(itemMap).reduce((innerSum, [featureId, quantity]) => {
              const unitPrice = hiddenFeaturePriceMap[featureId] ?? 650;
              return innerSum + unitPrice * quantity;
            }, 0)
          );
        }, 0);

        return sum + categoryTotals;
      }, 0),
    [rooms],
  );

  const estimatedPrice = useMemo(() => {
    const selectedProductTotal = selectedCameraModels.reduce((sum, cameraId) => {
      return sum + (selectedProductPriceMap[cameraId] ?? 0);
    }, 0);

    const featureTotal = selectedFeatureValue;
    const base = selectedProductTotal + featureTotal;

    return Math.round(base || 0);
  }, [selectedCameraModels, selectedFeatureValue]);

  const nextStep = () => {
    if (step === 2 && (!propertyArea || Number(propertyArea) <= 0)) {
      setValidationMessage('يرجى إدخال مساحة العقار بشكل صحيح.');
      return;
    }

    if (step === 6 && (!fullName.trim() || !phoneNumber.trim())) {
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

  const localizedRoomName = (roomId: string) => getRoomName(roomId, isArabic);
  const selectedCameraOptions = useMemo(
    () => cameraCatalogSections.flatMap((section) => section.items).filter((item) => selectedCameraModels.includes(item.id)),
    [selectedCameraModels],
  );

  const toggleCameraModel = (cameraId: string) => {
    setSelectedCameraModels((previous) =>
      previous.includes(cameraId)
        ? previous.filter((id) => id !== cameraId)
        : [...previous, cameraId],
    );
  };

  const sendLeadToTelegram = async (name: string, phone: string) => {
    try {
      await fetch('/api/send-to-telegram', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          serviceType: 'الدردشة المباشرة',
          propertyArea: 0,
          rooms: [],
          fullName: name,
          phoneNumber: phone,
          email: '',
          selectedPackage: 'استفسار / حجز عبر الشات',
          totalFeatures: 0,
        }),
      });
    } catch (error) {
      console.error('Chat lead send error:', error);
    }
  };

  const sendChatMessage = () => {
    const trimmed = chatInput.trim();
    if (!trimmed) return;

    const userMessage = { id: Date.now(), sender: 'user', text: trimmed };
    setChatMessages((previous) => [...previous, userMessage]);
    setChatInput('');

    if (chatLeadState) {
      if (chatLeadState.waitingFor === 'name') {
        setChatLeadState({ ...chatLeadState, name: trimmed, waitingFor: 'phone' });
        setTimeout(() => {
          setChatMessages((previous) => [
            ...previous,
            {
              id: Date.now() + 1,
              sender: 'bot',
              text: isArabic ? 'شكراً، الآن اكتب رقم الهاتف أو الواتساب حتى نرسل طلبك إلى فريق YAM.' : 'Thanks, now please enter your phone or WhatsApp number so we can forward your request to the YAM team.',
            },
          ]);
        }, 300);
        return;
      }

      if (chatLeadState.waitingFor === 'phone') {
        const leadName = chatLeadState.name || 'غير محدد';
        setChatLeadState(null);

        setTimeout(async () => {
          await sendLeadToTelegram(leadName, trimmed);
          setChatMessages((previous) => [
            ...previous,
            {
              id: Date.now() + 1,
              sender: 'bot',
              text: isArabic ? 'تم تسجيل طلبك بنجاح، وسيقوم فريق YAM بالتواصل معك في أقرب وقت.' : 'Your request has been recorded successfully, and the YAM team will contact you as soon as possible.',
            },
          ]);
        }, 300);
        return;
      }
    }

    const wantsLead = /(حجز|استفسار|استشارة|طلب|تواصل|أريد|اريد|مساعدة|booking|book|reserve|reservation|quote|عرض|سعر)/i.test(trimmed);

    if (wantsLead) {
      setChatLeadState({ name: '', phone: '', waitingFor: 'name' });
      setTimeout(() => {
        setChatMessages((previous) => [
          ...previous,
          {
            id: Date.now() + 1,
            sender: 'bot',
            text: isArabic ? 'أكيد، نبدأ طلب جديد. اكتب الاسم بالكامل أولاً.' : 'Absolutely, let’s start a new request. Please enter your full name first.',
          },
        ]);
      }, 300);
      return;
    }

    const botReply = getAutomaticReply(trimmed, isArabic);
    setTimeout(() => {
      setChatMessages((previous) => [
        ...previous,
        {
          id: Date.now() + 1,
          sender: 'bot',
          text: botReply,
        },
      ]);
    }, 300);
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
      <html lang="${isArabic ? 'ar' : 'en'}" dir="${isArabic ? 'rtl' : 'ltr'}">
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
            <div class="price">${formatCurrency(estimatedPrice, isArabic)}</div>
            <div class="row"><span>${isArabic ? 'طريقة التواصل' : 'Contact method'}</span><strong>${getPropertyTypeTitle(serviceType, isArabic)}</strong></div>
            <div class="row"><span>${isArabic ? 'المساحة' : 'Area'}</span><strong>${propertyArea || 0} ${isArabic ? 'م²' : 'm²'}</strong></div>
            <div class="row"><span>${isArabic ? 'عدد الغرف' : 'Room count'}</span><strong>${activeRooms.length}</strong></div>
            <div class="row"><span>${isArabic ? 'الميزات المختارة' : 'Selected features'}</span><strong>${totalSelectedFeatures}</strong></div>
            <div class="row"><span>${isArabic ? 'الباقة' : 'Package'}</span><strong>${getPackageTitle(selectedPackage, isArabic)}</strong></div>
            <div class="row"><span>${isArabic ? 'الاسم' : 'Name'}</span><strong>${fullName || (isArabic ? 'غير محدد' : 'Not provided')}</strong></div>
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
          selectedProducts: selectedCameraOptions.map((item) => item.name),
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
      setStep(8);
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

      {showLanding ? (
        <div className="landing-panel">
          <div className="landing-card">
            <div className="landing-topbar">
              <img src="https://res.cloudinary.com/dyvadd9tt/image/upload/v1788311465/Gemini_Generated_Image_hvc3qkhvc3qkhvc3_zdrske.png" alt="YAM logo" className="yam-logo" />
              <button
                type="button"
                className="language-toggle"
                onClick={() => setLanguage(isArabic ? 'en' : 'ar')}
              >
                {isArabic ? 'EN' : 'AR'}
              </button>
            </div>

            <div className="landing-content">
              <div className="landing-copy">
                <span className="eyebrow">{isArabic ? 'المنزل الذكي المصمم لك' : 'Smart living, designed for you'}</span>
                <h1>{isArabic ? 'صمم مشروعك الذكي بطريقة سهلة واحترافية' : 'Design your smart project in a simple, professional way'}</h1>
                <p>
                  {isArabic
                    ? 'اختر نوع العقار، شارح احتياجاتك، وحدد الأجهزة المناسبة، ثم احصل على عرض سعر فوري ومناسب لميزانيتك.'
                    : 'Choose your property type, explain your needs, select the right devices, and get an instant quote that fits your budget.'}
                </p>

                <div className="landing-badges">
                  <span>{isArabic ? 'أمن' : 'Security'}</span>
                  <span>{isArabic ? 'تحكم ذكي' : 'Automation'}</span>
                  <span>{isArabic ? 'تركيب احترافي' : 'Professional install'}</span>
                </div>

                <div className={`landing-actions ${!isArabic ? 'landing-actions-en' : ''}`}>
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={() => {
                      setShowLanding(false);
                      setStep(1);
                    }}
                  >
                    {isArabic ? 'ابدأ الآن' : 'Start now'}
                  </button>
                  <button type="button" className="btn btn-outline" onClick={() => setChatOpen(true)}>
                    {isArabic ? 'تواصل معنا' : 'Contact us'}
                  </button>
                </div>
              </div>

              <div className="landing-preview">
                <div className="preview-card">
                  <div className="preview-header">
                    <img src="https://res.cloudinary.com/dyvadd9tt/image/upload/v1788309126/WhatsApp_Image_2026-09-02_at_12.08.45_AM_vf0ulu.png" alt="YAM logo" className="preview-tag" />
                    <span className="preview-status">{isArabic ? 'متاح الآن' : 'Available now'}</span>
                  </div>

                  <div className="preview-metrics">
                    <div>
                      <strong>24/7</strong>
                      <small>{isArabic ? 'دعم' : 'Support'}</small>
                    </div>
                    <div>
                      <strong>3.2k</strong>
                      <small>{isArabic ? 'منتج' : 'Products'}</small>
                    </div>
                  </div>

                  <div className="mini-stack">
                    <span>{isArabic ? 'أمان منزلي' : 'Home security'}</span>
                    <span>{isArabic ? 'إضاءة ذكية' : 'Smart lighting'}</span>
                    <span>{isArabic ? 'تحكم بالهواء' : 'Climate control'}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="quotation-app">
          <section className="wizard-panel">
            <div className="wizard-header">
              <div>
                <span className="eyebrow">{isArabic ? 'تكوين الطلب' : 'Quote Builder'}</span>
                <h2>{isArabic ? 'ابدأ بتصميم منزلك الذكي' : 'Design your smart home plan'}</h2>
                <div className="brand-tagline">YAM Smart Home • Automation • Security</div>
              </div>
              <div className="header-branding">
                <img src="https://res.cloudinary.com/dyvadd9tt/image/upload/v1788311465/Gemini_Generated_Image_hvc3qkhvc3qkhvc3_zdrske.png" alt="YAM logo" className="brand-pill" />
                <button
                  type="button"
                  className="language-toggle"
                  onClick={() => setLanguage(isArabic ? 'en' : 'ar')}
                >
                  {isArabic ? 'EN' : 'AR'}
                </button>
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
                <h3>{isArabic ? 'تم إرسال طلبك بنجاح' : 'Your request was submitted successfully'}</h3>
                <p>{isArabic ? 'شكرًا لتواصلك معنا. تم حفظ بيانات طلبك وسيتم التواصل معك قريبًا.' : 'Thank you for contacting YAM. Your request has been received and our team will reach out shortly.'}</p>
              </div>
            ) : (
              <div className="step-block">
              {step === 1 && (
                <>
                  <div className="step-head">
                    <span className="step-eyebrow">{isArabic ? 'الخطوة 1 من 7' : 'Step 1 of 7'}</span>
                    <h3>{isArabic ? 'اختر نوع العقار' : 'Select property type'}</h3>
                    <p>{isArabic ? 'اختر إذا كان المشروع شقة أم فيلا.' : 'Choose whether the project is an apartment or villa.'}</p>
                  </div>
                  <div className="option-grid" style={{ marginTop: 22 }}>
                    {propertyTypeOptions.map((option) => (
                      <button
                        key={option.id}
                        type="button"
                        className={`option-card ${serviceType === option.id ? 'active' : ''}`}
                        onClick={() => setServiceType(option.id)}
                      >
                        <span className="option-icon material-symbols-rounded">{option.icon}</span>
                        <span className="option-copy">
                          <strong>{getPropertyTypeTitle(option.id, isArabic)}</strong>
                          <small>{option.id === 'apartment'
                            ? (isArabic ? 'وحدة شقة معيارية' : 'Standard apartment unit')
                            : (isArabic ? 'فيلا متعددة الطوابق مع مساحة خارجية' : 'Multi-floor villa with outdoor space')}
                          </small>
                        </span>
                      </button>
                    ))}
                  </div>
                </>
              )}

              {step === 2 && (
                <>
                  <div className="step-head">
                    <span className="step-eyebrow">{isArabic ? 'الخطوة 2 من 7' : 'Step 2 of 7'}</span>
                    <h3>{isArabic ? 'تفاصيل العقار' : 'Property details'}</h3>
                    <p>{serviceType === 'villa'
                      ? (isArabic ? 'أدخل تفاصيل الفيلا والمساحات الخارجية.' : 'Enter the villa details and outdoor features.')
                      : (isArabic ? 'أدخل مساحة الشقة للتقدير.' : 'Enter the apartment area for the estimate.')}
                    </p>
                  </div>

                  <div className="input-wrap" style={{ marginTop: 28 }}>
                    <label htmlFor="propertyArea">{serviceType === 'villa'
                      ? (isArabic ? 'مساحة الفيلا (م²)' : 'Villa area (m²)')
                      : (isArabic ? 'مساحة الشقة (م²)' : 'Apartment area (m²)')}
                    </label>
                    <input
                      id="propertyArea"
                      type="number"
                      value={propertyArea}
                      onChange={(event) => setPropertyArea(event.target.value)}
                      placeholder={serviceType === 'villa' ? 'Example: 320' : 'Example: 180'}
                    />
                  </div>

                  {serviceType === 'villa' && (
                    <>
                      <div className="input-wrap">
                        <label htmlFor="villaFloors">{isArabic ? 'عدد الطوابق' : 'Number of floors'}</label>
                        <input
                          id="villaFloors"
                          type="number"
                          value={villaFloors}
                          onChange={(event) => setVillaFloors(event.target.value)}
                          placeholder="Example: 2"
                        />
                      </div>

                      <div className="input-wrap">
                        <span>{isArabic ? 'حديقة / مساحة خارجية' : 'Garden / outdoor area'}</span>
                        <div className="option-grid" style={{ marginTop: 0 }}>
                          <button
                            type="button"
                            className={`option-card ${!hasGarden ? 'active' : ''}`}
                            onClick={() => setHasGarden(false)}
                          >
                            <span className="option-icon material-symbols-rounded">close</span>
                            <span className="option-copy">
                              <strong>{isArabic ? 'لا' : 'No'}</strong>
                            </span>
                          </button>

                          <button
                            type="button"
                            className={`option-card ${hasGarden ? 'active' : ''}`}
                            onClick={() => setHasGarden(true)}
                          >
                            <span className="option-icon material-symbols-rounded">check</span>
                            <span className="option-copy">
                              <strong>{isArabic ? 'نعم' : 'Yes'}</strong>
                            </span>
                          </button>
                        </div>
                      </div>

                      {hasGarden && (
                        <div className="input-wrap">
                          <label htmlFor="gardenArea">{isArabic ? 'مساحة الحديقة (م²)' : 'Garden area (m²)'}</label>
                          <input
                            id="gardenArea"
                            type="number"
                            value={gardenArea}
                            onChange={(event) => setGardenArea(event.target.value)}
                            placeholder="Example: 120"
                          />
                        </div>
                      )}
                    </>
                  )}
                </>
              )}

              {step === 3 && (
                <>
                  <div className="step-head">
                    <span className="step-eyebrow">{isArabic ? 'الخطوة 3 من 7' : 'Step 3 of 7'}</span>
                    <h3>{isArabic ? 'توزيع الغرف' : 'Room distribution'}</h3>
                    <p>{isArabic ? 'حدد عدد الغرف والمساحات المتاحة في العقار.' : 'Set the number of rooms and available spaces for the property.'}</p>
                  </div>
                  <div className="counter-grid" style={{ marginTop: 20 }}>
                    {rooms.map((room) => (
                      <div key={room.id} className="counter-row filled" style={{ justifyContent: 'space-between', padding: '12px 14px' }}>
                        <span>{localizedRoomName(room.id)}</span>
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
                    <span className="step-eyebrow">{isArabic ? 'الخطوة 4 من 7' : 'Step 4 of 7'}</span>
                    <h3>{isArabic ? 'تخصيص الأجهزة والميزات لكل غرفة' : 'Assign devices and features to each room'}</h3>
                    <p>{isArabic ? 'اضغط على الغرفة وحدد الأجهزة الفرعية المطلوبة بدقة عالية.' : 'Select the room and choose the sub-features and quantities precisely.'}</p>
                  </div>
                  <div className="room-selector-bar" style={{ marginTop: 20 }}>
                    {rooms.map((room) => {
                      const isActive = room.id === selectedRoomId && room.count > 0;

                      return (
                        <div
                          key={room.id}
                          className={`room-selector-item ${isActive ? 'active' : ''}`}
                          onClick={() => {
                            if (room.count <= 0) return;
                            setSelectedRoomId(room.id);
                            setExpandedRoomId(room.id);
                          }}
                          onKeyDown={(event) => {
                            if ((event.key === 'Enter' || event.key === ' ') && room.count > 0) {
                              event.preventDefault();
                              setSelectedRoomId(room.id);
                              setExpandedRoomId(room.id);
                            }
                          }}
                          role="button"
                          tabIndex={room.count > 0 ? 0 : -1}
                          aria-disabled={room.count <= 0}
                        >
                          <div className="room-selector-top">
                            <span className="room-selector-icon material-symbols-rounded">meeting_room</span>
                            <span className="room-selector-count">{room.count}</span>
                          </div>
                          <span className="room-selector-label">{localizedRoomName(room.id)}</span>
                        </div>
                      );
                    })}
                  </div>
                  <div className="room-list" style={{ marginTop: 20 }}>
                    {activeRooms.length === 0 ? (
                      <div className="empty-state">{isArabic ? 'يرجى تحديد عدد الغرف أولاً في الخطوة السابقة لتتمكن من تخصيص ميزاتها.' : 'Please select room quantities first so you can assign features.'}</div>
                    ) : (() => {
                      const selectedRoom = activeRooms.find((room) => room.id === selectedRoomId) ?? activeRooms[0];

                      if (!selectedRoom) {
                        return null;
                      }

                      const isExpanded = expandedRoomId === selectedRoom.id;

                      return (
                        <div key={selectedRoom.id} className={`room-panel ${isExpanded ? 'expanded' : ''}`}>
                          <button
                            type="button"
                            className="room-header"
                            onClick={() => setExpandedRoomId(isExpanded ? null : selectedRoom.id)}
                          >
                            <span className="material-symbols-rounded">meeting_room</span>
                            <span className="room-title">{localizedRoomName(selectedRoom.id)}</span>
                          </button>

                          {isExpanded && (
                            <div className="room-body">
                              <div className="feature-group">
                                {Object.entries(categoryMetadata).map(([categoryKey, item]) => {
                                  const subItems = systemFeatureCatalog[categoryKey] ?? [];
                                  const selectedMap = selectedRoom.selectedSubFeatures[categoryKey] ?? {};

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
                                              <div className="feature-quantity-row">
                                                <button
                                                  type="button"
                                                  onClick={() => adjustFeatureQuantity(selectedRoom.id, categoryKey, subItem.id, -1)}
                                                  className="material-symbols-rounded"
                                                  aria-label="تقليل"
                                                >
                                                  remove
                                                </button>
                                                <span className="feature-quantity-value">{quantity}</span>
                                                <button
                                                  type="button"
                                                  onClick={() => adjustFeatureQuantity(selectedRoom.id, categoryKey, subItem.id, 1)}
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
                    })()}
                  </div>
                </>
              )}

              {step === 5 && (
                <>
                  <div className="step-head">
                    <span className="step-eyebrow">{isArabic ? 'الخطوة 5 من 8' : 'Step 5 of 8'}</span>
                    <h3>{isArabic ? 'اختر المنتجات المطلوبة' : 'Choose the required products'}</h3>
                    <p>{isArabic ? 'يمكنك تحديد أكثر من منتج، وسيتم جمعها في الملخص النهائي.' : 'You can select more than one product, and they will be collected in the final summary.'}</p>
                  </div>

                  {selectedCameraOptions.length > 0 && (
                    <div className="feature-group" style={{ marginTop: 22 }}>
                      <div className="feature-group-title">
                        <span className="material-symbols-rounded">check_circle</span>
                        <span>{isArabic ? 'المنتجات المختارة' : 'Selected products'}</span>
                      </div>
                      <div className="feature-grid" style={{ marginTop: 10 }}>
                        {selectedCameraOptions.map((item) => (
                          <button
                            key={item.id}
                            type="button"
                            className="feature-item selected"
                            style={{ pointerEvents: 'auto', textAlign: 'left' }}
                            onClick={() => toggleCameraModel(item.id)}
                          >
                            <span className="feature-icon material-symbols-rounded">check_circle</span>
                            <span className="feature-content">
                              <strong>{item.name}</strong>
                              <small>{item.description}</small>
                            </span>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="option-grid" style={{ marginTop: 22 }}>
                    {cameraCatalogSections.map((section) => (
                      <div key={section.title} style={{ gridColumn: '1 / -1' }}>
                        <div className="feature-group-title" style={{ marginBottom: 12 }}>
                          <span className="material-symbols-rounded">security</span>
                          <span>{section.title}</span>
                        </div>

                        <div className="option-grid" style={{ marginTop: 8 }}>
                          {section.items.map((item) => {
                            const isSelected = selectedCameraModels.includes(item.id);
                            return (
                              <button
                                key={item.id}
                                type="button"
                                className={`option-card ${isSelected ? 'active' : ''}`}
                                onClick={() => toggleCameraModel(item.id)}
                                style={{ textAlign: 'left', alignItems: 'flex-start' }}
                              >
                                <span className="option-icon material-symbols-rounded">videocam</span>
                                <span className="option-copy">
                                  <strong>{item.name}</strong>
                                  <small>{item.description}</small>
                                </span>
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}

              {step === 6 && (
                <>
                  <div className="step-head">
                    <span className="step-eyebrow">{isArabic ? 'الخطوة 6 من 8' : 'Step 6 of 8'}</span>
                    <h3>{isArabic ? 'بيانات التواصل' : 'Contact details'}</h3>
                    <p>{isArabic ? 'يرجى إدخال بياناتك لإرسال العروض والتفاصيل إليك.' : 'Please enter your details so we can send the proposal and follow-up.'}</p>
                  </div>
                  <div className="input-wrap" style={{ marginTop: 28 }}>
                    <label htmlFor="fullName">{isArabic ? 'الاسم بالكامل *' : 'Full name *'}</label>
                    <input id="fullName" value={fullName} onChange={(event) => setFullName(event.target.value)} placeholder={isArabic ? 'الاسم بالكامل' : 'Full name'} />
                  </div>
                  <div className="input-wrap">
                    <label htmlFor="phone">{isArabic ? 'رقم الهاتف / الواتساب *' : 'Phone / WhatsApp *'}</label>
                    <input id="phone" value={phoneNumber} onChange={(event) => setPhoneNumber(event.target.value)} placeholder={isArabic ? 'مثال: 966500000000' : 'Example: 966500000000'} />
                  </div>
                  <div className="input-wrap">
                    <label htmlFor="email">{isArabic ? 'البريد الإلكتروني (اختياري)' : 'Email (optional)'}</label>
                    <input id="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="example@email.com" />
                  </div>
                </>
              )}

              {step === 7 && (
                <>
                  <div className="step-head">
                    <span className="step-eyebrow">{isArabic ? 'الخطوة 7 من 8' : 'Step 7 of 8'}</span>
                    <h3>{isArabic ? 'اختر الباقات والتكلفة التقديرية' : 'Choose a package and estimate'}</h3>
                    <p>{isArabic ? 'حدد الباقة المناسبة لميزانيتك واحتياجاتك.' : 'Select the package that best fits your budget and requirements.'}</p>
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
                          <strong>{getPackageTitle(option.id, isArabic)}</strong>
                          <small>{getPackageSubtitle(option.id, isArabic)}</small>
                        </span>
                      </button>
                    ))}
                  </div>
                </>
              )}

              {step === 8 && (
                <>
                  <div className="step-head">
                    <span className="step-eyebrow">{isArabic ? 'ملخص الطلب' : 'Request summary'}</span>
                    <h3>{isArabic ? 'مراجعة المشروع النهائي' : 'Review the final project'}</h3>
                    <p>{isArabic ? 'راجع بياناتك قبل إرسال الطلب إلى فريقنا للحصول على العرض الأنسب لك.' : 'Review your details before sending the request for the best tailored proposal.'}</p>
                  </div>
                  <div className="room-list" style={{ marginTop: 20 }}>
                    <div className="room-panel expanded">
                      <div className="room-header" style={{ pointerEvents: 'none' }}>
                        <span className="material-symbols-rounded">summarize</span>
                        <span className="room-title">{isArabic ? 'ملخص الطلب' : 'Request summary'}</span>
                      </div>
                      <div className="room-body">
                        <div className="feature-group">
                          <div className="feature-grid">
                            <div className="feature-item selected summary-mini-card" style={{ pointerEvents: 'none' }}>
                              <span className="feature-icon material-symbols-rounded">chat_bubble_outline</span>
                              <span className="feature-content">
                                <strong>{isArabic ? 'طريقة التواصل' : 'Contact method'}</strong>
                                <small>{getPropertyTypeTitle(serviceType, isArabic)}</small>
                              </span>
                            </div>
                            <div className="feature-item selected summary-mini-card" style={{ pointerEvents: 'none' }}>
                              <span className="feature-icon material-symbols-rounded">straighten</span>
                              <span className="feature-content">
                                <strong>{isArabic ? 'المساحة' : 'Area'}</strong>
                                <small>{propertyArea} {isArabic ? 'متر مربع' : 'm²'}</small>
                              </span>
                            </div>
                            <div className="feature-item selected summary-mini-card" style={{ pointerEvents: 'none' }}>
                              <span className="feature-icon material-symbols-rounded">meeting_room</span>
                              <span className="feature-content">
                                <strong>{isArabic ? 'عدد الغرف' : 'Room count'}</strong>
                                <small>{activeRooms.length} {isArabic ? 'غرفة' : 'rooms'}</small>
                              </span>
                            </div>
                            <div className="feature-item selected summary-mini-card" style={{ pointerEvents: 'none' }}>
                              <span className="feature-icon material-symbols-rounded">auto_awesome</span>
                              <span className="feature-content">
                                <strong>{isArabic ? 'الميزات المختارة' : 'Selected features'}</strong>
                                <small>{totalSelectedFeatures} {isArabic ? 'عنصر' : 'items'}</small>
                              </span>
                            </div>
                            <div className="feature-item selected summary-mini-card" style={{ pointerEvents: 'none' }}>
                              <span className="feature-icon material-symbols-rounded">videocam</span>
                              <span className="feature-content">
                                <strong>{isArabic ? 'المنتجات المختارة' : 'Selected products'}</strong>
                                <small>{selectedCameraOptions.length ? selectedCameraOptions.map((item) => item.name).join(' • ') : (isArabic ? 'لا يوجد منتج محدد' : 'No product selected')}</small>
                              </span>
                            </div>
                            <div className="feature-item selected summary-mini-card" style={{ pointerEvents: 'none' }}>
                              <span className="feature-icon material-symbols-rounded">person</span>
                              <span className="feature-content">
                                <strong>{isArabic ? 'الاسم' : 'Name'}</strong>
                                <small>{fullName || (isArabic ? 'غير محدد' : 'Not provided')}</small>
                              </span>
                            </div>
                            <div className="feature-item selected summary-mini-card" style={{ pointerEvents: 'none' }}>
                              <span className="feature-icon material-symbols-rounded">star_outline</span>
                              <span className="feature-content">
                                <strong>{isArabic ? 'الباقة' : 'Package'}</strong>
                                <small>{getPackageTitle(selectedPackage, isArabic)}</small>
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

          {step === 8 && (
            <div className="summary-card professional-summary">
              <div className="summary-header-row">
                <div>
                  <span className="summary-label">{isArabic ? 'التكلفة التقديرية' : 'Estimated investment'}</span>
                  <h4>{isArabic ? 'ملخص المشروع' : 'Project overview'}</h4>
                </div>
                <span className="summary-badge">{selectedPackage === 'pro' ? 'PRO' : (isArabic ? 'أساسي' : 'Basic')}</span>
              </div>
              <div className="summary-price">{formatCurrency(estimatedPrice, isArabic)}</div>
              <div className="summary-list">
                <div className="summary-item"><span>{isArabic ? 'نوع العقار' : 'Property type'}</span><strong>{serviceType === 'villa' ? (isArabic ? 'فيلا' : 'Villa') : (isArabic ? 'شقة' : 'Apartment')}</strong></div>
                <div className="summary-item"><span>{isArabic ? 'المساحة' : 'Area'}</span><strong>{propertyArea || 0} م²</strong></div>
                <div className="summary-item"><span>{isArabic ? 'الغرف' : 'Rooms'}</span><strong>{activeRooms.length}</strong></div>
                <div className="summary-item"><span>{isArabic ? 'الميزات' : 'Features'}</span><strong>{totalSelectedFeatures}</strong></div>
                <div className="summary-item"><span>{isArabic ? 'المنتجات المختارة' : 'Selected products'}</span><strong>{selectedCameraModels.length ? selectedCameraModels.length : 0}</strong></div>
              </div>
              <div className="summary-footer-note">
                {isArabic ? 'تم إعداد العرض بناءً على متطلبات المشروع المختارة.' : 'This estimate is tailored to your selected smart-home requirements.'}
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
                {isArabic ? 'رجوع' : 'Back'}
              </button>

              {step < totalSteps ? (
                <button type="button" className="btn btn-primary" onClick={nextStep}>
                  {isArabic ? 'التالي' : 'Next'}
                </button>
              ) : (
                <button type="button" className="btn btn-primary" onClick={submitRequest}>
                  {isArabic ? 'إرسال الطلب' : 'Submit request'}
                </button>
              )}
            </div>
          )}

          <div className="contact-strip">
            <h4>{isArabic ? 'تواصل معنا' : 'Contact us'}</h4>
            <div className="contact-strip-grid">
              <div className="contact-item"><span className="material-symbols-rounded">call</span> 01116107777</div>
              <div className="contact-item"><span className="material-symbols-rounded">call</span> 01116041111</div>
              <div className="contact-item"><span className="material-symbols-rounded">call</span> 01002081073</div>
              <div className="contact-item"><span className="material-symbols-rounded">mail</span> yam4lcs@gmail.com</div>
              <div className="contact-item"><span className="material-symbols-rounded">location_on</span> {isArabic ? 'القاهرة، الخليفة' : 'Cairo, Khalifa'}</div>
              <div className="contact-item"><span className="material-symbols-rounded">person</span> {isArabic ? 'المهندس: SEO Ahmed Moustafa' : 'Engineer: SEO Ahmed Moustafa'}</div>
            </div>
          </div>
        </section>
      </div>
    )}

      {chatOpen && (
        <aside className="chat-widget">
          <div className="chat-header">
            <div>
              <strong>{isArabic ? 'الدعم المباشر' : 'Live support'}</strong>
              <small>{isArabic ? 'متصل الآن' : 'Online now'}</small>
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
              placeholder={isArabic ? 'اكتب سؤالك…' : 'Type your question…'}
              onKeyDown={(event) => {
                if (event.key === 'Enter') {
                  sendChatMessage();
                }
              }}
            />
            <button type="button" onClick={sendChatMessage}>{isArabic ? 'إرسال' : 'Send'}</button>
          </div>
        </aside>
      )}

      {!chatOpen && (
        <button type="button" className="chat-fab" onClick={() => setChatOpen(true)} aria-label={isArabic ? 'فتح الدردشة' : 'Open chat'}>
          <span className="material-symbols-rounded">support_agent</span>
        </button>
      )}
    </main>
  );
}
