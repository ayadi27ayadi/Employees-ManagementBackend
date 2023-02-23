import { config } from 'dotenv';

config();

export const PORT = process.env.PORT;
export const MONGO_DB_URI = process.env.MONGO_DB_URI;
export const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET;
export const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET;
export const JWT_SECRET = process.env.JWT_SECRET;
export const RESET_PASSWORD_KEY = process.env.RESET_PASSWORD_KEY;
export const soldeDaysByMonth = process.env.soldeDaysByMonth;
export const soldDaysByYear = process.env.soldDaysByYear;
export const maxDaysByMonth = process.env.maxDaysByMonth;
export const soldDaysOffSick = process.env.soldDaysOffSick;
