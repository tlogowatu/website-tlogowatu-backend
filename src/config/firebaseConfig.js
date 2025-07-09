const admin = require('firebase-admin');
// Pastikan file serviceAccountKey.json ada di folder utama
const serviceAccount = require('../../serviceAccountKey.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

module.exports = { db };