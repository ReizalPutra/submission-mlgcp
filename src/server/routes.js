import express from "express";
import upload from "../middleware/multerMiddleware.js";
import {getPredictHandler, postPredictHandler} from "./handler.js";
const router = express.Router();

router.post("/predict", upload.single("image"), postPredictHandler);
router.get("/predict/histories", getPredictHandler);
export default router;