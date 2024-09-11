import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import authRoute from "./routes/authRoute.js";
import propertyRoute from "./routes/propertyRoute.js";
import { connectDB } from "./config/db.js";

dotenv.config();
const app = express();
const port = process.env.PORT || 8080;

//cors origin setup
const allowOrigin = [
    "http://localhost:8080",
    "http://localhost:5173",
    "http://localhost:5174",
    "https://ic-realestate-server.onrender.com/",
    "https://ic-realestate-server.onrender.com",
    "http://ic-realestate-server.onrender.com/",
    undefined,
]
const corsOptions = {
    origin: (origin, callback)=>{
        if(allowOrigin.includes(origin)){
            callback(null, true)
        }else{
            callback(new Error(`url not allowed by CORS origin: ${origin}`))
        }
    },
    credentials: true,
}

// Get the directory name in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ensure the uploads directory exists
const uploadsDir = path.join(__dirname, "routes", "uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Middleware
app.use(cors(corsOptions));
app.options("*", cors(corsOptions))
app.use(express.json());


// DB Connection
connectDB();

// Base Route
app.get("/", (req, res) => {
  res.send("Welcome to the myhome server");
});

// Routers
app.use("/api/v1/auth", authRoute);
app.use("/api/v1/property", propertyRoute);
app.use("/image", express.static(path.join(__dirname, "uploads")));

// Start the Server
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
