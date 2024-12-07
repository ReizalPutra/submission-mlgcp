import express from "express";
import upload from "../middleware/multerMiddleware.js";
import {postPredictHandler} from "./handler.js";
const router = express.Router();

router.post("/predict", upload.single("image"), postPredictHandler);

export default router;