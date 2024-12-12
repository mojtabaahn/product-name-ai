'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Switch } from '@headlessui/react';
import clsx from 'clsx';
import NameSuggestions from './NameSuggestions';
import { useAnalytics } from '@/hooks/useAnalytics';

type FormData = {
  productUrl?: string;
  productName?: string;
  productDescription?: string;
  category?: string;
  brandName?: string;
};

type NameSuggestion = {
  name: string;
  reasoning: string;
};

type NameAnalysis = {
  strengths: string[];
  weaknesses: string[];
};

type ApiResponse = {
  currentNameAnalysis: NameAnalysis;
  suggestions: NameSuggestion[];
};

export default function ProductNameForm() {
  const { register, handleSubmit } = useForm<FormData>();
  const [preferences, setPreferences] = useState<{
    includeBrand: boolean;
    includeCategory: boolean;
    includeFeatures: boolean;
    nameLength: 'short' | 'medium' | 'long';
  }>({
    includeBrand: true,
    includeCategory: true,
    includeFeatures: true,
    nameLength: 'medium',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [results, setResults] = useState<ApiResponse | null>(null);
  const { trackGenerateNames, trackProductFetch } = useAnalytics();

  const onSubmit = async (data: FormData) => {
    try {
      setLoading(true);
      setError(null);

      if (data.productUrl) {
        trackProductFetch(data.productUrl, true);
      }

      trackGenerateNames({
        title: data.productName,
        category: data.category,
        nameLength: data.nameLength,
      });

      const response = await fetch('/api/generate-names', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...data,
          preferences,
        }),
      });

      if (!response.ok) {
        throw new Error('خطا در دریافت پاسخ از سرور');
      }

      const results = await response.json();
      setResults(results);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'خطایی رخ داده است');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Product URL Input */}
        <div>
          <label htmlFor="productUrl" className="mb-2 block text-sm font-medium">
            لینک محصول (اختیاری)
          </label>
          <input
            type="url"
            id="productUrl"
            {...register('productUrl')}
            className="input-field"
            placeholder="https://basalam.com/product/..."
            dir="ltr"
          />
        </div>

        {/* Product Information */}
        <div className="space-y-4">
          <div>
            <label htmlFor="productName" className="mb-2 block text-sm font-medium">
              نام فعلی محصول
            </label>
            <input
              type="text"
              id="productName"
              {...register('productName')}
              className="input-field"
              dir="rtl"
              required
            />
          </div>

          <div>
            <label htmlFor="productDescription" className="mb-2 block text-sm font-medium">
              توضیحات محصول
            </label>
            <textarea
              id="productDescription"
              {...register('productDescription')}
              className="input-field"
              rows={4}
              dir="rtl"
              required
            />
          </div>

          <div>
            <label htmlFor="category" className="mb-2 block text-sm font-medium">
              دسته‌بندی
            </label>
            <input
              type="text"
              id="category"
              {...register('category')}
              className="input-field"
              dir="rtl"
              required
            />
          </div>

          <div>
            <label htmlFor="brandName" className="mb-2 block text-sm font-medium">
              نام برند (اختیاری)
            </label>
            <input
              type="text"
              id="brandName"
              {...register('brandName')}
              className="input-field"
              dir="rtl"
            />
          </div>
        </div>

        {/* Preferences */}
        <div className="rounded-lg border border-gray-200 p-4">
          <h3 className="mb-4 text-lg font-medium">تنظیمات نام‌گذاری</h3>
          
          <div className="space-y-4">
            <Switch.Group>
              <div className="flex items-center justify-between">
                <Switch.Label className="text-sm">شامل نام برند</Switch.Label>
                <Switch
                  checked={preferences.includeBrand}
                  onChange={(checked) =>
                    setPreferences((prev) => ({ ...prev, includeBrand: checked }))
                  }
                  className={clsx(
                    'relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2',
                    preferences.includeBrand ? 'bg-blue-600' : 'bg-gray-200'
                  )}
                >
                  <span
                    className={clsx(
                      'inline-block h-4 w-4 transform rounded-full bg-white transition-transform',
                      preferences.includeBrand ? 'translate-x-6' : 'translate-x-1'
                    )}
                  />
                </Switch>
              </div>
            </Switch.Group>

            <Switch.Group>
              <div className="flex items-center justify-between">
                <Switch.Label className="text-sm">شامل دسته‌بندی</Switch.Label>
                <Switch
                  checked={preferences.includeCategory}
                  onChange={(checked) =>
                    setPreferences((prev) => ({ ...prev, includeCategory: checked }))
                  }
                  className={clsx(
                    'relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2',
                    preferences.includeCategory ? 'bg-blue-600' : 'bg-gray-200'
                  )}
                >
                  <span
                    className={clsx(
                      'inline-block h-4 w-4 transform rounded-full bg-white transition-transform',
                      preferences.includeCategory ? 'translate-x-6' : 'translate-x-1'
                    )}
                  />
                </Switch>
              </div>
            </Switch.Group>

            <Switch.Group>
              <div className="flex items-center justify-between">
                <Switch.Label className="text-sm">شامل ویژگی‌های اصلی</Switch.Label>
                <Switch
                  checked={preferences.includeFeatures}
                  onChange={(checked) =>
                    setPreferences((prev) => ({ ...prev, includeFeatures: checked }))
                  }
                  className={clsx(
                    'relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2',
                    preferences.includeFeatures ? 'bg-blue-600' : 'bg-gray-200'
                  )}
                >
                  <span
                    className={clsx(
                      'inline-block h-4 w-4 transform rounded-full bg-white transition-transform',
                      preferences.includeFeatures ? 'translate-x-6' : 'translate-x-1'
                    )}
                  />
                </Switch>
              </div>
            </Switch.Group>

            <div>
              <label className="mb-2 block text-sm">طول نام محصول</label>
              <div className="flex gap-4">
                {['short', 'medium', 'long'].map((length) => (
                  <button
                    key={length}
                    type="button"
                    className={clsx(
                      'rounded-lg px-4 py-2 text-sm',
                      preferences.nameLength === length
                        ? 'bg-blue-600 text-white'
                        : 'border border-gray-300 hover:bg-gray-100'
                    )}
                    onClick={() =>
                      setPreferences((prev) => ({
                        ...prev,
                        nameLength: length as 'short' | 'medium' | 'long',
                      }))
                    }
                  >
                    {length === 'short' && 'کوتاه'}
                    {length === 'medium' && 'متوسط'}
                    {length === 'long' && 'بلند'}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        <button
          type="submit"
          className="btn-primary w-full"
          disabled={loading}
        >
          {loading ? 'در حال پردازش...' : 'دریافت پیشنهاد نام'}
        </button>

        {error && (
          <div className="rounded-lg bg-red-50 p-4 text-red-600">
            {error}
          </div>
        )}
      </form>

      {results && <NameSuggestions {...results} />}
    </div>
  );
}
