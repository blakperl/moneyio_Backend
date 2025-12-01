// import express from "express";
// import { PrismaClient } from "@prisma/client";
// import { verifyToken } from "../middlewares/authMiddleware.js";
// import { authorizeRoles } from "../middlewares/roleMiddleware.js";

// const router = express.Router();
// const prisma = new PrismaClient();

// router.get("/", verifyToken, authorizeRoles("admin"), async (req, res) => {
//   try {
//    const users = await prisma.user.findMany({
//       select: {
//         id: true,
//         name: true,
//         email: true,
//         balance: true,
//         role: {
//           select: { name: true }
//         },
//       },
//       orderBy: { name: "asc" },
//     });



//     res.json({
//       count: users.length,
//       users,
//     });
    
//   } catch (error) {
//     console.error("Error fetching users:", error);
//     res.status(500).json({ message: "Error fetching users" });
//   }
// });

// router.get("/profile", verifyToken, async (req, res) => {
//   try {
//     const user = await prisma.user.findUnique({
//       where: { id: req.user.id },
//       include: { role: true },
//     });

//     if (!user)
//       return res.status(404).json({ message: "User not found" });

//     res.json(user);
//   } catch (error) {
//     console.error("Error fetching profile:", error);
//     res.status(500).json({ message: "Error fetching profile" });
//   }
// });

// export default router;


import express from "express";
import { verifyToken } from "../http/middlewares/authMiddleware.js";
import { authorizeRoles } from "../http/middlewares/roleMiddleware.js";
import { userController } from "../http/controllers/users/index.js";

const router = express.Router();

router.get("/", verifyToken, authorizeRoles("admin"), userController.getUsers);
router.get("/profile", verifyToken, userController.getUserProfile);

export default router;
