import {Firestore} from '@google-cloud/firestore';
import "dotenv/config.js"

const db = new Firestore({
    projectId: process.env.FIREBASE_PROJECT_ID,
    credentials: {
        private_key: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
        client_email: process.env.FIREBASE_CLIENT_EMAIL,
    },
});
async function storeData(id, data) {
    try {
        const predictCollection = db.collection('prediction');
        return predictCollection.doc(id).set(data);

        } catch (error) {
            console.error('Error connecting to Firestore:', error);
            return error;
        }
}

async function getData() {
    try {
        const snapshot = await db.collection('prediction').get();

        // Jika tidak ada data, return status gagal
        if (snapshot.empty) {
            return { status: 'failure', data: [] };
        }

        // Format data sesuai kebutuhan
        return snapshot.docs.map(doc => ({
            id: doc.id,
            history: {
                ...doc.data().history,  // Menyalin seluruh data history
                id: doc.id,  // Menambahkan id sebagai bagian dari history
            },
        }))// Mengembalikan data langsung dalam array
        ;
    } catch (error) {
        console.error('Error connecting to Firestore:', error);
        return {
            status: 'failure',
            message: error.message,
        };
    }
}

export {storeData, getData};