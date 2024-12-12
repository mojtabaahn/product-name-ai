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
        window.gtag('event', eventName, eventParams);
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
    trackEvent('generate_names', {
      product_title: productInfo.title,
      product_category: productInfo.category,
      name_length: productInfo.nameLength,
    });
  };

  const trackCopyName = (name: string) => {
    trackEvent('copy_name', {
      name: name,
    });
  };

  const trackProductFetch = (url: string, success: boolean) => {
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