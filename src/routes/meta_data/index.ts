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
router.post("/insertDetail", validateToken, insertDetail);
router.get("/getAll", validateToken, getAll);
router.get("/getAllDetail", validateToken, getAllDetail);
router.get("/get/:id", validateToken, get);
router.get("/getDetail/:id", validateToken, getDetail);
router.get(
  "/getDetailByMetaDataId/:meta_data_id",
  validateToken,
  getDetailByMetaDataID
);
router.post("/update/:id", validateToken, update);
router.post("/updateDetail/:id", validateToken, updateDetail);
router.post("/delete/:id", validateToken, deleteMetaData);
router.post("/deleteDetail/:id", validateToken, deleteMetaDataDetail);

export default router;
