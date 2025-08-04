declare namespace NodeJS {
  interface ProcessEnv {
    // Add all your environment variables here with their types
    // Make sure these match what you have in your .env file
    JWT_SECRET: string;
    MONGODB_URI: string; // If you use this
    DATABASE_URL: string; // If you use this
    GEMINI_API_KEY: string; // If you use this
    PORT?: string; // Optional, as it might have a default
    // Add any other specific environment variables your app uses
  }
}
