const admin = require("firebase-admin");

const serviceAccount = require("./firebase-keys.json");

try {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://devter-96289.firebaseio.com",
  });
} catch (err) {}

export const firestore = admin.firestore();
