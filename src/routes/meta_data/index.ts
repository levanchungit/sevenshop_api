import { Router } from "express";
import {
  insert,
  insertDetail,
  getAll,
  getAllDetail,
  get,
  getDetail,
  update,
  updateDetail,
  deleteMetaData,
  deleteMetaDataDetail,
  getDetailByMetaDataID,
} from "controllers/meta_data";
import { validateToken } from "middleware/validate";

const router = Router();

router.post("/insert", validateToken, insert);
router.post("/insert_detail", validateToken, insertDetail);
router.get("/getAll", validateToken, getAll);
router.get("/getAll_detail", validateToken, getAllDetail);
router.get("/get/:id", validateToken, get);
router.get("/get_detail/:id", validateToken, getDetail);
router.get(
  "/get_detail_meta-data-id/:meta_data_id",
  validateToken,
  getDetailByMetaDataID
);
router.post("/update/:id", validateToken, update);
router.post("/updateDetail/:id", validateToken, updateDetail);
router.post("/deleteMetaData/:id", validateToken, deleteMetaData);
router.post("/deleteMetaDataDetail/:id", validateToken, deleteMetaDataDetail);

export default router;
