import propertyModel from "../../models/propertyModel.js";
import slugify from "slugify";
export const addPropertyController = async (req, res) => {
  try {
    const {
      title,
      type,
      purpose,
      description,
      size,
      bedrooms,
      bathrooms,
      price,
    } = req.body;
    const images = req.files.map((file) => file.filename);
    const slug = slugify(title, { lower: true });

    const newProperty = new propertyModel({
      title,
      type,
      purpose,
      description,
      size,
      bedrooms,
      bathrooms,
      price,
      images,
      slug,
    });

    await newProperty.save();

    res.status(201).json({
      success: true,
      message: "Property added successfully",
      data: newProperty,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Error while adding property",
      error: error.message,
    });
  }
};

export const viewPropertyController = async (req, res) => {
  try {
    const viewProperty = await propertyModel.find({});
    res.status(200).send({
      success: true,
      message: "All properties",
      viewProperty,
    });
  } catch (error) {
    console.log(error);
  }
};
export const viewSinglePropertyController = async (req, res) => {
  try {
    const viewSingleProperty = await propertyModel.findOne({
      slug: req.params.slug,
    });
    res.status(200).send({
      success: true,
      message: `fetch single property`,
      viewSingleProperty,
    });
  } catch (error) {
    console.log("error in viewSinglePropertyController :", error);
    res.status(500).send({
      success: false,
      error,
      message: "Error to get single property",
    });
  }
};

export const deletePropertyController = async (req, res) => {
  try {
    await propertyModel.findByIdAndDelete({ _id: req.params.pid });
    res.status(200).send({
      success: true,
      message: "Property deleted successfully",
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      error,
      message: "Error in delete property",
    });
  }
};

//TODO: api check it pending
export const updatePropertyController = async (req, res) => {
  try {
    const propertyId = req.params.id;
    const {
      title,
      type,
      purpose,
      description,
      size,
      bedrooms,
      bathrooms,
      price,
    } = req.body;
    const images = req.files ? req.files.map((file) => file.filename) : [];

    // Find the property by ID
    const property = await propertyModel.findById(propertyId);

    if (!property) {
      return res.status(404).json({
        success: false,
        message: "Property not found",
      });
    }

    // Update property details
    property.title = title || property.title;
    property.type = type || property.type;
    property.purpose = purpose || property.purpose;
    property.description = description || property.description;
    property.size = size || property.size;
    property.bedrooms = bedrooms || property.bedrooms;
    property.bathrooms = bathrooms || property.bathrooms;
    property.price = price || property.price;
    if (images.length > 0) {
      property.images = images;
    }
    property.slug = slugify(title || property.title, { lower: true });

    // Save the updated property
    await property.save();

    res.status(200).json({
      success: true,
      message: "Property updated successfully",
      data: property,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Error while updating property",
      error: error.message,
    });
  }
};

//TODO: update controller api testing pending

//search for properties
export const searchFilterController = async (req, res) => {
  try {
    const { keyword } = req.params;
    const result = await propertyModel.find({
      $or: [
        { title: { $regex: keyword, $options: "i" } },
        { description: { $regex: keyword, $options: "i" } },
        { bedrooms: { $regex: keyword, $options: "i" } },
        { bathrooms: { $regex: keyword, $options: "i" } },
        { purpose: { $regex: keyword, $options: "i" } },
        { type: { $regex: keyword, $options: "i" } },
      ],
    });
    res.json(result)
  } catch (error) {
    console.log(error);
    res.status(400).send({
      success: false,
      message: "Error in search property api",
      error,
    });
  }
};
