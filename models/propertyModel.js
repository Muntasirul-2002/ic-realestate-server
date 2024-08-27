import mongoose from 'mongoose';

const propertySchema = new mongoose.Schema({
    title: String,
    slug: String,
    location:String,
    landmark: String,
    type: String,
    purpose: String,
    featured:[String],
    description: String,
    size: String,
    bedrooms: Number,
    bathrooms: Number,
    price: Number,
    images: [String]
});

const propertyModel = mongoose.model('Property', propertySchema);

export default propertyModel;
