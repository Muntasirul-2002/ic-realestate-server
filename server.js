import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import authRoute from './routes/authRoute.js';
import propertyRoute from './routes/propertyRoute.js';
import { connectDB } from './config/db.js';

dotenv.config();
const app = express();
const port = process.env.PORT || 8080;

// Get the directory name in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ensure the uploads directory exists
const uploadsDir = path.join(__dirname, 'routes', 'uploads');
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
}

// Middleware
app.use(cors());
app.use(express.json());

// DB Connection
connectDB();

// Base Route
app.get('/', (req, res) => {
    res.send("Welcome to the myhome server");
});

// Routers
app.use('/api/v1/auth', authRoute);
app.use('/api/v1/property', propertyRoute);

// Start the Server
app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});
