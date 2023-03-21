import {
  createAddress,
  deleteAddress,
  getAddress,
  getAddresses,
  setDefaultAddress,
  updateAddress,
} from "controllers/user/address";
import { Router } from "express";

const router = Router();

router.get("/", getAddresses);
router.post("/default", setDefaultAddress);
router.get("/:id", getAddress);
router.post("/", createAddress);
router.put("/:id", updateAddress);
router.delete("/:id", deleteAddress);

export default router;
