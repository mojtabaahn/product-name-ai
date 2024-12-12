declare global {
  interface Window {
    gtag: (
      command: 'event' | 'config' | 'js',
      eventName: string,
      eventParams?: Record<string, any>
    ) => void;
  }
}

export const useAnalytics = () => {
  const trackEvent = (eventName: string, eventParams?: Record<string, any>) => {
    try {
      if (typeof window !== 'undefined' && window.gtag) {
        console.log('🔍 Tracking event:', eventName, eventParams);
        window.gtag('event', eventName, eventParams);
      } else {
        console.warn('Google Analytics not initialized');
      }
    } catch (error) {
      console.error('Error tracking event:', error);
    }
  };

  const trackGenerateNames = (productInfo: {
    title?: string;
    category?: string;
    nameLength?: string;
  }) => {
    console.log('📊 Tracking generate names:', productInfo);
    trackEvent('generate_names', {
      product_title: productInfo.title,
      product_category: productInfo.category,
      name_length: productInfo.nameLength,
    });
  };

  const trackCopyName = (name: string) => {
    console.log('📋 Tracking copy name:', name);
    trackEvent('copy_name', {
      name: name,
    });
  };

  const trackProductFetch = (url: string, success: boolean) => {
    console.log('🔄 Tracking product fetch:', { url, success });
    trackEvent('fetch_product', {
      url: url,
      success: success,
    });
  };

  return {
    trackEvent,
    trackGenerateNames,
    trackCopyName,
    trackProductFetch,
  };
}; 