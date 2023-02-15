import { Router } from "express";
import {
  insert,
  insertDetail,
  getAll,
  getAllDetail,
  get,
  getDetail,
} from "controllers/meta_data";
import { validateToken } from "middleware/validate";

const router = Router();

router.post("/insert", validateToken, insert);
router.post("/insert_detail", validateToken, insertDetail);
router.get("/getAll", validateToken, getAll);
router.get("/getAll_detail", validateToken, getAllDetail);
router.get("/get/:id", validateToken, get);
router.get("/get_detail/:id", validateToken, getDetail);

export default router;
