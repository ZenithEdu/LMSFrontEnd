interface Config {
  API_BASE_URL: string;
  JWT_SECRET_KEY: string;
  ACCESS_TOKEN_EXPIRY: number;
}

const config: Config = {
  API_BASE_URL: import.meta.env.VITE_API_BASE_URL || 'https://api.zenlms.online/api',
  JWT_SECRET_KEY: import.meta.env.VITE_JWT_SECRET_KEY || '',
  ACCESS_TOKEN_EXPIRY: Number(import.meta.env.VITE_ACCESS_TOKEN_EXPIRY || '3600'),
};

export const getConfig = (): Config => {
  return config;
};

export default config;
