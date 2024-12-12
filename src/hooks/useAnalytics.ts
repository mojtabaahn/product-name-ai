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
        window.gtag('event', eventName, {
          ...eventParams,
          event_category: 'user_interaction',
          event_time: new Date().toISOString(),
          non_interaction: false,
        });
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
      event_label: 'name_generation',
      value: 1,
    });
  };

  const trackCopyName = (name: string) => {
    console.log('📋 Tracking copy name:', name);
    trackEvent('copy_name', {
      name: name,
      event_label: 'name_copy',
      value: 1,
    });
  };

  const trackProductFetch = (url: string, success: boolean) => {
    console.log('🔄 Tracking product fetch:', { url, success });
    trackEvent('fetch_product', {
      url: url,
      success: success,
      event_label: 'product_fetch',
      value: success ? 1 : 0,
    });
  };

  const trackPageView = (pageName: string) => {
    console.log('📄 Tracking page view:', pageName);
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'page_view', {
        page_title: pageName,
        page_location: window.location.href,
        page_path: window.location.pathname,
        event_category: 'page_interaction',
        non_interaction: true,
      });
    }
  };

  return {
    trackEvent,
    trackGenerateNames,
    trackCopyName,
    trackProductFetch,
    trackPageView,
  };
}; 