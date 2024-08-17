import JWT from "jsonwebtoken";
import userModel from "../models/userModel.js";

export const requireSignIn = async (req, res, next) => {
  try {
    const decode = await JWT.verify(
      req.headers.authorization,
      process.env.JWT_SECRET
    );
    req.user = decode;
    next();
  } catch (error) {
    console.log(error);
  }
};

export const isAdmin = async (req, res, next) => {
  try {
      // Ensure req.user exists and has _id
      if (!req.user || !req.user._id) {
          return res.status(401).send({
              success: false,
              message: "UnAuthorized - No user information found"
          });
      }

      const user = await userModel.findById(req.user._id);
      if (user.role !== 'admin') {
          return res.status(401).send({
              success: false,
              message: "UnAuthorized - Admin access required"
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
