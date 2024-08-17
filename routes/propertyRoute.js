import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { addPropertyController, deletePropertyController, searchFilterController, updatePropertyController, viewPropertyController, viewSinglePropertyController } from '../controller/property/propertyController.js';

// Get the directory name in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ensure the uploads directory exists
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
}

// Set up storage engine for multer
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadsDir);
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname);
    }
});

const upload = multer({ storage: storage });

const propertyRoute = express.Router();
// add property route
propertyRoute.post('/add-property', upload.array('images', 5), addPropertyController);
// view property route
propertyRoute.get('/view-property', viewPropertyController);
//view single property
propertyRoute.get('/view-property/:slug', viewSinglePropertyController);
//delete property
propertyRoute.delete('/delete-property/:pid', deletePropertyController);
//update property
propertyRoute.put('/update-property/:pid',upload.array('images', 5), updatePropertyController);
//search filter
propertyRoute.get('/search/:keyword', searchFilterController);

export default propertyRoute;
