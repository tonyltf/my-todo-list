import dotenv from 'dotenv';
dotenv.config();

export const env = {
    PORT: process.env.PORT,
    HOSTNAME: process.env.HOSTNAME,
    DATABASE_URL: process.env.DATABASE_URL,
    CORS_ORIGINS: process.env.CORS_ORIGINS?.split(','),
};