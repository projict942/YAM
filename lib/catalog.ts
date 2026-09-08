export type CatalogCategory = {
  id: string;
  name: string;
  icon: string;
};

export type CatalogSubCategory = {
  id: string;
  categoryId: string;
  name: string;
};

export type CatalogBrand = {
  id: string;
  name: string;
  logoUrl: string;
};

export type CatalogVariant = {
  id: string;
  label: string;
  price: number;
};

export type CatalogProduct = {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  brandId: string;
  categoryId: string;
  subCategoryId: string;
  variants: CatalogVariant[];
};

export type CatalogPayload = {
  categories: CatalogCategory[];
  subCategories: CatalogSubCategory[];
  brands: CatalogBrand[];
  products: CatalogProduct[];
};

const productImages = {
  camera: 'https://images.unsplash.com/photo-1558008258-3256797b43f3?auto=format&fit=crop&w=640&q=80',
  nvr: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=640&q=80',
  speaker: 'https://images.unsplash.com/photo-1545454675-3531b543be5d?auto=format&fit=crop&w=640&q=80',
  amplifier: 'https://images.unsplash.com/photo-1558089687-f282ffcbc126?auto=format&fit=crop&w=640&q=80',
  lighting: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=640&q=80',
  dimmer: 'https://images.unsplash.com/photo-1550989460-0adf9ea622e2?auto=format&fit=crop&w=640&q=80',
  lock: 'https://images.unsplash.com/photo-1558008258-3256797b43f3?auto=format&fit=crop&w=640&q=80',
  intercom: 'https://images.unsplash.com/photo-1557597774-9d273605dfa9?auto=format&fit=crop&w=640&q=80',
  motion: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=640&q=80',
  safety: 'https://images.unsplash.com/photo-1585771724684-38269d6639fd?auto=format&fit=crop&w=640&q=80',
  networking: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=640&q=80',
  poe: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=640&q=80',
};

export const fallbackCatalog: CatalogPayload = {
  categories: [
    { id: 'cctv', name: 'CCTV', icon: 'videocam' },
    { id: 'audio', name: 'Audio', icon: 'speaker_group' },
    { id: 'lighting', name: 'Smart Lighting', icon: 'lightbulb' },
    { id: 'locks', name: 'Locks & Intercom', icon: 'lock' },
    { id: 'sensors', name: 'Sensors', icon: 'sensors' },
    { id: 'networking', name: 'Networking', icon: 'wifi' },
  ],
  subCategories: [
    { id: 'ip-cams', categoryId: 'cctv', name: 'IP Cameras' },
    { id: 'nvrs', categoryId: 'cctv', name: 'NVRs' },
    { id: 'ceiling-speakers', categoryId: 'audio', name: 'Ceiling Speakers' },
    { id: 'amplifiers', categoryId: 'audio', name: 'Amplifiers' },
    { id: 'touch-switches', categoryId: 'lighting', name: 'Touch Switches' },
    { id: 'dimmers', categoryId: 'lighting', name: 'Dimmers' },
    { id: 'smart-locks', categoryId: 'locks', name: 'Smart Locks' },
    { id: 'video-intercom', categoryId: 'locks', name: 'Video Intercom' },
    { id: 'motion', categoryId: 'sensors', name: 'Motion Sensors' },
    { id: 'safety', categoryId: 'sensors', name: 'Safety Sensors' },
    { id: 'wifi', categoryId: 'networking', name: 'Wi-Fi Mesh' },
    { id: 'poe', categoryId: 'networking', name: 'PoE Switches' },
  ],
  brands: [
    { id: 'hikvision', name: 'Hikvision', logoUrl: 'https://res.cloudinary.com/dyvadd9tt/image/upload/v1788811016/YAM_gpd2k1.png' },
    { id: 'tuya', name: 'Tuya', logoUrl: 'https://logo.clearbit.com/tuya.com' },
    { id: 'sonoff', name: 'Sonoff', logoUrl: 'https://logo.clearbit.com/itead.cc' },
    { id: 'aqara', name: 'Aqara', logoUrl: 'https://logo.clearbit.com/aqara.com' },
    { id: 'tplink', name: 'TP-Link', logoUrl: 'https://logo.clearbit.com/tp-link.com' },
  ],
  products: [
    { id: 'hikvision-ip-camera', name: 'Hikvision IP Camera', description: 'Outdoor camera with night vision and weather protection.', imageUrl: productImages.camera, brandId: 'hikvision', categoryId: 'cctv', subCategoryId: 'ip-cams', variants: [{ id: '2mp', label: '2MP', price: 2500 }, { id: '5mp', label: '5MP', price: 3200 }] },
    { id: 'hikvision-nvr', name: 'Hikvision NVR', description: 'PoE network recorder for multi-camera installations.', imageUrl: productImages.nvr, brandId: 'hikvision', categoryId: 'cctv', subCategoryId: 'nvrs', variants: [{ id: '4ch', label: '4 Channels', price: 4800 }, { id: '8ch', label: '8 Channels', price: 7800 }, { id: '16ch', label: '16 Channels', price: 12500 }] },
    { id: 'tuya-ceiling-speaker', name: 'Tuya Ceiling Speaker', description: 'Hidden ceiling speaker for distributed home audio.', imageUrl: productImages.speaker, brandId: 'tuya', categoryId: 'audio', subCategoryId: 'ceiling-speakers', variants: [{ id: '5-inch', label: '5 inch', price: 1800 }, { id: '6-inch', label: '6.5 inch', price: 3000 }, { id: '8-inch', label: '8 inch', price: 7000 }] },
    { id: 'tuya-amplifier', name: 'Tuya In-Wall Amplifier', description: 'Touch amplifier with Wi-Fi and Bluetooth.', imageUrl: productImages.amplifier, brandId: 'tuya', categoryId: 'audio', subCategoryId: 'amplifiers', variants: [{ id: 'mini', label: 'Mini 4 inch', price: 9000 }, { id: 'android', label: 'Android 7 inch', price: 16500 }] },
    { id: 'sonoff-touch-switch', name: 'Sonoff Touch Switch', description: 'Glass touch switch for smart lighting scenes.', imageUrl: productImages.lighting, brandId: 'sonoff', categoryId: 'lighting', subCategoryId: 'touch-switches', variants: [{ id: '1-gang', label: '1 Gang', price: 1100 }, { id: '2-gang', label: '2 Gang', price: 1450 }, { id: '3-gang', label: '3 Gang', price: 1800 }] },
    { id: 'tuya-dimmer', name: 'Tuya Smart Dimmer', description: 'Adjustable lighting control with app scenes.', imageUrl: productImages.dimmer, brandId: 'tuya', categoryId: 'lighting', subCategoryId: 'dimmers', variants: [{ id: 'single', label: 'Single', price: 1800 }, { id: 'double', label: 'Double', price: 2600 }] },
    { id: 'aqara-smart-lock', name: 'Aqara Smart Lock', description: 'Fingerprint, PIN, NFC, and mobile access.', imageUrl: productImages.lock, brandId: 'aqara', categoryId: 'locks', subCategoryId: 'smart-locks', variants: [{ id: 'a100', label: 'A100', price: 21000 }, { id: 'u100', label: 'U100', price: 24000 }] },
    { id: 'hikvision-intercom', name: 'Hikvision Video Intercom', description: 'Outdoor station and indoor monitor kit.', imageUrl: productImages.intercom, brandId: 'hikvision', categoryId: 'locks', subCategoryId: 'video-intercom', variants: [{ id: 'basic', label: 'Basic Kit', price: 15000 }, { id: 'pro', label: 'Pro Kit', price: 22000 }] },
    { id: 'sonoff-motion', name: 'Sonoff Motion Sensor', description: 'Fast motion detection for smart automation.', imageUrl: productImages.motion, brandId: 'sonoff', categoryId: 'sensors', subCategoryId: 'motion', variants: [{ id: 'standard', label: 'Standard', price: 850 }, { id: 'presence', label: 'Presence', price: 4200 }] },
    { id: 'tuya-safety-sensor', name: 'Tuya Safety Sensor', description: 'Smoke, gas, and water leak protection.', imageUrl: productImages.safety, brandId: 'tuya', categoryId: 'sensors', subCategoryId: 'safety', variants: [{ id: 'smoke', label: 'Smoke', price: 1200 }, { id: 'water', label: 'Water Leak', price: 1000 }, { id: 'gas', label: 'Gas', price: 1400 }] },
    { id: 'tplink-mesh', name: 'TP-Link Wi-Fi Mesh', description: 'Whole-home Wi-Fi 6 coverage.', imageUrl: productImages.networking, brandId: 'tplink', categoryId: 'networking', subCategoryId: 'wifi', variants: [{ id: '2-pack', label: '2 Pack', price: 12000 }, { id: '3-pack', label: '3 Pack', price: 16500 }] },
    { id: 'hikvision-poe', name: 'Hikvision PoE Switch', description: 'Power and data for IP camera networks.', imageUrl: productImages.poe, brandId: 'hikvision', categoryId: 'networking', subCategoryId: 'poe', variants: [{ id: '8-port', label: '8 Port', price: 4600 }, { id: '16-port', label: '16 Port', price: 7200 }] },
  ],
};
