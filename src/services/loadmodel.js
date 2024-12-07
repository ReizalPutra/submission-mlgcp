import {loadGraphModel} from "@tensorflow/tfjs-node";


export async function loadModel() {
    try {
        return loadGraphModel(process.env.MODEL_URL);
    } catch (error) {
        console.error('Error loading model:', error);
    }
}