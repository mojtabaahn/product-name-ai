'use client';

import { useState, useEffect } from 'react';
import { ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/24/outline';
import { useAnalytics } from '@/hooks/useAnalytics';

interface Preferences {
  includeBrand: boolean;
  includeCategory: boolean;
  includeFeatures: boolean;
  nameLength: 'short' | 'medium' | 'long';
}

interface NameSuggestion {
  name: string;
  reasoning: string;
}

interface NameAnalysis {
  strengths: string[];
  weaknesses: string[];
}

interface BasalamProduct {
  title: string;
  description: string;
  category: {
    main: string;
    sub: string;
    leaf: string;
  };
  images: Array<{
    original: string;
    large: string;
  }>;
  attribute_groups: Array<{
    title: string;
    attributes: Array<{
      id?: number;
      title: string;
      value: string;
      unit?: string;
      type?: {
        name: string;
        value?: number;
        description?: string;
      };
      required?: boolean;
    }>;
  }>;
}

interface ApiResponse {
  currentNameAnalysis: NameAnalysis;
  suggestions: NameSuggestion[];
}

export default function Home() {
  const { trackPageView, trackCopyName } = useAnalytics();
  const [productUrl, setProductUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [productInfo, setProductInfo] = useState<BasalamProduct | null>(null);
  const [generatedNames, setGeneratedNames] = useState<NameSuggestion[]>([]);
  const [manualInput, setManualInput] = useState({
    title: '',
    description: '',
    category: '',
    brandName: '',
    attributes: [],
    images: []
  });
  const [preferences, setPreferences] = useState<Preferences>({
    includeBrand: true,
    includeCategory: true,
    includeFeatures: true,
    nameLength: 'medium'
  });
  const [isGenerating, setIsGenerating] = useState(false);
  const [expandedSections, setExpandedSections] = useState({
    attributes: true,
    images: true
  });
  const [totalRequests, setTotalRequests] = useState<number>(0);

  useEffect(() => {
    trackPageView('صفحه اصلی');
    const fetchStats = async () => {
      try {
        const response = await fetch('/api/stats');
        const data = await response.json();
        setTotalRequests(data.totalRequests);
      } catch (error) {
        console.error('Error fetching stats:', error);
      }
    };

    fetchStats();
  }, [trackPageView]);

  const fetchProductInfo = async () => {
    setIsLoading(true);
    setError('');
    try {
      const response = await fetch(`/api/fetch-basalam-product?url=${encodeURIComponent(productUrl)}`);
      if (!response.ok) {
        throw new Error('خطا در دریافت اطلاعات محصول');
      }
      const data = await response.json();
      console.log('Data received from Basalam:', data);
      console.log('Attribute groups:', data.attribute_groups);
      
      setProductInfo(data);
      setManualInput({
        title: data.title || '',
        description: data.description || '',
        category: data.category?.leaf || '',
        brandName: '',
        attributes: [],
        images: data.images || []
      });
    } catch (err) {
      console.error('Error in fetchProductInfo:', err);
      setError(err instanceof Error ? err.message : 'خطا در دریافت اطلاعات محصول');
    } finally {
      setIsLoading(false);
    }
  };

  const handleManualInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setManualInput(prev => ({
      ...prev,
      [name]: name === 'images' 
        ? value.split(',').map(url => url.trim()) 
        : value
    }));
  };

  const generateNames = async () => {
    setIsGenerating(true);
    setError('');
    try {
      const inputData = productInfo || manualInput;
      const response = await fetch('/api/generate-names', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          productInfo: inputData,
          preferences
        }),
      });
      
      if (!response.ok) {
        throw new Error('خطا در تولید نام');
      }
      
      const data = await response.json();
      setGeneratedNames(data.suggestions);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'خطا در تولید نام‌های پیشنهادی');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopyName = (name: string) => {
    navigator.clipboard.writeText(name);
    trackCopyName(name);
    const el = document.createElement('div');
    el.className = 'fixed bottom-4 left-4 bg-gray-800 text-white px-4 py-2 rounded-lg text-sm';
    el.textContent = 'کپی شد!';
    document.body.appendChild(el);
    setTimeout(() => el.remove(), 2000);
  };

  return (
    <main className="container mx-auto px-4 py-8">
      {/* هدر صفحه با لینک گیت‌هاب */}
      <div className="flex flex-col sm:flex-row justify-between items-center mb-8">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-4 sm:mb-0">
          نام‌گذاری هوشمند محصول
        </h1>
        <div className="flex items-center gap-4">
          <div className="bg-white px-4 py-2 rounded-lg shadow-sm border border-gray-100">
            <span className="text-gray-600 ml-2">تعداد درخواست‌ها:</span>
            <span className="font-bold text-purple-600">{totalRequests.toLocaleString('fa-IR')}</span>
          </div>
          <a
            href="https://github.com/jozi/product-name-ai"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
            title="GitHub Repository"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="w-6 h-6"
            >
              <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
            </svg>
            <span className="hidden sm:inline">GitHub</span>
          </a>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* بخش ورودی اطلاعات - سمت راست */}
        <div className="space-y-6">
          <div className="sticky top-4">
            <div className="space-y-6 bg-white p-6 rounded-lg shadow-md">
              {/* فرم ورودی */}
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row gap-4">
                  <input
                    type="text"
                    value={productUrl}
                    onChange={(e) => setProductUrl(e.target.value)}
                    placeholder="لینک محصول در باسلام را وارد کنید"
                    className="flex-1 input-field min-w-0"
                    dir="rtl"
                  />
                  <button
                    onClick={fetchProductInfo}
                    disabled={isLoading}
                    className="whitespace-nowrap bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                  >
                    {isLoading ? "در حال دریافت..." : "دریافت اطلاعات"}
                  </button>
                </div>

                {/* فرم ورود دستی */}
                {!productInfo && (
                  <div className="space-y-4 border-t pt-4">
                    <h3 className="font-semibold text-gray-700">ورود دستی اطلاعات</h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          نام محصول
                        </label>
                        <input
                          type="text"
                          name="title"
                          value={manualInput.title}
                          onChange={handleManualInputChange}
                          className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          توضیحات
                        </label>
                        <textarea
                          name="description"
                          value={manualInput.description}
                          onChange={handleManualInputChange}
                          rows={4}
                          className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          دسته‌بندی
                        </label>
                        <input
                          type="text"
                          name="category"
                          value={manualInput.category}
                          onChange={handleManualInputChange}
                          className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* نمایش اطلاعات محصول باسلام */}
                {productInfo && (
                  <div className="space-y-6 border-t pt-4">
                    <h3 className="font-semibold text-gray-700">اطلاعات محصول</h3>
                    
                    {/* اطلاعات اصلی محصول */}
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          نام محصول
                        </label>
                        <input
                          type="text"
                          name="title"
                          value={manualInput.title}
                          onChange={handleManualInputChange}
                          className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          توضیحات
                        </label>
                        <textarea
                          name="description"
                          value={manualInput.description}
                          onChange={handleManualInputChange}
                          rows={4}
                          className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          دسته‌بندی
                        </label>
                        <input
                          type="text"
                          name="category"
                          value={manualInput.category}
                          onChange={handleManualInputChange}
                          className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        />
                      </div>
                    </div>

                    {/* گالری تصاویر - کشویی */}
                    {productInfo.images?.length > 0 && (
                      <div className="space-y-2">
                        <button 
                          onClick={() => setExpandedSections(prev => ({ ...prev, images: !prev.images }))}
                          className="flex items-center justify-between w-full text-right text-gray-700 font-medium hover:text-purple-600"
                        >
                          <span>تصاویر محصول</span>
                          {expandedSections.images ? (
                            <ChevronUpIcon className="w-5 h-5" />
                          ) : (
                            <ChevronDownIcon className="w-5 h-5" />
                          )}
                        </button>
                        {expandedSections.images && (
                          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mt-2">
                            {productInfo.images.map((image, index) => {
                              const imageUrl = typeof image === 'string' ? image : image.large;
                              return (
                                <div key={index} className="relative aspect-square rounded-lg overflow-hidden">
                                  <img 
                                    src={imageUrl} 
                                    alt={`تصویر ${index + 1} محصول`}
                                    className="object-cover hover:scale-105 transition-transform w-full h-full"
                                  />
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    )}

                    {/* ویژگی‌های محصول - کشویی */}
                    {productInfo.attribute_groups?.length > 0 && (
                      <div className="space-y-2">
                        <button 
                          onClick={() => setExpandedSections(prev => ({ ...prev, attributes: !prev.attributes }))}
                          className="flex items-center justify-between w-full text-right text-gray-700 font-medium hover:text-purple-600"
                        >
                          <span>ویژگی‌های محصول</span>
                          {expandedSections.attributes ? (
                            <ChevronUpIcon className="w-5 h-5" />
                          ) : (
                            <ChevronDownIcon className="w-5 h-5" />
                          )}
                        </button>
                        {expandedSections.attributes && (
                          <div className="space-y-6 mt-2">
                            {productInfo.attribute_groups.map((group, groupIndex) => (
                              <div key={groupIndex} className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                  {group.attributes.map((attr, attrIndex) => (
                                    <div key={attrIndex} 
                                      className="bg-gray-50 p-4 rounded-lg border border-gray-100 hover:border-purple-200 transition-colors"
                                    >
                                      <div className="flex items-start justify-between">
                                        <div className="text-sm font-medium text-purple-600">{attr.title}</div>
                                        {attr.unit && (
                                          <div className="text-xs text-gray-500 bg-gray-200 px-2 py-1 rounded">
                                            {attr.unit}
                                          </div>
                                        )}
                                      </div>
                                      <div className="mt-2 text-gray-900 whitespace-pre-wrap">{attr.value}</div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}

                {/* تنظیمات طول نام */}
                <div className="space-y-4 mt-6">
                  <h3 className="font-semibold">طول نام پیشنهادی</h3>
                  <div className="flex flex-wrap gap-3">
                    {[
                      { value: 'short' as const, label: 'کوتاه' },
                      { value: 'medium' as const, label: 'متوسط' },
                      { value: 'long' as const, label: 'بلند' }
                    ].map((option) => (
                      <button
                        key={option.value}
                        onClick={() => setPreferences(prev => ({...prev, nameLength: option.value}))}
                        className={`px-4 py-2 rounded-lg border ${
                          preferences.nameLength === option.value
                            ? 'bg-purple-100 border-purple-500 text-purple-700'
                            : 'border-gray-300 hover:border-purple-500'
                        }`}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* تنظیمات ترجیحات */}
                <div className="space-y-4 mt-6">
                  <h3 className="font-semibold">ترجیحات</h3>
                  <div className="flex flex-wrap gap-3">
                    {[
                      { value: 'includeBrand' as keyof Omit<Preferences, 'nameLength'>, label: 'شامل نام برند' },
                      { value: 'includeCategory' as keyof Omit<Preferences, 'nameLength'>, label: 'شامل دسته‌بندی' },
                      { value: 'includeFeatures' as keyof Omit<Preferences, 'nameLength'>, label: 'شامل ویژگی‌ها' }
                    ].map((option) => (
                      <button
                        key={option.value}
                        onClick={() => setPreferences(prev => ({...prev, [option.value]: !prev[option.value]}))}
                        className={`px-4 py-2 rounded-lg border ${
                          preferences[option.value]
                            ? 'bg-purple-100 border-purple-500 text-purple-700'
                            : 'border-gray-300 hover:border-purple-500'
                        }`}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* دکمه تولید نام */}
              <div className="sticky bottom-4">
                <button
                  onClick={generateNames}
                  disabled={(!productInfo && !manualInput.title) || isGenerating}
                  className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-3 rounded-lg hover:from-purple-600 hover:to-pink-600 disabled:from-gray-400 disabled:to-gray-400 disabled:cursor-not-allowed transition-all shadow-md hover:shadow-lg"
                >
                  {isGenerating ? 'در حال تولید نام‌ها...' : 'تولید نام‌های پیشنهادی'}
                </button>

                {error && (
                  <div className="p-4 bg-red-50 border border-red-200 rounded-lg mt-4">
                    <p className="text-red-600">{error}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* بخش نمایش نتایج - سمت چپ */}
        <div className="space-y-6">
          {/* نمایش placeholder ها قبل از تولید نام */}
          {!generatedNames.length && !isGenerating && (
            <div className="space-y-4">
              <div className="p-6 bg-white/50 backdrop-blur-sm border border-dashed border-gray-300 rounded-lg">
                <div className="flex items-center justify-center h-40">
                  <div className="text-center space-y-3">
                    <div className="w-16 h-16 mx-auto">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-full h-full text-gray-400">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z" />
                      </svg>
                    </div>
                    <h3 className="text-lg font-medium text-gray-600">محل نمایش نام‌های پیشنهادی</h3>
                    <p className="text-sm text-gray-500">
                      ۵ نام خلاقانه براساس اطلاعات محصول شما تولید خواهد شد
                    </p>
                  </div>
                </div>
              </div>
              
              {/* نمایش پیش‌نمایش کارت‌های نام */}
              <div className="grid gap-4 md:grid-cols-2">
                {[...Array(5)].map((_, i) => (
                  <div
                    key={i}
                    className="p-4 bg-white/30 border border-dashed border-gray-200 rounded-lg space-y-3"
                  >
                    <div className="h-7 bg-gray-100 rounded w-3/4"></div>
                    <div className="space-y-2">
                      <div className="h-4 bg-gray-100 rounded w-full"></div>
                      <div className="h-4 bg-gray-100 rounded w-5/6"></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* نمایش loading state */}
          {isGenerating && (
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <div
                  key={i}
                  className="p-4 bg-white rounded-lg shadow-sm space-y-3 overflow-hidden"
                >
                  <div className="h-7 bg-gradient-to-r from-gray-100 via-gray-200 to-gray-100 rounded animate-pulse-gradient"></div>
                  <div className="space-y-2">
                    <div className="h-4 bg-gradient-to-r from-gray-100 via-gray-200 to-gray-100 rounded animate-pulse-gradient"></div>
                    <div className="h-4 bg-gradient-to-r from-gray-100 via-gray-200 to-gray-100 rounded w-5/6 animate-pulse-gradient"></div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* نمایش نتایج */}
          {!isGenerating && generatedNames.length > 0 && (
            <div className="space-y-4">
              {generatedNames.map((name, index) => (
                <div
                  key={index}
                  className="p-4 bg-white rounded-lg shadow-md hover:shadow-lg transition-all hover:scale-[1.02] cursor-pointer"
                >
                  <div className="flex justify-between items-start">
                    <h3 className="text-lg font-semibold text-gray-900">{name.name}</h3>
                    <button
                      onClick={() => handleCopyName(name.name)}
                      className="p-1.5 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-colors"
                      title="کپی کردن"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="w-4 h-4"
                      >
                        <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                        <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                      </svg>
                    </button>
                  </div>
                  <p className="mt-2 text-gray-600 leading-relaxed">{name.reasoning}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
