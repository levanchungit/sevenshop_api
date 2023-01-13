import { Router } from "express";

import controller from "../../controller/Product";
const router = Router();

//Auth routes
router.get("/all", controller.getAllProducts);
router.get("/get/:id", controller.getProduct);
router.post("/create", controller.createProduct);
router.put("/update/:id", controller.updateProduct);
router.delete("/delete/:id", controller.deleteProduct);

export default router;
