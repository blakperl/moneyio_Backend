
import { userService } from "../../../services/user.js";
import { asyncHandler } from "../../middlewares/asyncHandler.js";
import logger from "../../../../src/utils/logger.js";



// export const userController = {
//   getUsers: async (req, res) => {
//     try {
//       const data = await userService.getAllUsers();
//       res.json(data);
//     } catch (error) {
//       console.error("Error fetching users:", error);
//       res.status(500).json({ message: "Error fetching users" });
//     }
//   },

//   getProfile: async (req, res) => {
//     try {
//       const user = await userService.getUserProfile(req.user.id);
//       res.json(user);
//     } catch (error) {
//       console.error("Error fetching profile:", error);
//       res.status(404).json({ message: error.message });
//     }
//   },
// };


export const userController = {
getUsers: asyncHandler(async (req, res) => {
   const data = await userService.getAllUsers();
   logger.info("Users fetched successfully")
   res.status(200).json({success: true, data})
}),

getUserProfile: asyncHandler(async (req, res) => {
   const user = await userService.getUserProfile(req.user.id);
   logger.info("Profile fetched successfully", { userId: req.user.id })
   res.status(200).json({success: true, user})
})
}