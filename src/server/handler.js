import {predictClassification} from "../services/inferenceService.js";
import {randomUUID} from "crypto";
import {getData, storeData} from "../services/dataFirestore.js";


async function postPredictHandler(req, res){
    const image = req.file;
    const model = req.app.locals.model;
    try {
        const {confidenceScore, label, suggestion} = await predictClassification(model, image.buffer);

        const id = randomUUID();
        const createdAt = new Date().toISOString();
        const data = {
            "id": id,
            "result": label,
            "suggestion": suggestion,
            "createdAt": createdAt,}
        await storeData(id, data);
        res.status(201).send({
            status: "success",
            message: "Model is predicted successfully",
            data
        });
    }catch(err){
        res.status(err.statusCode || 500).send({
            status: "fail",
            message: err.message});
    }
}

async function getPredictHandler(req, res){
    try {
        const result = await getData();
        res.status(200).send({
            status: "success",
            data: [result]
        })
    }catch(err){
        res.status(err.statusCode || 500).send({
            status: "fail",
            message: err.message
        })
    }
}

export {postPredictHandler, getPredictHandler};