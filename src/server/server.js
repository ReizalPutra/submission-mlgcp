import express from "express";
import cors from "cors";
import 'dotenv/config.js'
import {loadModel} from "../services/loadmodel.js";
import routes from "./routes.js";
import upload from "../middleware/multerMiddleware.js";
import {postPredictHandler} from "./handler.js";
import inputError from "../exceptions/InputError.js";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
const port = process.env.PORT || 3000;

app.use(routes);

app.use(inputError);

app.listen(port, async () => {
    try {
        const model = await loadModel();
        app.locals.model = model;
        console.log(`Server berjalan di http://localhost:${port}`);
    } catch (error) {
        console.error('Gagal memulai server:', error);
    }
});