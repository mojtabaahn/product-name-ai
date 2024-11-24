import { NextResponse } from 'next/server';
import OpenAI from 'openai';
import { redis } from '@/lib/redis';

interface Attribute {
  title: string;
  value: string;
  unit?: string;
}

interface AttributeGroup {
  title: string;
  attributes: Attribute[];
}

interface ProductInfo {
  title?: string;
  name?: string;
  description: string;
  category: string;
  brandName?: string;
  attribute_groups?: AttributeGroup[];
  attributes?: Attribute[];
}

interface Preferences {
  includeBrand: boolean;
  includeCategory: boolean;
  includeFeatures: boolean;
  nameLength: 'short' | 'medium' | 'long';
}

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  baseURL: "https://oai.helicone.ai/v1",
  defaultHeaders: {
    "Helicone-Auth": `Bearer ${process.env.HELICONE_API_KEY}`,
  },
});

async function fetchBasalamProduct(url: string) {
  try {
    // استفاده از آدرس کامل برای API
    const baseUrl = process.env.VERCEL_URL 
      ? `https://${process.env.VERCEL_URL}` 
      : 'http://localhost:3000';
    
    const response = await fetch(`${baseUrl}/api/fetch-basalam-product?url=${encodeURIComponent(url)}`);
    if (!response.ok) {
      throw new Error('خطا در دریافت اطلاعات محصول از باسلام');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching Basalam product:', error);
    return null;
  }
}

export async function POST(request: Request) {
  try {
    await redis.incr('total_requests');
    
    const body = await request.json();
    const { productInfo, preferences }: { productInfo: ProductInfo; preferences: Preferences } = body;

    const prompt = `
      لطفاً 5 نام مناسب برای یک محصول با مشخصات زیر پیشنهاد دهید:
      
      نام فعلی: ${productInfo.title || productInfo.name}
      توضیحات: ${productInfo.description}
      دسته‌بندی: ${productInfo.category}
      برند: ${productInfo.brandName || 'ندارد'}

      ${productInfo.attribute_groups ? `
      ویژگی‌های محصول:
      ${productInfo.attribute_groups.map((group: AttributeGroup) => `
      ${group.title}:
      ${group.attributes.map((attr: Attribute) => `- ${attr.title}: ${attr.value}${attr.unit ? ` (${attr.unit})` : ''}`).join('\n')}
      `).join('\n')}
      ` : productInfo.attributes ? `
      ویژگی‌ها:
      ${productInfo.attributes.map((attr: Attribute) => `- ${attr.title}: ${attr.value}`).join('\n')}
      ` : ''}
      
      ترجیحات نام‌گذاری:
      - ${preferences.includeBrand ? 'شامل نام برند' : 'بدون نام برند'}
      - ${preferences.includeCategory ? 'شامل دسته‌بندی' : 'بدون دسته‌بندی'}
      - ${preferences.includeFeatures ? 'شامل ویژگی‌های اصلی' : 'بدون ویژگی‌های اصلی'}
      - طول نام: ${
        preferences.nameLength === 'short'
          ? 'کوتاه'
          : preferences.nameLength === 'medium'
          ? 'متوسط'
          : 'بلند'
      }

      راهنمایی برای نام‌گذاری:
      1. از ویژگی‌های مهم و متمایزکننده محصول استفاده کنید (مثل جنس، رنگ، سایز)
      2. اگر محصول کاربرد خاصی دارد (مثل مناسب برای دانشگاه)، می‌توانید از آن در نام استفاده کنید
      3. اگر محصول ویژگی خاصی در نگهداری دارد، می‌تواند در نام‌گذاری مفید باشد
      4. برای محصولات با چند رنگ یا سایز، می‌توانید از عبارت "تنوع" یا "چند رنگ" استفاده کنید
      
      همچنین برای نام فعلی محصول، نقاط قوت و ضعف آن را تحلیل کنید.
      
      پاسخ را دقیقاً در قالب JSON زیر برگردانید، بدون هیچ توضیح اضافه یا کد markdown:
      {
        "currentNameAnalysis": {
          "strengths": ["نقطه قوت 1", "نقطه قوت 2"],
          "weaknesses": ["نقطه ضعف 1", "نقطه ضعف 2"]
        },
        "suggestions": [
          {
            "name": "نام پیشنهادی 1",
            "reasoning": "دلیل انتخاب این نام"
          }
        ]
      }
    `;

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini-2024-07-18',
      messages: [
        {
          role: 'system',
          content:
            'شما یک متخصص نام‌گذاری محصولات هستید که به فروشندگان آنلاین کمک می‌کنید نام‌های مناسب و جذاب برای محصولاتشان انتخاب کنند. پاسخ شما باید دقیقاً در قالب JSON مشخص شده باشد، بدون هیچ کد markdown یا توضیح اضافه.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      temperature: 0.7,
      max_tokens: 2000,
      response_format: { type: "json_object" }
    });

    const result = completion.choices[0].message.content;
    return NextResponse.json(JSON.parse(result || '{}'));
  } catch (error) {
    console.error('Error generating names:', error);
    return NextResponse.json(
      { error: 'خطا در تولید نام‌های پیشنهادی' },
      { status: 500 }
    );
  }
}
