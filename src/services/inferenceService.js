import {argMax, node} from "@tensorflow/tfjs-node";
import sharp from 'sharp';

async function validateImageFormat(buffer) {
    try {
        const metadata = await sharp(buffer).metadata();
        console.log('Image metadata:', metadata);

        // Menolak gambar grayscale (1 saluran)
        if (metadata.channels !== 3) {
            throw new Error('Gambar harus memiliki 3 saluran (RGB), tetapi gambar ini grayscale.');
        }

        return metadata;
    } catch (err) {
        throw err
    }
}
const REQUIRED_SHAPE = [224, 224]; // Ukuran input yang diharapkan oleh model

function validateImageShape(imageTensor) {
    const [batch, height, width, channels] = imageTensor.shape;
    if (height !== REQUIRED_SHAPE[0] || width !== REQUIRED_SHAPE[1] || channels !== 3) {
        throw new Error(`Format gambar tidak sesuai. Diharapkan ukuran ${REQUIRED_SHAPE.join('x')} dengan 3 saluran (RGB).`);
    }
}

export async function predictClassification(model, imageBuffer) {
    if (!imageBuffer || imageBuffer.length === 0) {
        throw new Error('Buffer gambar kosong.');
    }

    try {
        await validateImageFormat(imageBuffer);
        // Decode gambar dari buffer yang telah diproses
        const tensor = node.decodeImage(imageBuffer, 3)
            .resizeNearestNeighbor([224, 224])
            .expandDims()
            .toFloat();

        // Validasi bentuk gambar
        await validateImageShape(tensor);

        // Prediksi menggunakan model
        const prediction = model.predict(tensor);

        // Ambil data prediksi
        const predictionData = await prediction.data();
        const confidenceCancer = predictionData[0];  // Misal untuk "Cancer"
        const confidenceNonCancer = 1 - confidenceCancer;  // Menghitung "Non-Cancer"

        let label, confidenceScore, suggestion;
        if (confidenceCancer > confidenceNonCancer) {
            label = 'Cancer';
            confidenceScore = confidenceCancer * 100;
            suggestion = 'Segera periksa ke dokter!';
        } else {
            label = 'Non-cancer';
            confidenceScore = confidenceNonCancer * 100;
            suggestion = 'Penyakit kanker tidak terdeteksi.';
        }

        tensor.dispose();
        prediction.dispose();

        return {
            confidenceScore: confidenceScore,
            label: label,
            suggestion: suggestion,
        };
    } catch (err) {
        console.error('Error saat prediksi:', err.message);
        throw {
            statusCode: 400,
            message: err.message
        };
    }
}
