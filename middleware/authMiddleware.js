import JWT from "jsonwebtoken";
import userModel from "../models/userModel.js";

export const requireSignIn = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    // Log the header for debugging
    console.log("Authorization header:", authHeader);

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).send({
        success: false,
        message: "Unauthorized - Token must be provided",
      });
    }

    // Extract the token part from the Authorization header
    const token = authHeader.split(" ")[1];

    if (!token) {
      return res.status(401).send({
        success: false,
        message: "Unauthorized - Token must be provided",
      });
    }

    // Verify the token
    const decoded = JWT.verify(token, process.env.JWT_SECRET);

    // Log the decoded token for debugging
    console.log("Decoded token:", decoded);

    req.user = decoded;
    next();
  } catch (error) {
    console.log("Error in requireSignIn middleware:", error);
    return res.status(401).send({
      success: false,
      message: "Unauthorized - Invalid token",
    });
  }
};



export const isAdmin = async (req, res, next) => {
  try {
    const user = await userModel.findById(req.user._id);
    if (user.role !== "admin") {
      return res.status(401).send({
        success: false,
        message: "UnAuthorized - Admin access required",
      });
    } else {
      next(); // Proceed to the next middleware or route handler
    }
  } catch (error) {
    console.error(error);
    res.status(500).send({
      success: false,
      message: "Error in authorization",
      error: error.message,
    });
  }
};
