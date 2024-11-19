import { NextResponse } from 'next/server';

interface BasalamProduct {
  id: number;
  title: string;
  description: string;
  photo: {
    original: string;
    lg: string;
  };
  photos: Array<{
    original: string;
    lg: string;
  }>;
  category: {
    title: string;
    parent?: {
      title: string;
      parent?: {
        title: string;
      };
    };
  };
  attribute_groups: Array<{
    title: string;
    attributes: Array<{
      title: string;
      value: string;
    }>;
  }>;
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    let productId = searchParams.get('id');

    // اگر URL کامل باسلام داده شده، ID را از آن استخراج می‌کنیم
    if (!productId && searchParams.has('url')) {
      const url = searchParams.get('url') as string;
      const matches = url.match(/\/product\/(\d+)/);
      if (matches) {
        productId = matches[1];
      }
    }

    if (!productId) {
      return NextResponse.json(
        { error: 'شناسه محصول یا URL باسلام را وارد کنید' },
        { status: 400 }
      );
    }

    const response = await fetch(
      `https://core.basalam.com/v3/products/${productId}`,
      {
        headers: {
          Accept: 'application/json',
        },
      }
    );

    if (!response.ok) {
      throw new Error(`خطا در دریافت اطلاعات محصول: ${response.statusText}`);
    }

    const product: BasalamProduct = await response.json();

    // استخراج اطلاعات مهم محصول
    const productInfo = {
      title: product.title,
      description: product.description,
      category: {
        main: product.category.parent?.parent?.title || '',
        sub: product.category.parent?.title || '',
        leaf: product.category.title,
      },
      images: [
        product.photo,
        ...(product.photos || [])
      ].map(photo => ({
        original: photo.original,
        large: photo.lg,
      })),
      attribute_groups: product.attribute_groups || [],
    };

    return NextResponse.json(productInfo);
  } catch (error) {
    console.error('Error fetching Basalam product:', error);
    return NextResponse.json(
      { error: 'خطا در دریافت اطلاعات محصول از باسلام' },
      { status: 500 }
    );
  }
}
