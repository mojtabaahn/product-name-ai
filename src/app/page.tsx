'use client';

import { useState } from 'react';
import { ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/24/outline';

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
  const [productUrl, setProductUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [productInfo, setProductInfo] = useState(null);
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
  const [generatedNames, setGeneratedNames] = useState([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [expandedSections, setExpandedSections] = useState({
    attributes: true,
    images: true
  });

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
      setError(err.message);
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
      setError(err.message);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
          نام‌گذاری هوشمند محصول
        </h1>
        <p className="mt-2 text-gray-600">با کمک هوش مصنوعی، نام‌های خلاقانه برای محصولات خود بسازید</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* بخش ورودی اطلاعات - سمت راست */}
        <div className="space-y-6">
          <div className="sticky top-4">
            <div className="space-y-6 bg-white p-6 rounded-lg shadow-md">
              {/* لینک باسلام - اختیاری */}
              <div className="space-y-2">
                <label className="text-gray-700 font-medium">لینک محصول در باسلام (اختیاری)</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={productUrl}
                    onChange={(e) => setProductUrl(e.target.value)}
                    placeholder="https://basalam.com/product/123456"
                    className="flex-1 p-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    dir="ltr"
                  />
                  <button
                    onClick={fetchProductInfo}
                    disabled={isLoading || !productUrl}
                    className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50"
                  >
                    {isLoading ? 'در حال دریافت...' : 'دریافت اطلاعات'}
                  </button>
                </div>
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
                    { value: 'short', label: 'کوتاه' },
                    { value: 'medium', label: 'متوسط' },
                    { value: 'long', label: 'بلند' }
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
                    { value: 'includeBrand', label: 'شامل نام برند' },
                    { value: 'includeCategory', label: 'شامل دسته‌بندی' },
                    { value: 'includeFeatures', label: 'شامل ویژگی‌ها' }
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

        {/* بخش نمایش نتایج - سمت چپ */}
        <div className="space-y-6">
          {isGenerating && (
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-24 rounded-lg overflow-hidden">
                  <div 
                    className="w-full h-full bg-gradient-to-r from-purple-100 via-pink-100 to-purple-100 animate-pulse-gradient"
                    style={{ animationDelay: `${i * 0.2}s` }}
                  ></div>
                </div>
              ))}
            </div>
          )}

          {!isGenerating && generatedNames.length > 0 && (
            <div className="space-y-4">
              {generatedNames.map((name, index) => (
                <div
                  key={index}
                  className="p-4 bg-white rounded-lg shadow-md hover:shadow-lg transition-all hover:scale-[1.02] cursor-pointer"
                >
                  <div className="flex justify-between items-start">
                    <h3 className="text-lg font-semibold text-gray-900">{name.name}</h3>
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
