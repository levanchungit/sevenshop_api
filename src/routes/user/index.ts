import { Router } from "express";

import controller from "../../controller/User";
const router = Router();

//Auth routes
router.post("/register", controller.register);
router.post("/login", controller.login);

export default router;
