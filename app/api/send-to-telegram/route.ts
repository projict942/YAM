import { NextRequest, NextResponse } from 'next/server';

const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN || '';
const CHAT_ID = process.env.TELEGRAM_CHAT_ID || '';
const TELEGRAM_API = BOT_TOKEN ? `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage` : '';

interface QuotationData {
  serviceType: string;
  propertyArea: number;
  rooms: Array<{
    id: string;
    name: string;
    count: number;
    selectedFeatures: string[];
  }>;
  selectedProducts?: string[];
  fullName: string;
  phoneNumber: string;
  email?: string;
  selectedPackage: string;
  totalFeatures: number;
  finalPrice?: number;
}

const formatCurrency = (value: number) =>
  new Intl.NumberFormat('ar-EG', {
    style: 'currency',
    currency: 'EGP',
    maximumFractionDigits: 0,
  }).format(value || 0);

export async function POST(request: NextRequest) {
  try {
    if (!BOT_TOKEN || !CHAT_ID || !TELEGRAM_API) {
      return NextResponse.json(
        { error: 'Telegram credentials are missing. Add TELEGRAM_BOT_TOKEN and TELEGRAM_CHAT_ID in Vercel environment variables.' },
        { status: 500 }
      );
    }

    const data: QuotationData = await request.json();

    // No database is required for this setup: data is sent directly to Telegram.
    const quotationId = Date.now();

    // Format the message for Telegram
    const totalRoomUnits = data.rooms.reduce((sum, room) => sum + room.count, 0);
    const selectedProducts = data.selectedProducts?.filter(Boolean) ?? [];

    let message = `🏠 <b>طلب عرض سعر جديد - YAM</b>\n\n`;

    message += `📋 <b>معلومات الطلب:</b>\n`;
    message += `• طريقة التواصل: ${data.serviceType}\n`;
    message += `• المساحة: ${data.propertyArea} متر مربع\n`;
    message += `• عدد الغرف: ${totalRoomUnits}\n`;
    message += `• عدد الميزات المختارة: ${data.totalFeatures}\n`;
    message += `• الباقة: ${data.selectedPackage}\n`;
    message += `• السعر النهائي: ${formatCurrency(data.finalPrice ?? 0)}\n`;
    if (selectedProducts.length > 0) {
      message += `• المنتجات المختارة: ${selectedProducts.join(', ')}\n`;
    }
    message += `• رقم الطلب: ${quotationId ? '#' + quotationId : '#-'}\n\n`;

    message += `👤 <b>بيانات العميل:</b>\n`;
    message += `• الاسم: ${data.fullName}\n`;
    message += `• الهاتف: ${data.phoneNumber}\n`;
    if (data.email) {
      message += `• البريد الإلكتروني: ${data.email}\n`;
    }
    message += `\n`;

    message += `🏘️ <b>تفصيل الغرف والميزات:</b>\n`;
    data.rooms.forEach((room) => {
      if (room.count > 0 && room.selectedFeatures.length > 0) {
        message += `\n<b>${room.name}</b> (${room.count})\n`;
        room.selectedFeatures.forEach((feature) => {
          message += `  ✓ ${feature}\n`;
        });
      }
    });

    if (!data.rooms.some((room) => room.count > 0 && room.selectedFeatures.length > 0)) {
      message += `• لا توجد ميزات محددة بعد\n`;
    }

    message += `\n⏰ <i>تم الاستقبال بتاريخ: ${new Date().toLocaleString('ar-SA')}</i>`;

    // Send to Telegram
    const response = await fetch(TELEGRAM_API, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        chat_id: CHAT_ID,
        text: message,
        parse_mode: 'HTML',
      }),
    });

    const result = await response.json();

    if (!response.ok) {
      console.error('Telegram API Error:', result);
      return NextResponse.json(
        { error: 'Failed to send message to Telegram', details: result },
        { status: response.status }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'تم إرسال الطلب بنجاح إلى الفريق',
      quotationId,
      telegramMessageId: result.result.message_id,
    });
  } catch (error) {
    console.error('Error sending to Telegram:', error);
    return NextResponse.json(
      { error: 'Failed to process request', details: String(error) },
      { status: 500 }
    );
  }
}
