import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import {
  addPropertyController,
  deletePropertyController,
  searchFilterController,
  updatePropertyController,
  viewPropertyController,
  viewSinglePropertyController,
  relatedPropertiesController,

} from "../controller/property/propertyController.js";

// Get the directory name in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ensure the uploads directory exists
const uploadsDir = path.join(__dirname, "../uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Set up storage engine for multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage: storage });

const propertyRoute = express.Router();

// Add property route with file upload
propertyRoute.post(
  "/add-property",
  upload.array("images", 5), // Upload up to 5 images
  addPropertyController
);

// View all properties
propertyRoute.get("/view-property", viewPropertyController);

// View single property by slug
propertyRoute.get("/view-property/:slug", viewSinglePropertyController);

// Delete a property by ID
propertyRoute.delete("/delete-property/:pid", deletePropertyController);

// Update a property by ID with file upload
propertyRoute.put(
  "/update-property/:pid",
  upload.array("images", 5), // Upload up to 5 images
  updatePropertyController
);

// Search properties
propertyRoute.get("/search/:keyword", searchFilterController);


//related properties
propertyRoute.get("/related/:pid/:keyword", relatedPropertiesController)
export default propertyRoute;
