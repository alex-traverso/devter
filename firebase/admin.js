const admin = require("firebase-admin");

const serviceAccount = require("./fb-key/firebase-key.json");

try {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: process.env.FIREBASE_DATABASE_URL,
  });
} catch (err) {}

export const firestore = admin.firestore();
