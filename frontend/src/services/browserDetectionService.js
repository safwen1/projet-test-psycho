/**
 * Service de détection et gestion de compatibilité des navigateurs
 * Permet d'identifier le navigateur de l'utilisateur et de vérifier la compatibilité
 * des fonctionnalités utilisées par l'application
 */

/**
 * Détecte le navigateur de l'utilisateur et ses informations
 * @returns {Object} Informations sur le navigateur
 */
export const detectBrowser = () => {
  const userAgent = navigator.userAgent;
  const browsers = {
    chrome: /chrome|chromium|crios/i.test(userAgent) && !/edg|opr/i.test(userAgent),
    firefox: /firefox|fxios/i.test(userAgent),
    safari: /safari/i.test(userAgent) && !/chrome|chromium|crios|edg|opr/i.test(userAgent),
    edge: /edg/i.test(userAgent),
    opera: /opr/i.test(userAgent),
    samsung: /samsungbrowser/i.test(userAgent),
    ucbrowser: /ucbrowser/i.test(userAgent),
    ie: /msie|trident/i.test(userAgent),
  };

  const devices = {
    mobile: /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(userAgent),
    tablet: /ipad|android(?!.*mobile)/i.test(userAgent),
    desktop: !(/android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(userAgent)),
  };

  const os = {
    android: /android/i.test(userAgent),
    ios: /iphone|ipad|ipod/i.test(userAgent),
    windows: /windows/i.test(userAgent),
    mac: /macintosh|mac os x/i.test(userAgent),
    linux: /linux/i.test(userAgent),
  };

  // Déterminer le nom du navigateur
  let browserName = 'unknown';
  for (const [name, detected] of Object.entries(browsers)) {
    if (detected) {
      browserName = name;
      break;
    }
  }

  // Déterminer le type d'appareil
  let deviceType = 'unknown';
  for (const [type, detected] of Object.entries(devices)) {
    if (detected) {
      deviceType = type;
      break;
    }
  }

  // Déterminer le système d'exploitation
  let osName = 'unknown';
  for (const [name, detected] of Object.entries(os)) {
    if (detected) {
      osName = name;
      break;
    }
  }

  return {
    browser: browserName,
    device: deviceType,
    os: osName,
    userAgent,
    isMobile: devices.mobile,
    isTablet: devices.tablet,
    isDesktop: devices.desktop,
    isIOS: os.ios,
    isAndroid: os.android,
  };
};

/**
 * Vérifie si une fonctionnalité est supportée par le navigateur
 * @param {string} feature - Nom de la fonctionnalité à vérifier
 * @returns {boolean} Indique si la fonctionnalité est supportée
 */
export const isFeatureSupported = (feature) => {
  const features = {
    webp: () => {
      const elem = document.createElement('canvas');
      if (elem.getContext && elem.getContext('2d')) {
        return elem.toDataURL('image/webp').indexOf('data:image/webp') === 0;
      }
      return false;
    },
    webgl: () => {
      try {
        const canvas = document.createElement('canvas');
        return !!(window.WebGLRenderingContext && 
          (canvas.getContext('webgl') || canvas.getContext('experimental-webgl')));
      } catch (e) {
        return false;
      }
    },
    webrtc: () => {
      return navigator.mediaDevices && navigator.mediaDevices.getUserMedia;
    },
    geolocation: () => {
      return 'geolocation' in navigator;
    },
    localstorage: () => {
      try {
        localStorage.setItem('test', 'test');
        localStorage.removeItem('test');
        return true;
      } catch (e) {
        return false;
      }
    },
    sessionstorage: () => {
      try {
        sessionStorage.setItem('test', 'test');
        sessionStorage.removeItem('test');
        return true;
      } catch (e) {
        return false;
      }
    },
    serviceWorker: () => {
      return 'serviceWorker' in navigator;
    },
    indexedDB: () => {
      return !!window.indexedDB;
    },
    webAnimation: () => {
      return 'animate' in document.createElement('div');
    },
    flexbox: () => {
      const el = document.createElement('div');
      return 'flexBasis' in el.style || 'webkitFlexBasis' in el.style || 'mozFlexBasis' in el.style;
    },
    touchscreen: () => {
      return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    },
    fetch: () => {
      return 'fetch' in window;
    },
    promiseAll: () => {
      return 'Promise' in window && 'all' in Promise;
    },
    asyncAwait: () => {
      try {
        eval('async () => {}');
        return true;
      } catch (e) {
        return false;
      }
    },
  };

  if (features[feature]) {
    return features[feature]();
  }
  
  return false;
};

/**
 * Crée un rapport de compatibilité du navigateur avec l'application
 * @returns {Object} Rapport de compatibilité
 */
export const createBrowserCompatibilityReport = () => {
  const browserInfo = detectBrowser();
  const supportedFeatures = {
    webp: isFeatureSupported('webp'),
    webgl: isFeatureSupported('webgl'),
    localstorage: isFeatureSupported('localstorage'),
    serviceWorker: isFeatureSupported('serviceWorker'),
    flexbox: isFeatureSupported('flexbox'),
    touchscreen: isFeatureSupported('touchscreen'),
    fetch: isFeatureSupported('fetch'),
    promiseAll: isFeatureSupported('promiseAll'),
    asyncAwait: isFeatureSupported('asyncAwait'),
  };

  // Vérification de la compatibilité globale
  const essentialFeatures = ['localstorage', 'flexbox', 'fetch', 'promiseAll'];
  const essentialFeaturesSupported = essentialFeatures.every(feature => supportedFeatures[feature]);

  // Vérification des fonctionnalités recommandées mais non essentielles
  const recommendedFeatures = ['webp', 'serviceWorker', 'asyncAwait'];
  const recommendedFeaturesSupported = recommendedFeatures.filter(feature => supportedFeatures[feature]);

  return {
    browserInfo,
    supportedFeatures,
    essentialFeaturesSupported,
    recommendedFeaturesSupported: recommendedFeaturesSupported.length / recommendedFeatures.length,
    isFullyCompatible: essentialFeaturesSupported && recommendedFeaturesSupported.length === recommendedFeatures.length,
    compatibilityScore: (
      (essentialFeatures.filter(f => supportedFeatures[f]).length / essentialFeatures.length) * 0.7 +
      (recommendedFeaturesSupported.length / recommendedFeatures.length) * 0.3
    ) * 100,
  };
}; 