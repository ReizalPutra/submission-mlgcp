import { Firestore } from '@google-cloud/firestore';
import "dotenv/config.js"
async function testFirestoreConnection() {
    try {
        console.log('Project ID:', process.env.FIREBASE_PROJECT_ID);
        console.log('Client Email:', process.env.FIREBASE_CLIENT_EMAIL);
        console.log('Private Key:', process.env.FIREBASE_PRIVATE_KEY ? 'Loaded' : 'Not Loaded');

        const db = new Firestore({
            projectId: process.env.FIREBASE_PROJECT_ID,
            credentials: {
                private_key: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
                client_email: process.env.FIREBASE_CLIENT_EMAIL,
            },
        });

        // Menulis data ke dokumen uji
        const testCollection = db.collection('test');
        const testDoc = testCollection.doc('testDoc');
        await testDoc.set({ message: 'Hello Firestore!' });
        console.log('Data berhasil ditulis ke Firestore.');

        // Membaca data dari dokumen uji
        const doc = await testDoc.get();
        if (doc.exists) {
            console.log('Data dari Firestore:', doc.data());
        } else {
            console.log('Dokumen tidak ditemukan.');
        }
    } catch (error) {
        console.error('Gagal menghubungkan ke Firestore:', error);
    }
}

testFirestoreConnection();
