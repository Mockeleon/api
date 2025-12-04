/**
 * Platform base URLs for social media and popular services
 */
export const PLATFORM_URLS: Record<string, string> = {
  // Social Media
  x: 'https://x.com/',
  twitter: 'https://twitter.com/',
  discord: 'https://discord.com/users/',
  telegram: 'https://t.me/',
  github: 'https://github.com/',
  linkedin: 'https://linkedin.com/in/',
  instagram: 'https://instagram.com/',
  facebook: 'https://facebook.com/',
  youtube: 'https://youtube.com/@',
  twitch: 'https://twitch.tv/',
  tiktok: 'https://tiktok.com/@',
  snapchat: 'https://snapchat.com/add/',
  reddit: 'https://reddit.com/u/',
  pinterest: 'https://pinterest.com/',
  medium: 'https://medium.com/@',

  // Professional & Dev
  stackoverflow: 'https://stackoverflow.com/users/',
  behance: 'https://behance.net/',
  dribbble: 'https://dribbble.com/',
  devto: 'https://dev.to/',
  hashnode: 'https://hashnode.com/@',
  codepen: 'https://codepen.io/',

  // Gaming
  steam: 'https://steamcommunity.com/id/',
  xbox: 'https://account.xbox.com/en-us/profile?gamertag=',
  playstation: 'https://psnprofiles.com/',
  epicgames: 'https://epicgames.com/u/',

  // Other
  spotify: 'https://open.spotify.com/user/',
  soundcloud: 'https://soundcloud.com/',
  vimeo: 'https://vimeo.com/',
  patreon: 'https://patreon.com/',
};

/**
 * Words for generating random website names and usernames
 * Categorized for better variety and contextual appropriateness
 */
export const URL_WORDS = {
  // Business & Commerce
  business: [
    'shop',
    'store',
    'market',
    'mall',
    'trade',
    'supply',
    'outlet',
    'depot',
    'hub',
    'exchange',
    'retail',
    'wholesale',
    'merchant',
    'vendor',
    'dealer',
  ],

  // Technology & Digital
  tech: [
    'tech',
    'digital',
    'cyber',
    'online',
    'web',
    'net',
    'cloud',
    'data',
    'app',
    'dev',
    'code',
    'software',
    'system',
    'platform',
    'portal',
    'network',
    'server',
    'byte',
    'pixel',
    'bits',
  ],

  // Creative & Media
  creative: [
    'blog',
    'media',
    'studio',
    'design',
    'art',
    'creative',
    'pixel',
    'canvas',
    'gallery',
    'showcase',
    'content',
    'vision',
    'inspire',
    'imagine',
    'craft',
  ],

  // Professional & Services
  professional: [
    'pro',
    'expert',
    'consulting',
    'solutions',
    'services',
    'agency',
    'group',
    'associates',
    'partners',
    'firm',
    'corp',
    'enterprise',
    'ventures',
    'innovations',
    'dynamics',
  ],

  // Modern & Trendy
  modern: [
    'smart',
    'next',
    'future',
    'nova',
    'prime',
    'elite',
    'ultra',
    'mega',
    'super',
    'hyper',
    'meta',
    'quantum',
    'fusion',
    'nexus',
    'apex',
  ],

  // Descriptive
  descriptive: [
    'fast',
    'easy',
    'simple',
    'quick',
    'instant',
    'express',
    'direct',
    'swift',
    'rapid',
    'smart',
    'best',
    'top',
    'quality',
    'premium',
    'plus',
  ],
};

/**
 * Get all URL words as a flat array
 */
export const getAllUrlWords = (): string[] => {
  return Object.values(URL_WORDS).flat();
};

/**
 * Get random word from a specific category
 */
export const getRandomWordFromCategory = (
  category: keyof typeof URL_WORDS
): string => {
  const words = URL_WORDS[category];
  return words[Math.floor(Math.random() * words.length)]!;
};

/**
 * Get random word from all categories
 */
export const getRandomUrlWord = (): string => {
  const allWords = getAllUrlWords();
  return allWords[Math.floor(Math.random() * allWords.length)]!;
};
