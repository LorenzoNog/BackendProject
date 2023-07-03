import dotenv from "dotenv";

dotenv.config()

export default {
    PORT: process.env.PORT,
    MONGO_URI: process.env.MONGO_URI,
    SECRET_TOKEN: process.env.SECRET_TOKEN,
    ADMIN_PASSWORD: process.env.ADMIN_PASSWORD,
    GMAIL_PASSWORD: process.env.GMAIL_PASSWORD,
    GMAIL_USER: process.env.GMAIL_USER
}