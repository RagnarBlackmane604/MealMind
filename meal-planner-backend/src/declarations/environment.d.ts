declare namespace NodeJS {
  interface ProcessEnv {
    JWT_SECRET: string;
    MONGODB_URI: string;
    DATABASE_URL: string;
    GEMINI_API_KEY: string;
    PORT?: string;
  }
}
