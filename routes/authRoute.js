import { Router } from "express";
import {
  deleteAdmin,

  getAdminDetails,
  getSingleAdminDetails,
  loginController,
  signupController,
  updateAdminProfile,
} from "../controller/auth/loginController.js";
import { requireSignIn, isAdmin } from "../middleware/authMiddleware.js";
const authRoute = Router();

//signup
authRoute.post("/signup", signupController);
//login
authRoute.post("/login", loginController);
//protected admin route
authRoute.get("/admin-auth", requireSignIn, isAdmin, (req, res) => {
  res.status(200).send({ ok: true });
});
// get all admin details
authRoute.get("/admin-details", getAdminDetails);

//get single admin details using id
authRoute.get("/admin-details/:id", getSingleAdminDetails);

//delete admin
authRoute.delete("/delete-admin/:id", deleteAdmin);

//update admin
authRoute.put('/profile',requireSignIn, updateAdminProfile, )

export default authRoute;
