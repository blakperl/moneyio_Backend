
// import { authService } from "../../../services/auth.js";

// export const authController = {
//   signup: async (req, res) => {
//     const { name, email, password } = req.body;

//     if (!name || !email || !password)
//       return res.status(400).json({ message: "All fields are required" });

//     try {
//       const result = await authService.signup({ name, email, password });
//       res.status(201).json(result);
//     } catch (error) {
//       console.error(error);
//       res.status(400).json({ message: error.message });
//     }
//   },

//   login: async (req, res) => {
//     const { email, password } = req.body;

//     if (!email || !password)
//       return res.status(400).json({ message: "Email and password required" });

//     try {
//       const result = await authService.login({ email, password });
//       res.json(result);
//     } catch (error) {
//       console.error(error);
//       res.status(400).json({ message: error.message });
//     }
//   },
// };


import { authService } from "../../../services/auth.js";
import { asyncHandler } from "../../../http/middlewares/asyncHandler.js";
import logger from "../../../../src/utils/logger.js";

export const authController = {
  signup: asyncHandler(async (req, res) => {
    const { name, email, password } = req.body;

    const result = await authService.signup({ name, email, password });

    logger.info("User signed up", { email });
    res.status(201).json({ success: true, data: result });
  }),

  login: asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    const result = await authService.login({ email, password });

    logger.info("User logged in", { email });
    res.status(200).json({ success: true, data: result });
  }),
};
