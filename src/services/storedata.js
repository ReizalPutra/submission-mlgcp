import { Firestore } from '@google-cloud/firestore';
import "dotenv/config.js"


async function storeData(id, data) {
    try {
        const db = new Firestore({
            projectId: process.env.FIREBASE_PROJECT_ID,
            credentials: {
                private_key: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
                client_email: process.env.FIREBASE_CLIENT_EMAIL,
            },
        });
        const predictCollection = db.collection('prediction');
        return predictCollection.doc(id).set(data);

        } catch (error) {
            console.error('Error connecting to Firestore:', error);
            return error;
        }
}


export default storeData;