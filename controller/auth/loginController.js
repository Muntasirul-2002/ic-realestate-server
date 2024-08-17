import userModel from "../../models/userModel.js";

import validator from "validator";
import JWT from "jsonwebtoken";
import { hashPassword, comparePassword } from "../../helper/authHelper.js";

//Signup
export const signupController = async (req, res) => {
  try {
    const { name, mobile, email, password, address } = req.body;
    if (!name || !mobile || !email || !password || !address) {
      return res.send({ message: "all fields required" });
    }
    //check existing user
    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      return res.send({ success: false, message: "User already exists" });
    }

    //validate email using validator package
    if (!validator.isEmail(email)) {
      return res.send({ success: false, message: "enter a valid email" });
    }
    if (password.length < 4) {
      return res.send({
        success: false,
        message: "please provide a strong password",
      });
    }
    const hashedPassword = await hashPassword(password);

    const newUser = await userModel({
      name,
      mobile,
      email,
      password: hashedPassword,
      address,
    }).save();
    res.status(201).send({
      success: true,
      message: "User Register Successfully",
      newUser,
    });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error in signup" });
  }
};

//login
export const loginController = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(404).send({
        success: false,
        message: "Invalid email or password",
      });
    }
    const user = await userModel.findOne({
      email,
    });
    if (!user) {
      return res.status(404).send({
        success: false,
        message: "email not found",
      });
    }
    const matchPassword = await comparePassword(password, user.password);
    if (!matchPassword) {
      return res.status(404).send({
        success: false,
        message: "Invalid password",
      });
    }

    const token = await JWT.sign({ _id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.status(200).send({
      success: true,
      message: "login successful",
      user: {
        name: user.name,
        mobile: user.mobile,
        email: user.email,
        address: user.address,
        role: user.role,
        userID: user._id,
      },
      token,
    });
  } catch (error) {
    console.log(error);
  }
};

// get all admin details

export const getAdminDetails = async (req, res) => {
  try {
    const getAdmin = await userModel.find({ role: "admin" });
    res.status(200).send({
      success: true,
      message: "Fetch all admin details",
      getAdmin,
    });
  } catch (error) {
    console.log(error);
  }
};

// Get single admin details using ID
export const getSingleAdminDetails = async (req, res) => {
  try {
    const { id } = req.params; // Assuming the ID is passed in the URL as a parameter
    const singleAdmin = await userModel.findById(id);
    if (!singleAdmin) {
      return res.status(404).send({
        success: false,
        message: "Admin not found",
      });
    }
    res.status(200).send({
      success: true,
      message: "Fetched admin details successfully",
      singleAdmin,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({
      success: false,
      message: "Error fetching admin details",
      error: error.message,
    });
  }
};

//delete admin
export const deleteAdmin = async (req, res) => {
  try {
    const { id } = req.params;
    await userModel.findByIdAndDelete(id);
    res.status(200).send({
      success: true,
      message: "Deleted successfully",
    });
  } catch (error) {
    console.log("Error in delete user:", error);
    res.status(500).send({
      success: false,
      error,
      message: "Error in delete user",
    });
  }
};


export const updateAdminProfile = async(req,res)=>{
  try {
    const {name,mobile,password,address} = req.body
    const user = await userModel.findById(req.user._id);
    if(password && password.length < 4){
      return res.json({error:"Password too short"})
    }

    const hashedPassword = password ? await hashPassword(password) : undefined;
    const updatedUser = await userModel.findByIdAndUpdate(
      req.user._id,
      {
        name: name || user.name,
        mobile: mobile || user.mobile,
        password: hashedPassword || user.password,
        address: address || user.address

      },
      {new:true}
    )
    res.status(200).send({
      success:true,
      message: "Your details has been updated",
      updatedUser
    })
  } catch (error) {
    console.log(error);
    res.status(400).send({
      success: false,
      message: "Error WHile Update profile",
      error,
    });
  }
}